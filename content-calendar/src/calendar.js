const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'content-calendar.db');
const configPath = path.join(__dirname, '..', 'config', 'content-types.json');

class ContentCalendar {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  generateId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CONTENT-${date}-${random}`;
  }

  async addContent({ title, type, description = '', assignee = null, dueDate = null, priority = 'medium', channels = [] }) {
    const contentType = this.config.content_types.find(t => t.id === type);
    if (!contentType) {
      throw new Error(`Unknown content type: ${type}`);
    }

    const id = this.generateId();
    const actualAssignee = assignee || contentType.default_assignee;
    const actualReviewer = contentType.default_reviewer;
    const estimatedHours = contentType.estimated_hours;

    const content = {
      id,
      title,
      type,
      status: 'idea',
      assignee: actualAssignee,
      reviewer: actualReviewer,
      description,
      channels: JSON.stringify(channels.length > 0 ? channels : contentType.channels),
      due_date: dueDate,
      estimated_hours: estimatedHours,
      priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await this.saveContent(content);
    await this.logActivity(id, 'created', 'system', `Content created: ${title}`);

    return content;
  }

  async updateStatus(contentId, newStatus, actor = 'system') {
    const validStatuses = this.config.statuses;
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const self = this;
    return new Promise((resolve, reject) => {
      self.db.run(
        `UPDATE content_items 
         SET status = ?, updated_at = ?
         WHERE id = ?`,
        [newStatus, new Date().toISOString(), contentId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            if (this.changes > 0) {
              self.logActivity(contentId, 'status_change', actor, `Status changed to: ${newStatus}`)
                .then(() => resolve(true))
                .catch(reject);
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  }

  async scheduleContent(contentId, date, channels = []) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.db.run(
        `UPDATE content_items 
         SET scheduled_date = ?, status = 'scheduled', updated_at = ?
         WHERE id = ?`,
        [date, new Date().toISOString(), contentId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Add calendar slots
            const slotPromises = channels.map(channel => 
              self.addCalendarSlot(contentId, date, channel)
            );
            Promise.all(slotPromises)
              .then(() => self.logActivity(contentId, 'scheduled', 'system', `Scheduled for: ${date}`))
              .then(() => resolve(this.changes > 0))
              .catch(reject);
          }
        }
      );
    });
  }

  async addCalendarSlot(contentId, date, channel) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO calendar_slots (content_id, slot_date, channel)
         VALUES (?, ?, ?)`,
        [contentId, date, channel],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getContentByStatus(status) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM content_items WHERE status = ? ORDER BY due_date ASC`,
        [status],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getContentByAssignee(assignee) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM content_items WHERE assignee = ? AND status != 'published' AND status != 'archived'
         ORDER BY due_date ASC`,
        [assignee],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getWeeklyCalendar(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT c.*, cs.slot_date, cs.channel
         FROM content_items c
         LEFT JOIN calendar_slots cs ON c.id = cs.content_id
         WHERE (c.scheduled_date BETWEEN ? AND ?) OR (cs.slot_date BETWEEN ? AND ?)
         ORDER BY c.scheduled_date ASC`,
        [startDate, endDate.toISOString().split('T')[0], startDate, endDate.toISOString().split('T')[0]],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getOverdueContent() {
    const today = new Date().toISOString().split('T')[0];
    
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM content_items 
         WHERE due_date < ? AND status NOT IN ('published', 'archived')
         ORDER BY due_date ASC`,
        [today],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async addIdea({ title, description = '', type = null, source = 'manual', priority = 'medium' }) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO ideas (title, description, type, source, priority)
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, type, source, priority],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getIdeas(source = null) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM ideas WHERE converted_to_content_id IS NULL';
      const params = [];
      
      if (source) {
        query += ' AND source = ?';
        params.push(source);
      }
      
      query += ' ORDER BY priority DESC, created_at DESC';
      
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async convertIdeaToContent(ideaId, contentId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ideas SET converted_to_content_id = ? WHERE id = ?`,
        [contentId, ideaId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  saveContent(content) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO content_items 
         (id, title, type, status, assignee, reviewer, description, channels, 
          due_date, estimated_hours, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [content.id, content.title, content.type, content.status, content.assignee,
         content.reviewer, content.description, content.channels, content.due_date,
         content.estimated_hours, content.priority, content.created_at, content.updated_at],
        function(err) {
          if (err) reject(err);
          else resolve(content.id);
        }
      );
    });
  }

  logActivity(contentId, action, actor, details) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO activity_log (content_id, action, actor, details)
         VALUES (?, ?, ?, ?)`,
        [contentId, action, actor, details],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getAllContent() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM content_items ORDER BY created_at DESC`,
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

module.exports = ContentCalendar;
