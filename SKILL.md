# OpenCLAW Tour Planner

> **Universal travel planning skill for OpenClaw agents**
> 
> Plan itineraries, find flights, check weather, and discover attractions — all through natural conversation.

---

## Quick Start

### Installation

```bash
# Install via OpenClaw CLI
openclaw skills install tour-planner

# Or clone manually
git clone https://github.com/openclaw/tour-planner.git
cd tour-planner
npm install
```

### Usage

```
User: Plan a 5-day trip to Tokyo in April
Agent: I'll create a personalized itinerary for Tokyo. Let me gather the latest information...

[Agent generates day-by-day plan with weather, attractions, and budget estimates]
```

---

## Capabilities

### Core Features

| Feature | Description | Data Source |
|---------|-------------|-------------|
| **Itinerary Planning** | Day-by-day trip plans | Wikivoyage + OSM |
| **Weather Forecasts** | 15-day weather outlook | Visual Crossing |
| **Geocoding** | Location lookup | Nominatim |
| **Budget Estimation** | Cost breakdown by category | Local data + APIs |
| **Attraction Discovery** | Top sights and hidden gems | Wikivoyage |
| **Cultural Tips** | Local customs and etiquette | Wikivoyage |

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `plan` | Generate full itinerary | `/tour plan Tokyo 5 days in April` |
| `weather` | Get destination weather | `/tour weather Tokyo next week` |
| `budget` | Estimate trip costs | `/tour budget Tokyo 5 days mid-range` |
| `attractions` | Find things to do | `/tour attractions Tokyo family-friendly` |
| `guide` | Get destination guide | `/tour guide Tokyo` |

---

## Architecture

### Data Flow

```
User Request
    │
    ▼
┌─────────────────┐
│  Input Parser   │ ──→ Extract: destination, dates, budget, interests
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Geocode │ │Weather │
│Nominatim│ │Visual  │
└───┬────┘ │Crossing│
    │      └───┬────┘
    │          │
    └────┬─────┘
         ▼
┌─────────────────┐
│ Wikivoyage API  │ ──→ Travel guide, attractions, tips
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Itinerary Engine│ ──→ Build day-by-day plan
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Output Formatter│ ──→ Markdown / JSON / Text
└─────────────────┘
```

### API Integrations

#### Free Tier APIs (No Cost)

| Service | Purpose | Limits |
|---------|---------|--------|
| **Nominatim** | Geocoding | 1 req/sec |
| **Visual Crossing** | Weather | 1000 records/day |
| **Wikivoyage** | Travel guides | Unlimited |
| **RestCountries** | Country info | Unlimited |
| **ExchangeRate-API** | Currency | 1500 req/month |

---

## Configuration

### Environment Variables

```bash
# Required
VISUAL_CROSSING_API_KEY=your_key_here

# Optional
OPENWEATHER_API_KEY=backup_weather_key
AMADEUS_API_KEY=flight_search_key
AMADEUS_API_SECRET=flight_search_secret
CACHE_TTL_HOURS=24
```

### Skill Config (openclaw.json)

```json
{
  "skills": {
    "tour-planner": {
      "enabled": true,
      "config": {
        "defaultBudget": "mid-range",
        "cacheEnabled": true,
        "cachePath": "./cache/tour-planner.db"
      }
    }
  }
}
```

---

## Output Formats

### Markdown Itinerary (Default)

```markdown
# 5-Day Tokyo Adventure

## Overview
- **Dates:** April 15-19, 2025
- **Weather:** 18-22°C, partly cloudy
- **Budget:** $1,200-1,800 (excl. flights)

## Day 1: Arrival & Shibuya
### Morning
- **10:00** Arrive at Narita/Haneda
- **12:00** Airport Express to Shibuya
- **Activity:** Shibuya Crossing + Hachiko

### Afternoon
- **14:00** Lunch at Genki Sushi
- **16:00** Meiji Shrine walk

### Evening
- **19:00** Dinner in Nonbei Yokocho
```

### JSON (For Agent Processing)

```json
{
  "destination": "Tokyo",
  "duration_days": 5,
  "weather_summary": {...},
  "days": [...],
  "budget_breakdown": {...},
  "packing_list": [...]
}
```

---

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/openclaw/tour-planner.git
cd tour-planner

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Project Structure

```
tour-planner/
├── src/
│   ├── apis/           # API clients
│   │   ├── nominatim.ts
│   │   ├── weather.ts
│   │   └── wikivoyage.ts
│   ├── planners/       # Planning engines
│   │   ├── itinerary.ts
│   │   └── budget.ts
│   ├── utils/          # Utilities
│   │   ├── cache.ts
│   │   └── formatter.ts
│   └── data/           # Static data
│       └── countries.json
├── tests/
├── docs/
└── package.json
```

---

## Roadmap

### Phase 1: MVP (Complete)
- [x] Basic itinerary generation
- [x] Weather integration
- [x] Wikivoyage guides
- [x] Markdown output

### Phase 2: Enhanced (In Progress)
- [ ] Flight search (Amadeus API)
- [ ] Hotel price estimates
- [ ] Multi-city optimization
- [ ] PDF export

### Phase 3: Advanced (Planned)
- [ ] Real-time events
- [ ] Restaurant reservations
- [ ] Collaborative planning
- [ ] Mobile app wrapper

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Adding a New Destination

1. Check Wikivoyage coverage
2. Add to `data/destinations.json`
3. Test itinerary generation
4. Submit PR

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Links

- **Website:** https://openclaw.tours
- **GitHub:** https://github.com/openclaw/tour-planner
- **Docs:** https://openclaw.tours/docs
- **Issues:** https://github.com/openclaw/tour-planner/issues

---

Built with ❤️ for the OpenClaw community.
