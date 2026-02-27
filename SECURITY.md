# Security Policy — OpenCLAW Tour Planner

## Overview

This skill is a **read-only travel planning agent skill**. It makes outbound API calls to free public services only. It does not:

- Store user data
- Write to the filesystem
- Execute shell commands
- Access credentials or environment secrets
- Make authenticated API calls (core features are keyless)

## Data Sources (all public, read-only)

| Service | Purpose | Auth |
|---------|---------|------|
| Nominatim (OpenStreetMap) | Geocoding | None |
| Wikivoyage API | Travel guides | None |
| Open-Meteo | Weather forecasts | None |
| RestCountries | Country metadata | None |

## Optional API Keys (user-supplied, never hardcoded)

- `VISUAL_CROSSING_API_KEY` — enhanced weather (free tier available)
- `AMADEUS_API_KEY` — flight search (Phase 2, not in current release)

## No Hardcoded Secrets

This repository contains zero API keys, tokens, passwords, or credentials. All optional keys are read from environment variables at runtime.

## Reporting Issues

Open an issue at https://github.com/Asif2BD/openclaw.tours/issues

## License

MIT — see repository root.
