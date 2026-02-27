const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'review-monitor.db');

class ReviewMonitor {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
  }

  async addReview(review) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO reviews (platform, external_id, author, rating, title, content, url, sentiment, sentiment_score, reviewed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [review.platform, review.external_id, review.author, review.rating, 
         review.title, review.content, review.url, review.sentiment, 
         review.sentiment_score, review.reviewed_at],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getReviewsByPlatform(platform, limit = 20) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM reviews 
         WHERE platform = ?
         ORDER BY reviewed_at DESC
         LIMIT ?`,
        [platform, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getRecentReviews(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM reviews 
         WHERE reviewed_at >= ?
         ORDER BY reviewed_at DESC`,
        [startDate.toISOString()],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getSentimentSummary(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT 
          platform,
          sentiment,
          COUNT(*) as count,
          AVG(rating) as avg_rating
         FROM reviews
         WHERE reviewed_at >= ?
         GROUP BY platform, sentiment`,
        [startDate.toISOString()],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async addFeatureRequest(reviewId, feature, category) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO feature_requests (review_id, feature, category)
         VALUES (?, ?, ?)`,
        [reviewId, feature, category],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async getFeatureRequests(status = 'new') {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT fr.*, r.platform, r.author
         FROM feature_requests fr
         JOIN reviews r ON fr.review_id = r.id
         WHERE fr.status = ?
         ORDER BY fr.priority DESC, fr.extracted_at DESC`,
        [status],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async generateReport() {
    const recentReviews = await this.getRecentReviews(30);
    const sentimentSummary = await this.getSentimentSummary(30);
    const featureRequests = await this.getFeatureRequests('new');

    let report = `# Review Monitor Report\n`;
    report += `**Period:** Last 30 days\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    // Summary
    report += `## Summary\n`;
    report += `- Total reviews: ${recentReviews.length}\n`;
    
    const avgRating = recentReviews.length > 0 
      ? (recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length).toFixed(2)
      : 'N/A';
    report += `- Average rating: ${avgRating}\n`;
    report += `- New feature requests: ${featureRequests.length}\n\n`;

    // Sentiment breakdown
    if (sentimentSummary.length > 0) {
      report += `## Sentiment by Platform\n\n`;
      
      const byPlatform = {};
      sentimentSummary.forEach(s => {
        if (!byPlatform[s.platform]) {
          byPlatform[s.platform] = {};
        }
        byPlatform[s.platform][s.sentiment] = s.count;
      });

      for (const [platform, sentiments] of Object.entries(byPlatform)) {
        report += `### ${platform}\n`;
        const total = Object.values(sentiments).reduce((a, b) => a + b, 0);
        for (const [sentiment, count] of Object.entries(sentiments)) {
          const pct = ((count / total) * 100).toFixed(1);
          const emoji = sentiment === 'positive' ? '🟢' : sentiment === 'negative' ? '🔴' : '🟡';
          report += `- ${emoji} ${sentiment}: ${count} (${pct}%)\n`;
        }
        report += '\n';
      }
    }

    // Feature requests
    if (featureRequests.length > 0) {
      report += `## Feature Requests (${featureRequests.length})\n\n`;
      featureRequests.forEach(fr => {
        report += `- **${fr.feature}** (${fr.category})\n`;
        report += `  From: ${fr.platform} review by ${fr.author}\n\n`;
      });
    }

    // Recent reviews
    if (recentReviews.length > 0) {
      report += `## Recent Reviews\n\n`;
      recentReviews.slice(0, 5).forEach(r => {
        const emoji = r.rating >= 4 ? '⭐' : r.rating >= 3 ? '➖' : '⚠️';
        report += `${emoji} **${r.rating}/5** - ${r.title || 'No title'}\n`;
        report += `   Platform: ${r.platform} | Author: ${r.author}\n`;
        if (r.content) {
          report += `   "${r.content.substring(0, 100)}..."\n`;
        }
        report += '\n';
      });
    }

    report += `---\n`;
    report += `*Report generated by Review Monitor*\n`;

    return report;
  }

  close() {
    this.db.close();
  }
}

module.exports = ReviewMonitor;
