#!/usr/bin/env node

const ReportGenerator = require('../src/reports');

async function generateReport() {
  const type = process.argv[2] || '--daily';
  const generator = new ReportGenerator();

  try {
    let report;
    let filename;

    if (type === '--daily' || type === '-d') {
      console.log('Generating daily report...');
      report = await generator.generateDailyReport();
      filename = generator.saveReport('daily', report, new Date());
    } else if (type === '--weekly' || type === '-w') {
      console.log('Generating weekly report...');
      report = await generator.generateWeeklyReport();
      filename = generator.saveReport('weekly', report, new Date());
    } else {
      console.log('Usage: node report.js [--daily|--weekly]');
      process.exit(1);
    }

    console.log('\n=== Report Generated ===');
    console.log(`File: ${filename}`);
    console.log('\n--- Preview ---\n');
    console.log(report.substring(0, 500) + '...');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    generator.close();
  }
}

generateReport();
