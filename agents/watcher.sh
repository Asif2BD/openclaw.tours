#!/bin/bash
# Agent Watcher - Monitor sub-agents and enforce limits
# Usage: ./watcher.sh [command] [tenant_id]

AGENTS_DIR="/root/.openclaw/workspace/agents"
PACKAGES_FILE="$AGENTS_DIR/packages.yaml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[WATCHER]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# List all tenants
list_tenants() {
    log "Active tenants:"
    for tenant_file in $AGENTS_DIR/tenant_*.json; do
        if [ -f "$tenant_file" ]; then
            tenant_id=$(basename "$tenant_file" .json | sed 's/tenant_//')
            plan=$(jq -r '.plan' "$tenant_file")
            budget=$(jq -r '.monthlyBudget' "$tenant_file")
            used=$(jq -r '.usedThisMonth' "$tenant_file")
            sessions=$(jq -r '.activeSessions | length' "$tenant_file")
            echo "  • $tenant_id | Plan: $plan | \$${used}/\$${budget} | Sessions: $sessions"
        fi
    done
}

# Check a tenant's spend
check_tenant() {
    local tenant_id=$1
    local tenant_file="$AGENTS_DIR/tenant_$tenant_id.json"
    
    if [ ! -f "$tenant_file" ]; then
        error "Tenant $tenant_id not found"
        return 1
    fi
    
    local plan=$(jq -r '.plan' "$tenant_file")
    local budget=$(jq -r '.monthlyBudget' "$tenant_file")
    local used=$(jq -r '.usedThisMonth' "$tenant_file")
    local percent=$(echo "scale=1; $used / $budget * 100" | bc)
    
    log "Tenant: $tenant_id"
    log "  Plan: $plan"
    log "  Budget: \$$budget"
    log "  Used: \$$used (${percent}%)"
    
    if (( $(echo "$percent >= 100" | bc -l) )); then
        error "  STATUS: OVER BUDGET - Actions required"
        return 1
    elif (( $(echo "$percent >= 80" | bc -l) )); then
        warn "  STATUS: Approaching limit"
        return 0
    else
        log "  STATUS: OK"
        return 0
    fi
}

# Create new tenant
create_tenant() {
    local tenant_id=$1
    local plan=$2
    local tenant_file="$AGENTS_DIR/tenant_$tenant_id.json"
    
    if [ -f "$tenant_file" ]; then
        error "Tenant $tenant_id already exists"
        return 1
    fi
    
    # Get plan budget from packages.yaml
    local budget=$(yq ".packages.$plan.monthly_budget" "$PACKAGES_FILE")
    
    if [ "$budget" == "null" ]; then
        error "Unknown plan: $plan"
        return 1
    fi
    
    cat > "$tenant_file" << EOF
{
  "tenantId": "$tenant_id",
  "plan": "$plan",
  "monthlyBudget": $budget,
  "usedThisMonth": 0.00,
  "activeSessions": [],
  "sessionHistory": [],
  "allowedTools": [],
  "createdAt": "$(date -Iseconds)",
  "managedBy": "main-agent",
  "status": "active"
}
EOF
    
    log "Created tenant: $tenant_id with $plan plan (\$$budget)"
}

# Main command handler
case "${1:-help}" in
    list)
        list_tenants
        ;;
    check)
        if [ -z "$2" ]; then
            error "Usage: watcher.sh check <tenant_id>"
            exit 1
        fi
        check_tenant "$2"
        ;;
    create)
        if [ -z "$2" ] || [ -z "$3" ]; then
            error "Usage: watcher.sh create <tenant_id> <plan>"
            exit 1
        fi
        create_tenant "$2" "$3"
        ;;
    help|*)
        echo "Agent Watcher - Sub-agent monitoring system"
        echo ""
        echo "Commands:"
        echo "  list              - Show all tenants"
        echo "  check <id>        - Check tenant spend/status"
        echo "  create <id> <plan> - Create new tenant (free/starter/pro/enterprise)"
        echo ""
        echo "Examples:"
        echo "  ./watcher.sh create client001 starter"
        echo "  ./watcher.sh check client001"
        ;;
esac
