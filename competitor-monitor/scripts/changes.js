#!/usr/bin/env node

const CompetitorMonitor = require('../src/scanner');

async function viewChanges() {
  const monitor = new CompetitorMonitor();

  try {
    console.log('=== Recent Competitor Changes ===\n');

    const changes = await monitor.getRecentChanges(7);

    if (changes.length === 0) {
      console.log('No changes detected in the last 7 days.');
      return;
    }

    for (const change of changes) {
      console.log(`🚨 ${change.competitor_name}`);
      console.log(`   Change: ${change.change_type}`);
      console.log(`   Severity: ${change.severity}`);
      console.log(`   Detected: ${new Date(change.detected_at).toLocaleString()}`);
      
      if (change.old_value) {
        console.log(`   Old: ${change.old_value.substring(0, 100)}...`);
      }
      if (change.new_value) {
        console.log(`   New: ${change.new_value.substring(0, 100)}...`);
      }
      console.log('');
    }

    console.log(`Total changes: ${changes.length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    monitor.close();
  }
}

viewChanges();
