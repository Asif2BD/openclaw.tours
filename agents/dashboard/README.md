# Agent Management Dashboard

A web-based control center for managing sub-agents, tenants, budgets, and token usage.

## Features

- **Tenant Management**: Create, monitor, and control tenant accounts
- **Session Tracking**: Real-time view of active agent sessions
- **Budget Controls**: Track spend against monthly limits
- **Package Tiers**: Free, Starter ($5), Pro ($20), Enterprise
- **Activity Logs**: Audit trail of all actions
- **Alert System**: Warnings when approaching budget limits

## Quick Start

```bash
# Start the dashboard
cd /root/.openclaw/workspace/agents/dashboard
python3 -m http.server 8080

# Open in browser
http://localhost:8080
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Agent Management Dashboard      │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Tenants  │ │ Sessions │ │  Logs   │ │
│  └──────────┘ └──────────┘ └─────────┘ │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         OpenClaw Gateway API            │
│  • sessions_list                        │
│  • session_status                       │
│  • sessions_spawn                       │
│  • sessions_history                     │
└─────────────────────────────────────────┘
```

## Tenant Data Format

```json
{
  "id": "client001",
  "name": "Acme Corp",
  "plan": "starter",
  "monthlyBudget": 5.00,
  "usedThisMonth": 2.34,
  "activeSessions": ["sess_abc123"],
  "status": "active",
  "createdAt": "2025-02-20T10:00:00Z",
  "managedBy": "main-agent"
}
```

## API Integration

The dashboard connects to OpenClaw's gateway to:

1. **List sessions**: `sessions_list` → active sessions
2. **Get token usage**: `session_status` → cost per session
3. **Spawn agents**: `sessions_spawn` with tool restrictions
4. **Monitor history**: `sessions_history` → audit trail

## Package Plans

| Plan | Budget | Sessions | Tools |
|------|--------|----------|-------|
| Free | $0 | 1 | read, write, web_search |
| Starter | $5 | 3 | +edit, tts |
| Pro | $20 | 10 | +browser, canvas |
| Enterprise | Custom | ∞ | all |

## Files

- `index.html` - Main dashboard UI
- `js/dashboard.js` - Frontend logic
- `../packages.yaml` - Plan definitions
- `../tenant_*.json` - Tenant configs
