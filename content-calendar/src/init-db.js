const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'content-calendar.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Initialize database schema
db.serialize(() => {
  // Content items table
  db.run(`
    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'idea',
      assignee TEXT,
      reviewer TEXT,
      description TEXT,
      outline TEXT,
      content TEXT,
      channels TEXT,
      scheduled_date DATE,
      published_date DATE,
      due_date DATE,
      estimated_hours INTEGER,
      actual_hours INTEGER,
      priority TEXT DEFAULT 'medium',
      tags TEXT,
      source_idea_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ideas backlog table
  db.run(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT,
      source TEXT,
      priority TEXT DEFAULT 'medium',
      converted_to_content_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Calendar slots table
  db.run(`
    CREATE TABLE IF NOT EXISTS calendar_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id TEXT,
      slot_date DATE NOT NULL,
      slot_time TIME,
      channel TEXT,
      status TEXT DEFAULT 'scheduled',
      FOREIGN KEY (content_id) REFERENCES content_items(id)
    )
  `);

  // Performance metrics table
  db.run(`
    CREATE TABLE IF NOT EXISTS performance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id TEXT,
      channel TEXT,
      metric_name TEXT,
      metric_value REAL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES content_items(id)
    )
  `);

  // Activity log table
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id TEXT,
      action TEXT,
      actor TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (content_id) REFERENCES content_items(id)
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_content_status ON content_items(status)');
  db.run('CREATE INDEX IF NOT EXISTS idx_content_assignee ON content_items(assignee)');
  db.run('CREATE INDEX IF NOT EXISTS idx_content_scheduled ON content_items(scheduled_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_content_type ON content_items(type)');
  db.run('CREATE INDEX IF NOT EXISTS idx_slots_date ON calendar_slots(slot_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_performance_content ON performance(content_id)');
});

console.log('Content Calendar database initialized at:', DB_PATH);

db.close();
