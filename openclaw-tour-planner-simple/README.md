# OpenCLAW Tour Planner

> Universal travel planning skill for OpenClaw agents. Plan itineraries, check weather, discover attractions — all through natural conversation.

## Quick Start

### Installation

```bash
openclaw skills install tour-planner
```

Or manually:
```bash
git clone https://github.com/openclaw/tour-planner.git
cd tour-planner
npm install
npm run build
```

### Usage

```
User: Plan a 5-day trip to Tokyo in April
Agent: I'll create a personalized itinerary for Tokyo...

[Markdown itinerary generated with weather, attractions, budget]
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `plan` | Generate full itinerary | `/tour plan Tokyo 5 days in April` |
| `weather` | Get destination weather | `/tour weather Tokyo next week` |
| `budget` | Estimate trip costs | `/tour budget Tokyo 5 days mid-range` |
| `guide` | Get destination guide | `/tour guide Tokyo` |

## Features

- **Smart Itineraries** — Day-by-day plans optimized by location
- **Weather Intelligence** — 15-day forecasts from Visual Crossing
- **Local Insights** — Travel guides from Wikivoyage
- **Budget Estimation** — Realistic cost breakdowns
- **Privacy First** — No data storage, ephemeral planning
- **Zero Cost** — Uses free APIs with generous limits

## Data Sources

| Source | Purpose | Free Tier |
|--------|---------|-----------|
| Nominatim (OpenStreetMap) | Geocoding | Unlimited |
| Visual Crossing | Weather | 1000 records/day |
| Wikivoyage | Travel guides | Unlimited |
| RestCountries | Country info | Unlimited |

## Configuration

Set API keys in environment:
```bash
VISUAL_CROSSING_API_KEY=your_key_here
```

Or in `openclaw.json`:
```json
{
  "skills": {
    "tour-planner": {
      "enabled": true,
      "config": {
        "visualCrossingApiKey": "your_key_here"
      }
    }
  }
}
```

## Output Format

### Markdown Itinerary
```markdown
# 5-Day Tokyo Adventure

## Overview
- **Dates:** April 15-19, 2025
- **Weather:** 18-22°C, partly cloudy
- **Budget:** $1,200-1,800

## Day 1: Arrival & Shibuya
### Morning
- **10:00** Arrive at Narita/Haneda
- **12:00** Airport Express to Shibuya
...
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test
```

## Project Structure

```
tour-planner/
├── src/
│   ├── apis/           # API clients
│   ├── planners/       # Planning engines
│   └── utils/          # Utilities
├── dist/               # Compiled output
├── tests/
└── package.json
```

## Roadmap

- [x] Basic itinerary generation
- [x] Weather integration
- [x] Wikivoyage guides
- [ ] Flight search (Amadeus API)
- [ ] Hotel price estimates
- [ ] PDF export
- [ ] Multi-city optimization

## License

MIT License — see [LICENSE](LICENSE) for details.

## Links

- **Website:** https://openclaw.tours
- **GitHub:** https://github.com/openclaw/tour-planner
- **OpenClaw:** https://openclaw.ai

---

Built with ❤️ for the OpenClaw community.
