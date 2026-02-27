#!/usr/bin/env node

const ContentCalendar = require('../src/calendar');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'content-types.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function addContent() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const title = args[0];
  if (!title) {
    console.log('Usage: node add.js "Content Title" [options]');
    console.log('');
    console.log('Options:');
    console.log('  --type TYPE          Content type (comparison, tutorial, use-case, pillar, social, video, visual)');
    console.log('  --assignee AGENT     Assign to agent (agent-bard, agent-flash, agent-vision)');
    console.log('  --due YYYY-MM-DD     Due date');
    console.log('  --priority LEVEL     Priority: low, medium, high');
    console.log('  --description DESC   Description');
    console.log('  --channels LIST      Channels: blog,twitter,youtube,etc');
    console.log('');
    console.log('Examples:');
    console.log('  node add.js "EmbedPress vs PDF Embedder" --type comparison --due 2026-02-25');
    console.log('  node add.js "How to Embed PDFs" --type tutorial --assignee agent-bard');
    process.exit(1);
  }

  // Parse options
  const options = {
    type: 'tutorial',
    priority: 'medium'
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--type' && args[i + 1]) {
      options.type = args[i + 1];
      i++;
    } else if (arg === '--assignee' && args[i + 1]) {
      options.assignee = args[i + 1];
      i++;
    } else if (arg === '--due' && args[i + 1]) {
      options.dueDate = args[i + 1];
      i++;
    } else if (arg === '--priority' && args[i + 1]) {
      options.priority = args[i + 1];
      i++;
    } else if (arg === '--description' && args[i + 1]) {
      options.description = args[i + 1];
      i++;
    } else if (arg === '--channels' && args[i + 1]) {
      options.channels = args[i + 1].split(',');
      i++;
    }
  }

  const calendar = new ContentCalendar();

  try {
    console.log('Adding content to calendar...\n');
    
    const content = await calendar.addContent({
      title,
      type: options.type,
      description: options.description,
      assignee: options.assignee,
      dueDate: options.dueDate,
      priority: options.priority,
      channels: options.channels
    });

    console.log('✅ Content added successfully!');
    console.log('');
    console.log(`ID: ${content.id}`);
    console.log(`Title: ${content.title}`);
    console.log(`Type: ${content.type}`);
    console.log(`Assignee: ${content.assignee}`);
    console.log(`Status: ${content.status}`);
    if (content.due_date) {
      console.log(`Due: ${content.due_date}`);
    }
    console.log(`Priority: ${content.priority}`);
    console.log('');
    console.log('Next steps:');
    console.log(`  - Update status: node scripts/update.js ${content.id} --status outline`);
    console.log(`  - View in calendar: node scripts/calendar.js`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    calendar.close();
  }
}

addContent();
