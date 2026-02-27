#!/usr/bin/env node

const DailyBriefing = require('../src/briefing');

async function generate() {
  console.log('Generating daily briefing...\n');

  const briefing = new DailyBriefing();

  try {
    const { briefing: content, filepath } = await briefing.generate();

    console.log('=== Daily Briefing Generated ===');
    console.log(`File: ${filepath}`);
    console.log('\n' + '='.repeat(50));
    console.log(content);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

generate();
