#!/usr/bin/env node

const Councils = require('../src/councils');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'councils.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function loadCouncils() {
  const councils = new Councils();

  try {
    console.log('Loading councils into database...\n');

    for (const council of config.councils) {
      await councils.saveCouncil(council);
      console.log(`✓ Loaded: ${council.name}`);
      console.log(`  Lead: ${council.lead}`);
      console.log(`  Members: ${council.members.join(', ')}`);
      console.log('');
    }

    console.log(`Loaded ${config.councils.length} councils`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    councils.close();
  }
}

loadCouncils();
