const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'competitor-monitor.db');

class AlertManager {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
  }

  async getUnsentAlerts() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT a.*, c.name as competitor_name, c.website
         FROM alerts a
         JOIN competitors c ON a.competitor_id = c.id
         WHERE a.sent = 0
         ORDER BY a.severity DESC, a.created_at DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getRecentAlerts(limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT a.*, c.name as competitor_name
         FROM alerts a
         JOIN competitors c ON a.competitor_id = c.id
         ORDER BY a.created_at DESC
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async markAlertSent(alertId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE alerts SET sent = 1, sent_at = ? WHERE id = ?`,
        [new Date().toISOString(), alertId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  async markAllSent() {
    const alerts = await this.getUnsentAlerts();
    for (const alert of alerts) {
      await this.markAlertSent(alert.id);
    }
    return alerts.length;
  }

  async getAlertStats() {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN sent = 0 THEN 1 ELSE 0 END) as unsent,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_severity
         FROM alerts`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  formatAlertMessage(alert) {
    const emoji = alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️';
    return `${emoji} *Competitor Alert: ${alert.competitor_name}*

${alert.message}

Severity: ${alert.severity.toUpperCase()}
Time: ${new Date(alert.created_at).toLocaleString()}

[View Details](${alert.website || '#'})`;
  }

  close() {
    this.db.close();
  }
}

module.exports = AlertManager;
