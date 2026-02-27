/**
 * Agent Management Dashboard
 * Monitors tenants, sessions, token usage, and budgets
 */

// Configuration
const CONFIG = {
    apiBase: '/api',  // Will connect to OpenClaw gateway
    refreshInterval: 5000,  // 5 seconds
    packages: {
        free: { name: 'Free', budget: 0, maxSessions: 1, color: 'plan-free' },
        starter: { name: 'Starter', budget: 5, maxSessions: 3, color: 'plan-starter' },
        pro: { name: 'Pro', budget: 20, maxSessions: 10, color: 'plan-pro' },
        enterprise: { name: 'Enterprise', budget: null, maxSessions: null, color: 'plan-enterprise' }
    }
};

// State
let state = {
    tenants: [],
    sessions: [],
    activities: [],
    selectedTenant: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setInterval(refreshData, CONFIG.refreshInterval);
});

// Tab Navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    
    // Update nav buttons
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'packages') {
        renderPackages();
    } else if (tabName === 'logs') {
        renderSystemLogs();
    }
}

// Load Data
async function loadData() {
    try {
        // In production, these would be real API calls
        // For now, using sample data
        state.tenants = await fetchTenants();
        state.sessions = await fetchSessions();
        state.activities = await fetchActivities();
        
        updateStats();
        renderTenants();
        renderSessions();
        renderActivities();
    } catch (error) {
        console.error('Failed to load data:', error);
        showError('Failed to load dashboard data');
    }
}

async function refreshData() {
    await loadData();
}

// API Calls (mock for now)
async function fetchTenants() {
    // In production: fetch(`${CONFIG.apiBase}/tenants`)
    return [
        {
            id: 'client001',
            name: 'Acme Corp',
            plan: 'starter',
            monthlyBudget: 5.00,
            usedThisMonth: 2.34,
            activeSessions: ['sess_abc123', 'sess_def456'],
            status: 'active',
            createdAt: '2025-02-20T10:00:00Z'
        },
        {
            id: 'client002',
            name: 'TechStart Inc',
            plan: 'pro',
            monthlyBudget: 20.00,
            usedThisMonth: 15.67,
            activeSessions: ['sess_ghi789'],
            status: 'active',
            createdAt: '2025-02-19T08:30:00Z'
        },
        {
            id: 'client003',
            name: 'FreeUser Demo',
            plan: 'free',
            monthlyBudget: 0,
            usedThisMonth: 0,
            activeSessions: [],
            status: 'paused',
            createdAt: '2025-02-18T14:00:00Z'
        }
    ];
}

async function fetchSessions() {
    return [
        {
            id: 'sess_abc123',
            tenantId: 'client001',
            agentId: 'content-writer',
            status: 'running',
            startTime: '2025-02-20T14:30:00Z',
            tokensUsed: 45000,
            cost: 0.89
        },
        {
            id: 'sess_def456',
            tenantId: 'client001',
            agentId: 'researcher',
            status: 'running',
            startTime: '2025-02-20T15:00:00Z',
            tokensUsed: 12000,
            cost: 0.24
        },
        {
            id: 'sess_ghi789',
            tenantId: 'client002',
            agentId: 'analyst',
            status: 'running',
            startTime: '2025-02-20T13:00:00Z',
            tokensUsed: 89000,
            cost: 1.78
        }
    ];
}

async function fetchActivities() {
    return [
        { time: '14:32:15', agent: 'client001', action: 'Spawned content-writer session', type: 'spawn' },
        { time: '14:30:00', agent: 'client001', action: 'Used 450 tokens', type: 'usage' },
        { time: '14:15:22', agent: 'client002', action: 'Approaching budget limit (78%)', type: 'warning' },
        { time: '13:45:10', agent: 'system', action: 'Tenant client003 auto-paused (inactive)', type: 'system' },
        { time: '13:00:00', agent: 'client002', action: 'Spawned analyst session', type: 'spawn' }
    ];
}

