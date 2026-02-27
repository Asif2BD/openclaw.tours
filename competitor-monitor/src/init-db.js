const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'competitor-monitor.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Initialize database schema
db.serialize(() => {
  // Competitors table
  db.run(`
    CREATE TABLE IF NOT EXISTS competitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      website TEXT,
      pricing_url TEXT,
      blog_url TEXT,
      description TEXT,
      check_frequency TEXT DEFAULT 'daily',
      priority TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Snapshots table - stores website snapshots
  db.run(`
    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competitor_id TEXT,
      url TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      content_preview TEXT,
      status_code INTEGER,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (competitor_id) REFERENCES competitors(id)
    )
  `);

  // Changes table - tracks detected changes
  db.run(`
    CREATE TABLE IF NOT EXISTS changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competitor_id TEXT,
      change_type TEXT NOT NULL,
      field_name TEXT,
      old_value TEXT,
      new_value TEXT,
      severity TEXT DEFAULT 'low',
      detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed BOOLEAN DEFAULT 0,
      FOREIGN KEY (competitor_id) REFERENCES competitors(id)
    )
  `);

  // Alerts table - alert queue
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competitor_id TEXT,
      change_id INTEGER,
      message TEXT NOT NULL,
      severity TEXT DEFAULT 'medium',
      sent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_at DATETIME,
      FOREIGN KEY (competitor_id) REFERENCES competitors(id),
      FOREIGN KEY (change_id) REFERENCES changes(id)
    )
  `);

  // Reports table - generated reports
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_type TEXT NOT NULL,
      period_start DATE,
      period_end DATE,
      content TEXT NOT NULL,
      file_path TEXT,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_snapshots_competitor ON snapshots(competitor_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_changes_competitor ON changes(competitor_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_changes_detected ON changes(detected_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_alerts_sent ON alerts(sent)');
});

console.log('Database initialized at:', DB_PATH);

db.close();
