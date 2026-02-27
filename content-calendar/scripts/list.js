#!/usr/bin/env node

const ContentCalendar = require('../src/calendar');

async function listContent() {
  const calendar = new ContentCalendar();

  try {
    console.log('=== Content Calendar ===\n');

    const items = await calendar.getAllContent();

    // Group by status
    const byStatus = {};
    items.forEach(item => {
      if (!byStatus[item.status]) {
        byStatus[item.status] = [];
      }
      byStatus[item.status].push(item);
    });

    // Display by status
    const statusOrder = ['idea', 'outline', 'draft', 'review', 'scheduled', 'published', 'archived'];
    
    for (const status of statusOrder) {
      if (byStatus[status]) {
        console.log(`\n📋 ${status.toUpperCase()} (${byStatus[status].length})`);
        console.log('-'.repeat(60));
        
        byStatus[status].forEach(item => {
          const priorityEmoji = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢';
          const dueEmoji = item.due_date ? `📅 ${item.due_date}` : '';
          console.log(`${priorityEmoji} ${item.title}`);
          console.log(`   Type: ${item.type} | Assignee: ${item.assignee} ${dueEmoji}`);
          console.log('');
        });
      }
    }

    console.log(`\nTotal: ${items.length} content items`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    calendar.close();
  }
}

listContent();
