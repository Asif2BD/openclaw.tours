---
name: competitor-monitor
description: Monitor WordPress embedding plugin competitors including PDF Embedder, DearFlip, and others. Track website changes, pricing updates, new features, and content published by competitors. Generate alerts and reports.
---

# Competitor Monitor Skill

Monitor EmbedPress competitors and generate intelligence reports.

## Overview

This skill tracks competitors in the WordPress embedding plugin market:
- PDF Embedder
- DearFlip 3D Flipbook
- Embed PDF Viewer
- Other WordPress embedding plugins

## What It Monitors

1. **Website Changes** - Homepage, pricing, features
2. **Content Updates** - Blog posts, documentation
3. **Pricing Changes** - Free vs Pro, pricing tiers
4. **Feature Releases** - New capabilities
5. **Social Activity** - Announcements, updates

## Usage

### Manual Scan
```bash
cd /root/.openclaw/workspace/competitor-monitor
node scripts/scan.js --competitor pdf-embedder
```

### Check All Competitors
```bash
node scripts/scan-all.js
```

### Generate Report
```bash
node scripts/report.js --daily
node scripts/report.js --weekly
```

### View Alerts
```bash
node scripts/alerts.js --list
node scripts/alerts.js --mark-read
```

## Configuration

Competitors are configured in `config/competitors.json`:

```json
{
  "competitors": [
    {
      "id": "pdf-embedder",
      "name": "PDF Embedder",
      "website": "https://wordpress.org/plugins/pdf-embedder/",
      "pricing_url": "https://wp-pdf.com/pricing/",
      "blog_url": "https://wp-pdf.com/blog/",
      "check_frequency": "daily"
    }
  ]
}
```

## Database Schema

SQLite database at `data/competitor-monitor.db`:

- `competitors` - Competitor information
- `snapshots` - Website snapshots
- `changes` - Detected changes
- `alerts` - Alert queue
- `reports` - Generated reports

## Automation

### Cron Setup
```bash
# Daily scan at 8 AM
0 8 * * * cd /root/.openclaw/workspace/competitor-monitor && node scripts/scan-all.js

# Weekly report on Mondays at 9 AM
0 9 * * 1 cd /root/.openclaw/workspace/competitor-monitor && node scripts/report.js --weekly
```

### Telegram Notifications
Alerts are sent to Telegram when significant changes are detected.

## Output

- Daily scan results: `data/daily/YYYY-MM-DD.json`
- Weekly reports: `data/reports/weekly-YYYY-MM-DD.md`
- Alert log: `data/alerts.json`

## Dependencies

- Node.js 18+
- SQLite3
- cheerio (HTML parsing)
- axios (HTTP requests)
- node-cron (scheduling)

## Team Assignment

- **Ironclad**: Technical implementation, database, automation
- **Flash**: Social monitoring, content tracking
- **Kimi Claw**: Strategy oversight, alert review
