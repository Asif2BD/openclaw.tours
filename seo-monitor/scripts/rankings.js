#!/usr/bin/env node

const SEOMonitor = require('../src/monitor');

async function showRankings() {
  const monitor = new SEOMonitor();

  try {
    console.log('=== SEO Rankings ===\n');

    const rankings = await monitor.getLatestRankings();

    if (rankings.length === 0) {
      console.log('No keywords loaded. Run: node scripts/load-keywords.js');
      return;
    }

    // Group by category
    const byCategory = {};
    rankings.forEach(r => {
      if (!byCategory[r.category]) {
        byCategory[r.category] = [];
      }
      byCategory[r.category].push(r);
    });

    for (const [category, items] of Object.entries(byCategory)) {
      console.log(`\n${category.toUpperCase()} KEYWORDS`);
      console.log('-'.repeat(70));
      console.log(`${'Keyword'.padEnd(45)} ${'Position'.padEnd(12)} ${'Priority'}`);
      console.log('-'.repeat(70));

      items.forEach(r => {
        const position = r.position ? r.position.toString() : 'Not ranked';
        const emoji = r.position && r.position <= 10 ? '🟢' : r.position && r.position <= 30 ? '🟡' : '🔴';
        console.log(`${emoji} ${r.keyword.substring(0, 43).padEnd(43)} ${position.padEnd(12)} ${r.priority}`);
      });
    }

    // Summary
    const ranked = rankings.filter(r => r.position).length;
    const notRanked = rankings.filter(r => !r.position).length;
    const top10 = rankings.filter(r => r.position && r.position <= 10).length;

    console.log('\n\n=== Summary ===');
    console.log(`Total keywords: ${rankings.length}`);
    console.log(`Ranked: ${ranked}`);
    console.log(`Not ranked: ${notRanked}`);
    console.log(`Top 10: ${top10}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    monitor.close();
  }
}

showRankings();
