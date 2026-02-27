const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'councils.db');
const configPath = path.join(__dirname, '..', 'config', 'councils.json');

class Councils {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  async loadCouncils() {
    for (const council of this.config.councils) {
      await this.saveCouncil(council);
    }
  }

  async saveCouncil(council) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO councils (id, name, description, lead, members, meeting_frequency)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [council.id, council.name, council.description, council.lead, 
         JSON.stringify(council.members), council.meeting_frequency],
        function(err) {
          if (err) reject(err);
          else resolve(council.id);
        }
      );
    });
  }

  async getCouncils() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM councils', (err, rows) => {
        if (err) reject(err);
        else {
          rows.forEach(row => {
            row.members = JSON.parse(row.members);
          });
          resolve(rows);
        }
      });
    });
  }

  async scheduleMeeting(councilId, topic, date) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO meetings (council_id, topic, scheduled_date)
         VALUES (?, ?, ?)`,
        [councilId, topic, date],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async recordDecision(councilId, meetingId, decision, rationale, approvedBy) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO decisions (council_id, meeting_id, decision, rationale, approved_by)
         VALUES (?, ?, ?, ?, ?)`,
        [councilId, meetingId, decision, rationale, approvedBy],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async createActionItem(decisionId, assignee, task, dueDate) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO action_items (decision_id, assignee, task, due_date)
         VALUES (?, ?, ?, ?)`,
        [decisionId, assignee, task, dueDate],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getActionItems(assignee = null, status = 'open') {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM action_items WHERE status = ?';
      const params = [status];

      if (assignee) {
        query += ' AND assignee = ?';
        params.push(assignee);
      }

      query += ' ORDER BY due_date ASC';

      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async generateCouncilReport(councilId) {
    const council = await this.getCouncilById(councilId);
    const decisions = await this.getDecisionsByCouncil(councilId);
    const actionItems = await this.getActionItems(null, 'open');

    let report = `# ${council.name} Report\n\n`;
    report += `**Lead:** ${council.lead}\n`;
    report += `**Members:** ${council.members.join(', ')}\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    report += `## Recent Decisions\n\n`;
    if (decisions.length > 0) {
      decisions.slice(0, 5).forEach(d => {
        report += `- **${d.decision}** (${d.status})\n`;
        report += `  ${d.rationale}\n\n`;
      });
    } else {
      report += `No recent decisions.\n\n`;
    }

    const councilActions = actionItems.filter(a => 
      council.members.includes(a.assignee)
    );

    if (councilActions.length > 0) {
      report += `## Open Action Items (${councilActions.length})\n\n`;
      councilActions.forEach(a => {
        report += `- [ ] **${a.task}**\n`;
        report += `  Assignee: ${a.assignee} | Due: ${a.due_date}\n\n`;
      });
    }

    return report;
  }

  getCouncilById(councilId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM councils WHERE id = ?',
        [councilId],
        (err, row) => {
          if (err) reject(err);
          else {
            if (row) {
              row.members = JSON.parse(row.members);
            }
            resolve(row);
          }
        }
      );
    });
  }

  getDecisionsByCouncil(councilId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM decisions 
         WHERE council_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [councilId],
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

module.exports = Councils;
