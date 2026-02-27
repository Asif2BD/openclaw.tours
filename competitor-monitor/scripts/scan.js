#!/usr/bin/env node

const CompetitorScanner = require('../src/scanner');

async function scanSingle() {
  const competitorId = process.argv[2];
  
  if (!competitorId) {
    console.log('Usage: node scan.js <competitor-id>');
    console.log('Example: node scan.js pdf-embedder');
    process.exit(1);
  }

  console.log(`=== Scanning: ${competitorId} ===\n`);
  
  const scanner = new CompetitorScanner();
  
  try {
    const result = await scanner.scanCompetitor(competitorId);
    
    console.log('\n=== Results ===');
    console.log(`Competitor: ${result.competitor.name}`);
    console.log(`Snapshots: ${result.snapshots.length}`);
    console.log(`Changes: ${result.changes.length}`);
    
    if (result.changes.length > 0) {
      console.log('\nChanges detected:');
      result.changes.forEach(change => {
        console.log(`  - ${change.change_type}: ${change.severity}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    scanner.close();
  }
}

if (require.main === module) {
  scanSingle();
}

module.exports = scanSingle;
