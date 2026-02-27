const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'seo-monitor.db');
const configPath = path.join(__dirname, '..', 'config', 'keywords.json');

class SEOMonitor {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  async loadKeywords() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM keywords', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async addKeyword(keywordData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO keywords (id, keyword, search_volume, difficulty, priority, category, target_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [keywordData.id, keywordData.keyword, keywordData.search_volume, 
         keywordData.difficulty, keywordData.priority, keywordData.category, keywordData.target_url],
        function(err) {
          if (err) reject(err);
          else resolve(keywordData.id);
        }
      );
    });
  }

  async recordRanking(keywordId, position, url, searchEngine = 'google') {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO rankings (keyword_id, position, url, search_engine, checked_at)
         VALUES (?, ?, ?, ?, ?)`,
        [keywordId, position, url, searchEngine, new Date().toISOString()],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getLatestRankings() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT k.*, r.position, r.url, r.checked_at
         FROM keywords k
         LEFT JOIN (
           SELECT keyword_id, position, url, checked_at
           FROM rankings
           WHERE (keyword_id, checked_at) IN (
             SELECT keyword_id, MAX(checked_at)
             FROM rankings
             GROUP BY keyword_id
           )
         ) r ON k.id = r.keyword_id
         ORDER BY k.priority DESC, k.keyword`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getRankingHistory(keywordId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM rankings 
         WHERE keyword_id = ? AND checked_at >= ?
         ORDER BY checked_at ASC`,
        [keywordId, startDate.toISOString()],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async addContentGap(keyword, competitorId, competitorPosition, ourPosition, gapType, priority) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO content_gaps (keyword, competitor_id, competitor_position, our_position, gap_type, priority)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [keyword, competitorId, competitorPosition, ourPosition, gapType, priority],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getContentGaps(status = 'open') {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM content_gaps 
         WHERE status = ?
         ORDER BY priority DESC, created_at DESC`,
        [status],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async generateSEOReport() {
    const keywords = await this.loadKeywords();
    const rankings = await this.getLatestRankings();
    const gaps = await this.getContentGaps('open');

    let report = `# SEO Monitor Report\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    // Rankings summary
    report += `## Keyword Rankings\n\n`;
    report += `| Keyword | Position | Priority | Category |\n`;
    report += `|---------|----------|----------|----------|\n`;
    
    rankings.forEach(r => {
      const position = r.position ? r.position.toString() : 'Not tracked';
      report += `| ${r.keyword} | ${position} | ${r.priority} | ${r.category} |\n`;
    });

    report += `\n`;

    // Content gaps
    if (gaps.length > 0) {
      report += `## Content Gaps (${gaps.length})\n\n`;
      gaps.forEach(gap => {
        report += `- **${gap.keyword}** (${gap.priority})\n`;
        report += `  - Competitor: ${gap.competitor_id} at position ${gap.competitor_position}\n`;
        report += `  - Gap type: ${gap.gap_type}\n\n`;
      });
    }

    // Recommendations
    report += `## Recommendations\n\n`;
    
    const highPriorityNoRank = rankings.filter(r => r.priority === 'high' && !r.position);
    if (highPriorityNoRank.length > 0) {
      report += `### High Priority Keywords to Target\n`;
      highPriorityNoRank.forEach(r => {
        report += `- ${r.keyword}\n`;
      });
      report += `\n`;
    }

    if (gaps.length > 0) {
      report += `### Content to Create\n`;
      report += `Create content to fill ${gaps.length} identified gaps.\n\n`;
    }

    report += `---\n`;
    report += `*Report generated by SEO Monitor*\n`;

    return report;
  }

  close() {
    this.db.close();
  }
}

module.exports = SEOMonitor;
