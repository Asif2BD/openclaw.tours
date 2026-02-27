const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'councils.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Initialize database schema
db.serialize(() => {
  // Councils table
  db.run(`
    CREATE TABLE IF NOT EXISTS councils (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      lead TEXT,
      members TEXT,
      meeting_frequency TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Meetings table
  db.run(`
    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      council_id TEXT,
      topic TEXT,
      scheduled_date DATE,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (council_id) REFERENCES councils(id)
    )
  `);

  // Decisions table
  db.run(`
    CREATE TABLE IF NOT EXISTS decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      council_id TEXT,
      meeting_id INTEGER,
      decision TEXT,
      rationale TEXT,
      approved_by TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (council_id) REFERENCES councils(id),
      FOREIGN KEY (meeting_id) REFERENCES meetings(id)
    )
  `);

  // Action items table
  db.run(`
    CREATE TABLE IF NOT EXISTS action_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      decision_id INTEGER,
      assignee TEXT,
      task TEXT,
      due_date DATE,
      status TEXT DEFAULT 'open',
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (decision_id) REFERENCES decisions(id)
    )
  `);

  // Member inputs table
  db.run(`
    CREATE TABLE IF NOT EXISTS member_inputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meeting_id INTEGER,
      member_id TEXT,
      input_text TEXT,
      recommendations TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id)
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_meetings_council ON meetings(council_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_decisions_council ON decisions(council_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_action_items_assignee ON action_items(assignee)');
});

console.log('Councils database initialized at:', DB_PATH);

db.close();
