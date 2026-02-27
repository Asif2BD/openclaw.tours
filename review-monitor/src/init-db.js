const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'review-monitor.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// Initialize database schema
db.serialize(() => {
  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      external_id TEXT,
      author TEXT,
      rating INTEGER,
      title TEXT,
      content TEXT,
      url TEXT,
      sentiment TEXT,
      sentiment_score REAL,
      responded BOOLEAN DEFAULT 0,
      response_text TEXT,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Feature requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS feature_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER,
      feature TEXT,
      category TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'new',
      extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (review_id) REFERENCES reviews(id)
    )
  `);

  // Sentiment analysis table
  db.run(`
    CREATE TABLE IF NOT EXISTS sentiment_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT,
      date DATE,
      avg_rating REAL,
      positive_count INTEGER,
      neutral_count INTEGER,
      negative_count INTEGER,
      total_count INTEGER,
      analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_id INTEGER,
      alert_type TEXT,
      message TEXT,
      severity TEXT,
      sent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (review_id) REFERENCES reviews(id)
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform)');
  db.run('CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment)');
  db.run('CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(reviewed_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_features_status ON feature_requests(status)');
});

console.log('Review Monitor database initialized at:', DB_PATH);

db.close();
