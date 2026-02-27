---
name: councils
description: Multi-agent council system for EmbedPress strategic decision-making. SEO Council, Content Council, and Strategy Council coordinate team activities and make recommendations.
---

# Multi-Agent Councils

Coordinate superhero team decisions through specialized councils.

## Overview

Three councils for different domains:
1. **SEO Council** - Search optimization decisions
2. **Content Council** - Content strategy and planning
3. **Strategy Council** - High-level business decisions

## Councils

### 1. SEO Council
**Members:** Ironclad (lead), The Bard
**Meets:** Weekly
**Decisions:**
- Keyword targeting priorities
- Technical SEO changes
- Content optimization
- Competitor SEO responses

### 2. Content Council
**Members:** The Bard (lead), Flash, Vision
**Meets:** Weekly
**Decisions:**
- Content calendar priorities
- Content type selection
- Distribution strategy
- Visual asset planning

### 3. Strategy Council
**Members:** Kimi Claw (lead), All agents, Human (Asif)
**Meets:** Monthly
**Decisions:**
- Major initiatives
- Resource allocation
- Competitive responses
- Long-term planning

## Council Process

1. **Gather Data** - Collect relevant information
2. **Individual Analysis** - Each member analyzes independently
3. **Discussion** - Share perspectives
4. **Consensus** - Reach agreement
5. **Action Items** - Assign tasks
6. **Follow-up** - Track execution

## Usage

### Convene SEO Council
```bash
cd /root/.openclaw/workspace/councils
node scripts/convene.js --council seo --topic "Q1 Keyword Strategy"
```

### View Council Decisions
```bash
node scripts/decisions.js --council all
```

### Generate Council Report
```bash
node scripts/report.js --council content --period weekly
```

## Database Schema

SQLite database at `data/councils.db`:

- `councils` - Council definitions
- `meetings` - Meeting records
- `decisions` - Council decisions
- `action_items` - Assigned tasks
- `member_inputs` - Individual analyses

## Integration

### With Other Skills
- Pull data from Competitor Monitor
- Reference Content Calendar
- Use SEO Monitor insights
- Consider Review Monitor feedback

### With Team
- Each council has designated lead
- Members contribute expertise
- Kimi Claw coordinates across councils
- Human oversight on major decisions
