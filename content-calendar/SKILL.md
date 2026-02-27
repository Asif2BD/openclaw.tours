---
name: content-calendar
description: Content calendar and pipeline management for EmbedPress marketing. Plan, schedule, track, and distribute content across blog, social media, and email. Integrates with The Bard for writing and Vision for visuals.
---

# Content Calendar Skill

Manage EmbedPress content marketing from ideation to publication.

## Overview

Centralized content management for:
- Blog posts (WordPress.org, embedpress.com)
- Social media (X/Twitter, LinkedIn)
- Email newsletters
- Video content (YouTube)

## Features

### 1. Content Pipeline
- **Ideas** → **Outline** → **Draft** → **Review** → **Scheduled** → **Published**
- Track status of each content piece
- Assign to team members
- Set deadlines and priorities

### 2. Editorial Calendar
- View content by week/month
- Avoid content gaps
- Plan around product releases
- Coordinate with competitor intelligence

### 3. Content Types
- Comparison articles (EmbedPress vs X)
- Tutorial guides
- Use case stories
- SEO pillar content
- Social media posts
- Video scripts

### 4. Distribution Tracking
- Schedule social media posts
- Track publication dates
- Monitor performance
- Repurpose content

## Usage

### Add Content Idea
```bash
cd /root/.openclaw/workspace/content-calendar
node scripts/add.js "EmbedPress vs PDF Embedder 2026"
  --type comparison
  --assignee agent-bard
  --due 2026-02-25
```

### View Calendar
```bash
# Weekly view
node scripts/calendar.js --week

# Monthly view
node scripts/calendar.js --month

# Filter by status
node scripts/calendar.js --status draft
```

### Update Content Status
```bash
node scripts/update.js CONTENT-ID --status review
```

### Generate Content Ideas
```bash
# Based on competitor gaps
node scripts/ideas.js --source competitors

# Based on trending topics
node scripts/ideas.js --source trends

# Based on SEO gaps
node scripts/ideas.js --source seo
```

## Content Types

| Type | Description | Assignee |
|------|-------------|----------|
| `comparison` | vs competitor articles | The Bard |
| `tutorial` | How-to guides | The Bard |
| `use-case` | Customer stories | The Bard |
| `pillar` | SEO pillar content | The Bard |
| `social` | Social media posts | Flash |
| `video` | Video scripts | The Bard |
| `visual` | Graphics, infographics | Vision |

## Status Flow

```
idea → outline → draft → review → scheduled → published
```

## Integration

### With Competitor Monitor
- Auto-create content when competitor makes moves
- Alert when competitor publishes comparison content

### With SEO Monitor
- Prioritize content based on keyword opportunities
- Track ranking improvements from published content

### With Team
- The Bard: Writing and editing
- Vision: Visual assets
- Flash: Social distribution
- Kimi Claw: Review and approval

## Database Schema

SQLite database at `data/content-calendar.db`:

- `content_items` - All content pieces
- `calendar_slots` - Scheduled publication dates
- `ideas` - Content idea backlog
- `performance` - Published content metrics

## Automation

### Daily
- Check upcoming deadlines
- Alert on overdue content
- Suggest ideas from competitor intel

### Weekly
- Generate editorial calendar view
- Plan next week's content
- Review performance of published content

## Configuration

Edit `config/content-types.json` to customize:
- Content types
- Default assignees
- Review workflows
- Publication channels
