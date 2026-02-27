---
name: daily-briefing
description: Automated daily briefing system for EmbedPress. Aggregates data from all skills (Competitor Monitor, Content Calendar, SEO Monitor, Review Monitor) and generates morning briefings with priorities and action items.
---

# Daily Briefing System

Your morning intelligence briefing for EmbedPress.

## Overview

Aggregates data from all 4 skills:
- Competitor Monitor - competitor activity
- Content Calendar - upcoming deadlines
- SEO Monitor - ranking changes
- Review Monitor - customer feedback

## Briefing Sections

### 1. Executive Summary
- Key metrics at a glance
- Today's priorities
- Alerts requiring attention

### 2. Competitor Intelligence
- Competitor changes detected
- New content from competitors
- Pricing updates

### 3. Content Status
- Content due today
- Overdue items
- Upcoming deadlines (next 7 days)

### 4. SEO Performance
- Ranking changes
- New keyword opportunities
- Content gaps to address

### 5. Customer Feedback
- New reviews
- Feature requests
- Support issues

### 6. Today's Priorities
- Top 3 action items
- Meetings scheduled
- Deadlines

## Delivery

### Time
- Generated: 8:00 AM daily
- Delivered: Telegram DM
- Format: Markdown with emojis

### Format
```
🌅 EmbedPress Daily Briefing
📅 Wednesday, February 18, 2026

📊 EXECUTIVE SUMMARY
• 2 competitor changes detected
• 1 content item due today
• 0 overdue items

🎯 TODAY'S PRIORITIES
1. Complete comparison article
2. Respond to new review
3. Check competitor pricing
```

## Usage

### Generate Briefing
```bash
cd /root/.openclaw/workspace/daily-briefing
node scripts/generate.js
```

### Schedule Daily
```bash
# Add to crontab
0 8 * * * /root/.openclaw/workspace/daily-briefing/scripts/generate.sh
```

### View Briefing History
```bash
node scripts/history.js --days 7
```

## Configuration

Edit `config/briefing-config.json`:
- Delivery time
- Sections to include
- Alert thresholds
- Recipients

## Integration

### Data Sources
- Competitor Monitor: `../competitor-monitor/data/`
- Content Calendar: `../content-calendar/data/`
- SEO Monitor: `../seo-monitor/data/`
- Review Monitor: `../review-monitor/data/`

### Output
- Daily briefings: `data/briefings/YYYY-MM-DD.md`
- Telegram notifications
- Email (optional)
