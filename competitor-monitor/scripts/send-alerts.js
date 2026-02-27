#!/usr/bin/env node

const AlertManager = require('../src/alerts');

async function sendAlerts() {
  const manager = new AlertManager();

  try {
    const alerts = await manager.getUnsentAlerts();
    
    if (alerts.length === 0) {
      console.log('No unsent alerts to send');
      return;
    }

    console.log(`Sending ${alerts.length} alert(s)...`);

    for (const alert of alerts) {
      const message = manager.formatAlertMessage(alert);
      
      // Output to console (for Telegram integration)
      console.log('\n--- Alert ---');
      console.log(message);
      console.log('-------------\n');
      
      // Mark as sent
      await manager.markAlertSent(alert.id);
    }

    console.log(`Sent ${alerts.length} alert(s)`);

  } catch (error) {
    console.error('Error sending alerts:', error.message);
  } finally {
    manager.close();
  }
}

sendAlerts();
