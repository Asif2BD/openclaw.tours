#!/usr/bin/env node

const Councils = require('../src/councils');

async function listCouncils() {
  const councils = new Councils();

  try {
    console.log('=== Multi-Agent Councils ===\n');

    const list = await councils.getCouncils();

    for (const council of list) {
      console.log(`📋 ${council.name.toUpperCase()}`);
      console.log('-'.repeat(50));
      console.log(`ID: ${council.id}`);
      console.log(`Lead: ${council.lead}`);
      console.log(`Members: ${council.members.join(', ')}`);
      console.log(`Frequency: ${council.meeting_frequency}`);
      console.log(`Description: ${council.description}`);
      console.log('');
    }

    // Show action items summary
    const actionItems = await councils.getActionItems();
    if (actionItems.length > 0) {
      console.log(`\n📋 Open Action Items: ${actionItems.length}`);
      
      const byAssignee = {};
      actionItems.forEach(item => {
        if (!byAssignee[item.assignee]) {
          byAssignee[item.assignee] = 0;
        }
        byAssignee[item.assignee]++;
      });

      for (const [assignee, count] of Object.entries(byAssignee)) {
        console.log(`  - ${assignee}: ${count}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    councils.close();
  }
}

listCouncils();
