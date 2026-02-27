# Agent-as-a-Service Architecture

## Core Concept
Main agent (watcher) spawns and monitors sub-agents with tiered resource limits.

## Package Tiers

| Plan | Monthly Budget | Tools | Max Sessions | Skills |
|------|---------------|-------|--------------|--------|
| Free | $0 (manual only) | read, write, web_search | 1 | basic |
| Starter | $5 | + edit, tts | 3 | basic |
| Pro | $20 | + browser, canvas | 10 | all |
| Enterprise | Custom | all | unlimited | custom |

## Watcher System

### What Main Agent Can See
- Real-time session list
- Token spend per session
- Tool usage history
- Active tasks

### Control Mechanisms
- Kill session if over budget
- Pause agent pending approval
- Upgrade/downgrade plan
- Audit logs

## Data Model

```json
{
  "tenantId": "user_123",
  "plan": "starter",
  "monthlyBudget": 5.00,
  "usedThisMonth": 1.23,
  "activeSessions": ["sess_abc", "sess_def"],
  "allowedTools": ["read", "write", "edit", "web_search", "tts"],
  "createdAt": "2025-02-20",
  "managedBy": "main-agent"
}
```

## Workflow

1. User requests sub-agent
2. Main agent checks plan/budget
3. Spawn with restricted tool policy
4. Log all activity
5. Monitor spend via session_status
6. Alert/kill if approaching limit

## Files to Create

- `agents/tenant_{id}.json` — tenant config
- `agents/sessions_{tenant}.log` — activity log
- `agents/packages.yaml` — plan definitions
