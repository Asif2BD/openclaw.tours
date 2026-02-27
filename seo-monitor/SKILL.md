---
name: seo-monitor
description: SEO monitoring and optimization for EmbedPress. Track keyword rankings, monitor search performance, identify content gaps, and generate SEO recommendations. Integrates with seo-geo skill for AI search optimization.
---

# SEO Monitor Skill

Track and improve EmbedPress search visibility.

## Overview

Comprehensive SEO monitoring for:
- Keyword ranking tracking
- Competitor SEO analysis
- Content gap identification
- Technical SEO monitoring
- AI search (GEO) optimization

## Features

### 1. Keyword Rank Tracking
- Track 50+ target keywords
- Daily ranking updates
- Historical trend analysis
- SERP feature tracking

### 2. Competitor SEO Analysis
- Monitor competitor rankings
- Track their content strategy
- Identify their top keywords
- Find opportunities

### 3. Content Gap Analysis
- Find keywords competitors rank for
- Identify missing content
- Prioritize content opportunities
- Track gap closure

### 4. Technical SEO
- Page speed monitoring
- Mobile-friendliness
- Schema markup validation
- Indexing status

### 5. AI Search Optimization (GEO)
- ChatGPT citation tracking
- Perplexity visibility
- Google AI Overview
- Bing/Copilot presence

## Target Keywords

### Primary Keywords
- "wordpress pdf embedder plugin"
- "embed pdf in wordpress"
- "best wordpress embed plugin"
- "wordpress pdf viewer plugin"
- "embed youtube video wordpress"

### Comparison Keywords
- "embedpress vs pdf embedder"
- "embedpress vs dearflip"
- "best pdf plugin for wordpress"
- "wordpress pdf embedder comparison"

### Long-Tail Keywords
- "how to embed pdf in wordpress elementor"
- "wordpress pdf embed with download button"
- "embed google doc in wordpress without plugin"

## Usage

### Check Rankings
```bash
cd /root/.openclaw/workspace/seo-monitor
node scripts/rankings.js --keyword "wordpress pdf embedder"
```

### Full SEO Audit
```bash
node scripts/audit.js --url https://embedpress.com
```

### Competitor Analysis
```bash
node scripts/competitor-seo.js --competitor pdf-embedder
```

### Content Gap Report
```bash
node scripts/gap-analysis.js
```

### Generate SEO Report
```bash
node scripts/report.js --weekly
```

## Database Schema

SQLite database at `data/seo-monitor.db`:

- `keywords` - Target keywords and metadata
- `rankings` - Daily ranking data
- `competitor_rankings` - Competitor ranking data
- `content_gaps` - Identified opportunities
- `technical_checks` - Technical SEO audits
- `geo_citations` - AI search citations

## Integration

### With Competitor Monitor
- Import competitor data
- Cross-reference SEO moves
- Alert on competitor ranking changes

### With Content Calendar
- Feed content gaps as ideas
- Prioritize SEO-focused content
- Track ranking improvements

### With Team
- Ironclad: Technical SEO implementation
- The Bard: SEO content optimization
- Kimi Claw: Strategy decisions

## Automation

### Daily
- Check keyword rankings
- Monitor technical SEO
- Track competitor movements

### Weekly
- Generate SEO reports
- Update content gap analysis
- Review AI search citations

### Monthly
- Comprehensive SEO audit
- Strategy review
- Goal tracking

## Configuration

Edit `config/keywords.json` to customize:
- Target keywords
- Competitors to track
- Alert thresholds
- Report schedule
