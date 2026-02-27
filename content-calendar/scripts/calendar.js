#!/usr/bin/env node

const ContentCalendar = require('../src/calendar');

async function showCalendar() {
  const args = process.argv.slice(2);
  const calendar = new ContentCalendar();

  try {
    // Parse view type
    let viewType = 'week';
    let filterStatus = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--week' || args[i] === '-w') {
        viewType = 'week';
      } else if (args[i] === '--month' || args[i] === '-m') {
        viewType = 'month';
      } else if (args[i] === '--status' && args[i + 1]) {
        filterStatus = args[i + 1];
        i++;
      }
    }

    console.log(`=== Content Calendar (${viewType} view) ===\n`);

    if (filterStatus) {
      console.log(`Filtered by status: ${filterStatus}\n`);
      const content = await calendar.getContentByStatus(filterStatus);
      
      if (content.length === 0) {
        console.log('No content found.');
      } else {
        console.log(`Found ${content.length} item(s):\n`);
        content.forEach(item => {
          console.log(`📄 ${item.title}`);
          console.log(`   ID: ${item.id}`);
          console.log(`   Type: ${item.type} | Assignee: ${item.assignee}`);
          if (item.due_date) {
            console.log(`   Due: ${item.due_date}`);
          }
          console.log('');
        });
      }
    } else {
      // Show by assignee
      const assignees = ['agent-bard', 'agent-flash', 'agent-vision', 'agent-ironclad'];
      
      for (const assignee of assignees) {
        const content = await calendar.getContentByAssignee(assignee);
        if (content.length > 0) {
          const agentName = assignee.replace('agent-', '').toUpperCase();
          console.log(`\n👤 ${agentName} (${content.length} items)`);
          console.log('-'.repeat(50));
          
          content.forEach(item => {
            const statusEmoji = getStatusEmoji(item.status);
            const dueStr = item.due_date ? ` | Due: ${item.due_date}` : '';
            console.log(`${statusEmoji} ${item.title} (${item.type})${dueStr}`);
          });
        }
      }

      // Show overdue
      const overdue = await calendar.getOverdueContent();
      if (overdue.length > 0) {
        console.log('\n\n🚨 OVERDUE');
        console.log('-'.repeat(50));
        overdue.forEach(item => {
          console.log(`❌ ${item.title} (Due: ${item.due_date})`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    calendar.close();
  }
}

function getStatusEmoji(status) {
  const emojis = {
    'idea': '💡',
    'outline': '📝',
    'draft': '✍️',
    'review': '👀',
    'scheduled': '📅',
    'published': '✅'
  };
  return emojis[status] || '⬜';
}

showCalendar();
