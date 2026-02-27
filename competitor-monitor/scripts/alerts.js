#!/usr/bin/env node

const AlertManager = require('../src/alerts');

async function listAlerts() {
  const manager = new AlertManager();
  
  try {
    const stats = await manager.getAlertStats();
    console.log('=== Alert Statistics ===');
    console.log(`Total alerts: ${stats.total}`);
    console.log(`Unsent: ${stats.unsent}`);
    console.log(`High severity: ${stats.high_severity}`);
    
    if (stats.unsent > 0) {
      console.log('\n=== Unsent Alerts ===');
      const unsent = await manager.getUnsentAlerts();
      unsent.forEach(alert => {
        console.log(`\n[${alert.severity.toUpperCase()}] ${alert.competitor_name}`);
        console.log(`  ${alert.message}`);
        console.log(`  Created: ${new Date(alert.created_at).toLocaleString()}`);
      });
    }
    
    console.log('\n=== Recent Alerts (Last 10) ===');
    const recent = await manager.getRecentAlerts(10);
    recent.forEach(alert => {
      const status = alert.sent ? '✓' : '○';
      console.log(`${status} [${alert.severity}] ${alert.competitor_name}: ${alert.message.substring(0, 60)}...`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    manager.close();
  }
}

async function markAllRead() {
  const manager = new AlertManager();
  
  try {
    const count = await manager.markAllSent();
    console.log(`Marked ${count} alerts as sent/read`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    manager.close();
  }
}

// Parse command
const command = process.argv[2];

if (command === '--mark-read' || command === '-m') {
  markAllRead();
} else {
  listAlerts();
}
