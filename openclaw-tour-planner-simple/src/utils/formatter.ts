import { Itinerary } from './types';

export function formatAsMarkdown(itinerary: Itinerary): string {
  let md = `# ${itinerary.durationDays}-Day ${itinerary.destination.name} Adventure\n\n`;
  
  md += `## Overview\n`;
  md += `- **Destination:** ${itinerary.destination.name}, ${itinerary.destination.country}\n`;
  md += `- **Duration:** ${itinerary.durationDays} days\n`;
  if (itinerary.weatherSummary) {
    md += `- **Weather:** ${itinerary.weatherSummary}\n`;
  }
  md += `- **Budget:** $${itinerary.budgetEstimate.min}-$${itinerary.budgetEstimate.max} ${itinerary.budgetEstimate.currency}\n\n`;
  
  md += `## Itinerary\n\n`;
  
  for (const day of itinerary.days) {
    md += `### Day ${day.day}: ${day.theme}\n\n`;
    
    md += `**Morning**\n`;
    for (const activity of day.morning) {
      md += `- **${activity.time}** — ${activity.name}: ${activity.description}\n`;
    }
    md += `\n`;
    
    md += `**Afternoon**\n`;
    for (const activity of day.afternoon) {
      md += `- **${activity.time}** — ${activity.name}: ${activity.description}\n`;
    }
    md += `\n`;
    
    md += `**Evening**\n`;
    for (const activity of day.evening) {
      md += `- **${activity.time}** — ${activity.name}: ${activity.description}\n`;
    }
    md += `\n`;
  }
  
  md += `## Packing List\n`;
  for (const item of itinerary.packingList) {
    md += `- [ ] ${item}\n`;
  }
  md += `\n`;
  
  md += `## Tips\n`;
  for (const tip of itinerary.tips) {
    md += `- ${tip}\n`;
  }
  
  return md;
}