// Update Statistics
function updateStats() {
    const totalTenants = state.tenants.length;
    const activeSessions = state.sessions.filter(s => s.status === 'running').length;
    const totalSpend = state.tenants.reduce((sum, t) => sum + t.usedThisMonth, 0);
    const totalBudget = state.tenants.reduce((sum, t) => sum + (t.monthlyBudget || 0), 0);
    const alerts = state.tenants.filter(t => {
        const pct = t.monthlyBudget ? (t.usedThisMonth / t.monthlyBudget) * 100 : 0;
        return pct >= 80 || t.status === 'blocked';
    }).length;
    
    document.getElementById('stat-tenants').textContent = totalTenants;
    document.getElementById('stat-sessions').textContent = activeSessions;
    document.getElementById('stat-spend').textContent = `$${totalSpend.toFixed(2)}`;
    document.getElementById('stat-spend').nextElementSibling.textContent = `Of $${totalBudget.toFixed(2)} budget`;
    document.getElementById('stat-alerts').textContent = alerts;
    
    // Alert styling
    const alertCard = document.getElementById('stat-alerts-card');
    if (alerts > 0) {
        alertCard.classList.add('warning');
    } else {
        alertCard.classList.remove('warning');
    }
}

// Render Tenants Table
function renderTenants() {
    const tbody = document.getElementById('tenant-table-body');
    
    if (state.tenants.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No tenants yet. Create one to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = state.tenants.map(tenant => {
        const plan = CONFIG.packages[tenant.plan];
        const budgetPct = tenant.monthlyBudget 
            ? (tenant.usedThisMonth / tenant.monthlyBudget) * 100 
            : 0;
        const budgetClass = budgetPct >= 100 ? 'danger' : budgetPct >= 80 ? 'warning' : '';
        
        return `
            <tr>
                <td>
                    <div class="tenant-name">${tenant.name || tenant.id}</div>
                    <div class="tenant-id">${tenant.id}</div>
                </td>
                <td><span class="plan-badge ${plan.color}">${plan.name}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="budget-bar">
                            <div class="budget-fill ${budgetClass}" style="width: ${Math.min(budgetPct, 100)}%"></div>
                        </div>
                        <span style="font-size: 0.75rem;">$${tenant.usedThisMonth.toFixed(2)} / $${tenant.monthlyBudget || 0}</span>
                    </div>
                </td>
                <td>${tenant.activeSessions.length} / ${plan.maxSessions || '∞'}</td>
                <td><span class="status-badge status-${tenant.status}">${tenant.status}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="viewTenant('${tenant.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</button>
                    ${tenant.status === 'active' 
                        ? `<button class="btn btn-secondary" onclick="pauseTenant('${tenant.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Pause</button>`
                        : `<button class="btn btn-primary" onclick="resumeTenant('${tenant.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Resume</button>`
                    }
                </td>
            </tr>
        `;
    }).join('');
}

// Render Sessions
function renderSessions() {
    const sessionList = document.getElementById('session-list');
    
    if (state.sessions.length === 0) {
        sessionList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <p>No active sessions</p>
            </div>
        `;
        return;
    }
    
    sessionList.innerHTML = state.sessions.map(session => {
        const tenant = state.tenants.find(t => t.id === session.tenantId);
        const duration = getDuration(session.startTime);
        
        return `
            <div class="session-item">
                <div class="session-info">
                    <h4>${session.agentId}</h4>
                    <div class="session-meta">
                        ${tenant?.name || session.tenantId} • ${duration} • ${session.id.slice(0, 12)}...
                    </div>
                </div>
                <div class="session-tokens">
                    <div class="token-count">${formatTokens(session.tokensUsed)}</div>
                    <div class="token-cost">$${session.cost.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Activities
function renderActivities() {
    const logContainer = document.getElementById('activity-log');
    
    logContainer.innerHTML = state.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-content">
                <span class="activity-agent">${activity.agent}</span>
                <span class="activity-action">${activity.action}</span>
            </div>
        </div>
    `).join('');
}

// Render Packages
function renderPackages() {
    const tbody = document.getElementById('packages-table-body');
    
    const packages = [
        { id: 'free', name: 'Free', budget: 0, sessions: 1, 
          tools: 'read, write, web_search',
          features: 'Basic content writing, web research' },
        { id: 'starter', name: 'Starter', budget: 5, sessions: 3,
          tools: 'read, write, edit, web_search, tts',
          features: 'Content editing, voice generation, auto-post drafting' },
        { id: 'pro', name: 'Pro', budget: 20, sessions: 10,
          tools: 'All Starter + browser, canvas, kimi_search',
          features: 'Web automation, visual content, deep research' },
        { id: 'enterprise', name: 'Enterprise', budget: 'Custom', sessions: 'Unlimited',
          tools: 'All tools',
          features: 'Custom skills, priority support, white-label' }
    ];
    
    tbody.innerHTML = packages.map(pkg => `
        <tr>
            <td><span class="plan-badge plan-${pkg.id}">${pkg.name}</span></td>
            <td>${typeof pkg.budget === 'number' ? `$${pkg.budget}` : pkg.budget}</td>
            <td>${pkg.sessions}</td>
            <td><code style="font-size: 0.75rem;">${pkg.tools}</code></td>
            <td>${pkg.features}</td>
        </tr>
    `).join('');
}

// Render System Logs
function renderSystemLogs() {
    const logs = [
        { time: '2025-02-20 14:32:15', level: 'INFO', message: 'Session sess_abc123 spawned for client001' },
        { time: '2025-02-20 14:30:00', level: 'INFO', message: 'Token usage recorded: 450 tokens ($0.009)' },
        { time: '2025-02-20 14:15:22', level: 'WARN', message: 'Tenant client002 at 78% of monthly budget' },
        { time: '2025-02-20 13:45:10', level: 'INFO', message: 'Auto-paused tenant client003 (7 days inactive)' },
        { time: '2025-02-20 13:00:00', level: 'INFO', message: 'Session sess_ghi789 spawned for client002' },
        { time: '2025-02-20 12:30:00', level: 'ERROR', message: 'Failed to spawn session: budget exceeded for client004' }
    ];
    
    const container = document.getElementById('system-logs');
    container.innerHTML = logs.map(log => {
        const color = log.level === 'ERROR' ? 'var(--accent-danger)' : 
                      log.level === 'WARN' ? 'var(--accent-warning)' : 
                      'var(--accent-primary)';
        return `
            <div class="activity-item">
                <div class="activity-time" style="min-width: 140px;">${log.time}</div>
                <div class="activity-content">
                    <span style="color: ${color}; font-weight: 600;">[${log.level}]</span>
                    <span class="activity-action">${log.message}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Modal Functions
function openCreateTenantModal() {
    document.getElementById('create-tenant-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

async function createTenant() {
    const id = document.getElementById('new-tenant-id').value.trim();
    const plan = document.getElementById('new-tenant-plan').value;
    
    if (!id) {
        alert('Please enter a tenant ID');
        return;
    }
    
    // In production: POST to API
    const newTenant = {
        id: id,
        name: id,
        plan: plan,
        monthlyBudget: CONFIG.packages[plan].budget,
        usedThisMonth: 0,
        activeSessions: [],
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    state.tenants.push(newTenant);
    closeModal('create-tenant-modal');
    updateStats();
    renderTenants();
    
    // Reset form
    document.getElementById('new-tenant-id').value = '';
}

// Tenant Actions
function viewTenant(tenantId) {
    state.selectedTenant = tenantId;
    const tenant = state.tenants.find(t => t.id === tenantId);
    alert(`Tenant: ${tenant.name}\nPlan: ${tenant.plan}\nBudget: $${tenant.usedThisMonth} / $${tenant.monthlyBudget}\nSessions: ${tenant.activeSessions.length}`);
}

function pauseTenant(tenantId) {
    const tenant = state.tenants.find(t => t.id === tenantId);
    if (tenant) {
        tenant.status = 'paused';
        renderTenants();
        addActivity('system', `Paused tenant ${tenantId}`);
    }
}

function resumeTenant(tenantId) {
    const tenant = state.tenants.find(t => t.id === tenantId);
    if (tenant) {
        tenant.status = 'active';
        renderTenants();
        addActivity('system', `Resumed tenant ${tenantId}`);
    }
}

// Helpers
function formatTokens(tokens) {
    if (tokens >= 1000000) return (tokens / 1000000).toFixed(1) + 'M';
    if (tokens >= 1000) return (tokens / 1000).toFixed(1) + 'K';
    return tokens.toString();
}

function getDuration(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
}

function addActivity(agent, action) {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    state.activities.unshift({ time, agent, action, type: 'system' });
    renderActivities();
}

function showError(message) {
    console.error(message);
    // Could add a toast notification here
}

// WebSocket for real-time updates (placeholder)
function initWebSocket() {
    // In production: connect to OpenClaw gateway WebSocket
    // const ws = new WebSocket('ws://localhost:3000/ws');
    // ws.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     handleRealtimeUpdate(data);
    // };
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatTokens, getDuration };
}
