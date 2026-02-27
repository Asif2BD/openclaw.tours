#!/usr/bin/env node

const SEOMonitor = require('../src/monitor');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'keywords.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function loadKeywords() {
  const monitor = new SEOMonitor();

  try {
    console.log('Loading keywords into database...\n');

    for (const keyword of config.keywords) {
      await monitor.addKeyword(keyword);
      console.log(`✓ Loaded: ${keyword.keyword}`);
    }

    console.log(`\nLoaded ${config.keywords.length} keywords`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    monitor.close();
  }
}

loadKeywords();
