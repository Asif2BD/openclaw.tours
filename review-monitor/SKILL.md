---
name: review-monitor
description: Monitor customer reviews for EmbedPress across WordPress.org, G2, Capterra, and social media. Track sentiment, extract feature requests, and draft responses.
---

# Review Monitor Skill

Track and analyze EmbedPress customer reviews.

## Overview

Monitor reviews across platforms:
- WordPress.org plugin reviews
- G2 product reviews
- Capterra reviews
- Social media mentions

## Features

### 1. Review Tracking
- Monitor new reviews daily
- Track ratings and sentiment
- Extract key themes
- Identify feature requests

### 2. Sentiment Analysis
- Positive, neutral, negative classification
- Trend analysis over time
- Alert on negative reviews
- Track sentiment improvements

### 3. Feature Request Extraction
- Auto-extract feature requests
- Categorize by type
- Prioritize by frequency
- Feed into product roadmap

### 4. Response Management
- Draft response suggestions
- Track response times
- Monitor competitor responses
- Best response templates

## Platforms Monitored

| Platform | URL | Priority |
|----------|-----|----------|
| WordPress.org | https://wordpress.org/plugins/embedpress/reviews/ | High |
| G2 | https://www.g2.com/products/embedpress/reviews | Medium |
| Capterra | https://www.capterra.com/p/10012645/EmbedPress/ | Medium |
| Twitter/X | @embedpress mentions | Low |

## Usage

### Check New Reviews
```bash
cd /root/.openclaw/workspace/review-monitor
node scripts/check.js --platform wordpress
```

### View All Reviews
```bash
node scripts/list.js --platform all --limit 20
```

### Analyze Sentiment
```bash
node scripts/sentiment.js --days 30
```

### Extract Feature Requests
```bash
node scripts/features.js
```

### Generate Report
```bash
node scripts/report.js --weekly
```

## Database Schema

SQLite database at `data/review-monitor.db`:

- `reviews` - All tracked reviews
- `sentiment_analysis` - Sentiment scores
- `feature_requests` - Extracted features
- `responses` - Response tracking
- `alerts` - Review alerts

## Integration

### With Content Calendar
- Turn positive reviews into testimonials
- Address concerns in blog posts
- Create FAQ from common questions

### With Product Team
- Feed feature requests to roadmap
- Alert on critical issues
- Track satisfaction trends

### With Team
- Flash: Monitor social mentions
- The Bard: Draft responses
- Kimi Claw: Review strategy

## Automation

### Daily
- Check for new reviews
- Analyze sentiment
- Alert on negative reviews

### Weekly
- Generate sentiment report
- Extract feature requests
- Update response templates

### Monthly
- Comprehensive review analysis
- Competitor comparison
- Strategy recommendations
