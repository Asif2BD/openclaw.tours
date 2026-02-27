#!/usr/bin/env node

const CompetitorScanner = require('../src/scanner');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'competitors.json');

async function scanAll() {
  console.log('=== Competitor Monitor - Full Scan ===\n');
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const scanner = new CompetitorScanner();
  
  const results = {
    timestamp: new Date().toISOString(),
    competitors: []
  };

  try {
    for (const competitor of config.competitors) {
      console.log(`\n📊 Scanning: ${competitor.name}`);
      console.log('-'.repeat(50));
      
      try {
        const result = await scanner.scanCompetitor(competitor.id);
        results.competitors.push(result);
        
        // Summary
        const changeCount = result.changes.length;
        if (changeCount > 0) {
          console.log(`\n✅ ${changeCount} change(s) detected`);
        } else {
          console.log(`\n✅ No changes detected`);
        }
      } catch (error) {
        console.error(`\n❌ Error scanning ${competitor.name}:`, error.message);
        results.competitors.push({
          competitor: competitor,
          error: error.message
        });
      }
    }

    // Save results
    const resultsDir = path.join(__dirname, '..', 'data', 'daily');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const dateStr = new Date().toISOString().split('T')[0];
    const resultsPath = path.join(resultsDir, `${dateStr}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    console.log(`\n\n=== Scan Complete ===`);
    console.log(`Results saved to: ${resultsPath}`);
    
    // Summary
    const totalChanges = results.competitors.reduce((sum, r) => sum + (r.changes?.length || 0), 0);
    console.log(`Total changes detected: ${totalChanges}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    scanner.close();
  }
}

// Run if called directly
if (require.main === module) {
  scanAll();
}

module.exports = scanAll;
