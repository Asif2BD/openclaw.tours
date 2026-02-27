import { createItinerary } from './planners/itinerary';
import { formatAsMarkdown } from './utils/formatter';
import { PlanRequest } from './types';

export { createItinerary, formatAsMarkdown };
export * from './types';

// Main entry point for OpenClaw skill
export async function planTour(request: PlanRequest): Promise<string> {
  try {
    const itinerary = await createItinerary(request);
    if (!itinerary) {
      return `Sorry, I couldn't find information about "${request.destination}". Please check the spelling or try a different destination.`;
    }
    return formatAsMarkdown(itinerary);
  } catch (error) {
    return `Error creating itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
