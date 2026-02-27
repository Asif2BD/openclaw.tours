#!/usr/bin/env node

const ReviewMonitor = require('../src/monitor');
const fs = require('fs');
const path = require('path');

async function generateReport() {
  const monitor = new ReviewMonitor();

  try {
    console.log('Generating review report...\n');

    const report = await monitor.generateReport();

    // Save report
    const reportsDir = path.join(__dirname, '..', 'data', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `review-report-${dateStr}.md`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, report);

    console.log('=== Review Report Generated ===');
    console.log(`File: ${filepath}`);
    console.log('\n--- Preview ---\n');
    console.log(report);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    monitor.close();
  }
}

generateReport();
