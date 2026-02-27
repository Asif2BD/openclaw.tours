const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'competitor-monitor.db');

class CompetitorScanner {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
  }

  async scanCompetitor(competitorId) {
    const competitor = await this.getCompetitor(competitorId);
    if (!competitor) {
      throw new Error(`Competitor not found: ${competitorId}`);
    }

    console.log(`Scanning ${competitor.name}...`);
    const results = {
      competitor: competitor,
      snapshots: [],
      changes: []
    };

    // Scan website
    if (competitor.website) {
      const websiteSnapshot = await this.scanUrl(competitor.website, competitorId);
      if (websiteSnapshot) {
        results.snapshots.push(websiteSnapshot);
        const changes = await this.detectChanges(competitorId, 'website', websiteSnapshot);
        results.changes.push(...changes);
      }
    }

    // Scan pricing page
    if (competitor.pricing_url) {
      const pricingSnapshot = await this.scanUrl(competitor.pricing_url, competitorId);
      if (pricingSnapshot) {
        results.snapshots.push(pricingSnapshot);
        const changes = await this.detectChanges(competitorId, 'pricing', pricingSnapshot);
        results.changes.push(...changes);
      }
    }

    // Scan blog
    if (competitor.blog_url) {
      const blogSnapshot = await this.scanUrl(competitor.blog_url, competitorId);
      if (blogSnapshot) {
        results.snapshots.push(blogSnapshot);
        const changes = await this.detectChanges(competitorId, 'blog', blogSnapshot);
        results.changes.push(...changes);
      }
    }

    // Create alerts for significant changes
    await this.createAlerts(results.changes, competitor);

    return results;
  }

  async scanUrl(url, competitorId) {
    try {
      console.log(`  Fetching: ${url}`);
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const content = response.data;
      const contentHash = crypto.createHash('md5').update(content).digest('hex');
      
      // Extract preview (first 500 chars of text)
      const $ = cheerio.load(content);
      const textContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 500);

      const snapshot = {
        competitor_id: competitorId,
        url: url,
        content_hash: contentHash,
        content_preview: textContent,
        status_code: response.status,
        scraped_at: new Date().toISOString()
      };

      // Save snapshot
      await this.saveSnapshot(snapshot);

      return snapshot;
    } catch (error) {
      console.error(`  Error scanning ${url}:`, error.message);
      return null;
    }
  }

  async detectChanges(competitorId, changeType, snapshot) {
    return new Promise((resolve, reject) => {
      // Get previous snapshot
      this.db.get(
        `SELECT * FROM snapshots 
         WHERE competitor_id = ? AND url = ? 
         ORDER BY scraped_at DESC LIMIT 1 OFFSET 1`,
        [competitorId, snapshot.url],
        (err, previousSnapshot) => {
          if (err) return reject(err);
          
          const changes = [];
          
          if (previousSnapshot) {
            // Check if content changed
            if (previousSnapshot.content_hash !== snapshot.content_hash) {
              const change = {
                competitor_id: competitorId,
                change_type: changeType,
                field_name: 'content',
                old_value: previousSnapshot.content_preview,
                new_value: snapshot.content_preview,
                severity: this.assessSeverity(changeType),
                detected_at: new Date().toISOString()
              };
              
              this.saveChange(change);
              changes.push(change);
              
              console.log(`  ✓ Change detected: ${changeType}`);
            } else {
              console.log(`  ✓ No changes: ${changeType}`);
            }
          } else {
            console.log(`  ✓ First scan: ${changeType}`);
          }
          
          resolve(changes);
        }
      );
    });
  }

  assessSeverity(changeType) {
    switch (changeType) {
      case 'pricing':
        return 'high';
      case 'website':
        return 'medium';
      case 'blog':
        return 'low';
      default:
        return 'low';
    }
  }

  async createAlerts(changes, competitor) {
    for (const change of changes) {
      if (change.severity === 'high' || change.severity === 'medium') {
        const alert = {
          competitor_id: change.competitor_id,
          change_id: change.id,
          message: `${competitor.name}: ${change.change_type} changed`,
          severity: change.severity,
          sent: 0,
          created_at: new Date().toISOString()
        };
        
        await this.saveAlert(alert);
        console.log(`  🚨 Alert created: ${alert.message}`);
      }
    }
  }

  getCompetitor(competitorId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM competitors WHERE id = ?',
        [competitorId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  saveSnapshot(snapshot) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO snapshots (competitor_id, url, content_hash, content_preview, status_code, scraped_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [snapshot.competitor_id, snapshot.url, snapshot.content_hash, snapshot.content_preview, 
         snapshot.status_code, snapshot.scraped_at],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  saveChange(change) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO changes (competitor_id, change_type, field_name, old_value, new_value, severity, detected_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [change.competitor_id, change.change_type, change.field_name, change.old_value, 
         change.new_value, change.severity, change.detected_at],
        function(err) {
          if (err) reject(err);
          else {
            change.id = this.lastID;
            resolve(this.lastID);
          }
        }
      );
    });
  }

  saveAlert(alert) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO alerts (competitor_id, change_id, message, severity, sent, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [alert.competitor_id, alert.change_id, alert.message, alert.severity, alert.sent, alert.created_at],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getRecentChanges(days = 7) {
    return new Promise((resolve, reject) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      this.db.all(
        `SELECT c.name as competitor_name, ch.* 
         FROM changes ch
         JOIN competitors c ON ch.competitor_id = c.id
         WHERE ch.detected_at >= ?
         ORDER BY ch.detected_at DESC`,
        [startDate.toISOString()],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = CompetitorScanner;
