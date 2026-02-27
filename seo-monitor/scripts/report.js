#!/usr/bin/env node

const SEOMonitor = require('../src/monitor');
const fs = require('fs');
const path = require('path');

async function generateReport() {
  const monitor = new SEOMonitor();

  try {
    console.log('Generating SEO report...\n');

    const report = await monitor.generateSEOReport();

    // Save report
    const reportsDir = path.join(__dirname, '..', 'data', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `seo-report-${dateStr}.md`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFileSync(filepath, report);

    console.log('=== SEO Report Generated ===');
    console.log(`File: ${filepath}`);
    console.log('\n--- Preview ---\n');
    console.log(report.substring(0, 800) + '...');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    monitor.close();
  }
}

generateReport();
