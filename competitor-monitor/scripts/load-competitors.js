const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'competitor-monitor.db');
const configPath = path.join(__dirname, '..', 'config', 'competitors.json');

const db = new sqlite3.Database(DB_PATH);

// Load competitors from config
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('Loading competitors into database...');

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO competitors 
    (id, name, website, pricing_url, blog_url, description, check_frequency, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const comp of config.competitors) {
    stmt.run(
      comp.id,
      comp.name,
      comp.website,
      comp.pricing_url,
      comp.blog_url,
      comp.description,
      comp.check_frequency,
      comp.priority
    );
    console.log(`  ✓ Loaded: ${comp.name}`);
  }

  stmt.finalize();
});

db.close();
console.log(`\nLoaded ${config.competitors.length} competitors`);
