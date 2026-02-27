const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'seo-monitor.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Initialize database schema
db.serialize(() => {
  // Keywords table
  db.run(`
    CREATE TABLE IF NOT EXISTS keywords (
      id TEXT PRIMARY KEY,
      keyword TEXT NOT NULL,
      search_volume TEXT,
      difficulty TEXT,
      priority TEXT,
      category TEXT,
      target_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Rankings table
  db.run(`
    CREATE TABLE IF NOT EXISTS rankings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword_id TEXT,
      position INTEGER,
      url TEXT,
      search_engine TEXT DEFAULT 'google',
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (keyword_id) REFERENCES keywords(id)
    )
  `);

  // Competitor rankings table
  db.run(`
    CREATE TABLE IF NOT EXISTS competitor_rankings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competitor_id TEXT,
      keyword_id TEXT,
      position INTEGER,
      url TEXT,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Content gaps table
  db.run(`
    CREATE TABLE IF NOT EXISTS content_gaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT,
      competitor_id TEXT,
      competitor_position INTEGER,
      our_position INTEGER,
      gap_type TEXT,
      priority TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Technical checks table
  db.run(`
    CREATE TABLE IF NOT EXISTS technical_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT,
      check_type TEXT,
      status TEXT,
      score REAL,
      details TEXT,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // GEO citations table
  db.run(`
    CREATE TABLE IF NOT EXISTS geo_citations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT,
      query TEXT,
      cited_url TEXT,
      context TEXT,
      detected_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_rankings_keyword ON rankings(keyword_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_rankings_date ON rankings(checked_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_competitor_rankings ON competitor_rankings(competitor_id, keyword_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_content_gaps_status ON content_gaps(status)');
});

console.log('SEO Monitor database initialized at:', DB_PATH);

db.close();
