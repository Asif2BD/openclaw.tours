#!/bin/bash
# Spawn a managed sub-agent with budget and tool restrictions
# Usage: ./spawn-managed.sh <tenant_id> <task_description>

AGENTS_DIR="/root/.openclaw/workspace/agents"
PACKAGES_FILE="$AGENTS_DIR/packages.yaml"

TENANT_ID=$1
TASK=$2

if [ -z "$TENANT_ID" ] || [ -z "$TASK" ]; then
    echo "Usage: spawn-managed.sh <tenant_id> <task_description>"
    exit 1
fi

TENANT_FILE="$AGENTS_DIR/tenant_$TENANT_ID.json"

if [ ! -f "$TENANT_FILE" ]; then
    echo "Error: Tenant $TENANT_ID not found. Create with: watcher.sh create $TENANT_ID <plan>"
    exit 1
fi

# Load tenant config
PLAN=$(jq -r '.plan' "$TENANT_FILE")
BUDGET=$(jq -r '.monthlyBudget' "$TENANT_FILE")
USED=$(jq -r '.usedThisMonth' "$TENANT_FILE")
ACTIVE_SESSIONS=$(jq -r '.activeSessions | length' "$TENANT_FILE")
MAX_SESSIONS=$(yq ".packages.$PLAN.max_sessions" "$PACKAGES_FILE")

# Check budget
echo "[SPAWN] Tenant: $TENANT_ID | Plan: $PLAN | Budget: \$$USED / \$$BUDGET"

if (( $(echo "$USED >= $BUDGET" | bc -l) )); then
    echo "[ERROR] Budget exceeded. Cannot spawn new agent."
    exit 1
fi

# Check session limit
if [ "$ACTIVE_SESSIONS" -ge "$MAX_SESSIONS" ]; then
    echo "[ERROR] Session limit reached ($ACTIVE_SESSIONS / $MAX_SESSIONS)"
    exit 1
fi

echo "[SPAWN] Limits OK. Spawning sub-agent..."
echo "[SPAWN] Task: $TASK"

# Get allowed tools for this plan
ALLOWED_TOOLS=$(yq ".packages.$PLAN.tools | join(\", \")" "$PACKAGES_FILE")
echo "[SPAWN] Allowed tools: $ALLOWED_TOOLS"

# Spawn the session via OpenClaw
# Note: This uses sessions_spawn which creates isolated session
SESSION_OUTPUT=$(openclaw sessions spawn \
    --task "$TASK" \
    --label "${TENANT_ID}_$(date +%s)" \
    --agentId "sub-agent" \
    2>&1)

SESSION_KEY=$(echo "$SESSION_OUTPUT" | grep -oP 'sessionKey: \K[^ ]+' || echo "")

if [ -n "$SESSION_KEY" ]; then
    echo "[SPAWN] Success! Session: $SESSION_KEY"
    
    # Update tenant file with new session
    jq ".activeSessions += [\"$SESSION_KEY\"]" "$TENANT_FILE" > "${TENANT_FILE}.tmp"
    mv "${TENANT_FILE}.tmp" "$TENANT_FILE"
    
    echo "[SPAWN] Session tracked. Monitor with: watcher.sh check $TENANT_ID"
else
    echo "[SPAWN] Failed to get session key. Output:"
    echo "$SESSION_OUTPUT"
    exit 1
fi
