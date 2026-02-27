import { Destination, DayPlan, Itinerary, PlanRequest } from '../types';
import { geocode } from '../apis/nominatim';
import { getWeather } from '../apis/weather';
import { getGuide } from '../apis/wikivoyage';

export async function createItinerary(request: PlanRequest): Promise<Itinerary | null> {
  // Step 1: Geocode destination
  const destination = await geocode(request.destination);
  if (!destination) {
    throw new Error(`Could not find destination: ${request.destination}`);
  }
  
  // Step 2: Get weather forecast
  const weather = await getWeather(
    destination.coordinates.lat,
    destination.coordinates.lon,
    request.durationDays
  );
  
  // Step 3: Get travel guide
  const guide = await getGuide(request.destination);
  
  // Step 4: Generate day-by-day plan
  const days: DayPlan[] = [];
  for (let i = 1; i <= request.durationDays; i++) {
    days.push(generateDayPlan(i, destination, request));
  }
  
  // Step 5: Calculate budget
  const budget = calculateBudget(request.durationDays, request.budgetLevel);
  
  return {
    destination,
    durationDays: request.durationDays,
    days,
    weatherSummary: weather.length > 0 
      ? `Average ${Math.round(weather.reduce((a, b) => a + b.tempMax, 0) / weather.length)}°C`
      : undefined,
    budgetEstimate: budget,
    packingList: generatePackingList(weather, request.durationDays),
    tips: extractTips(guide)
  };
}

function generateDayPlan(day: number, destination: Destination, request: PlanRequest): DayPlan {
  const themes = ['Arrival & Exploration', 'City Highlights', 'Cultural Sites', 'Nature & Outdoors', 'Food & Shopping', 'Hidden Gems'];
  
  return {
    day,
    theme: themes[(day - 1) % themes.length],
    morning: [
      { time: '09:00', name: 'Breakfast at local cafe', description: 'Start with traditional breakfast', duration: 1, cost: 15 }
    ],
    afternoon: [
      { time: '13:00', name: 'Explore main attractions', description: `Visit top sights in ${destination.name}`, duration: 3, cost: 30 }
    ],
    evening: [
      { time: '19:00', name: 'Dinner experience', description: 'Local cuisine at recommended restaurant', duration: 2, cost: 40 }
    ],
    estimatedCost: 85
  };
}

function calculateBudget(days: number, level: string = 'mid-range'): { min: number; max: number; currency: string } {
  const dailyRates: Record<string, { min: number; max: number }> = {
    'budget': { min: 50, max: 100 },
    'mid-range': { min: 150, max: 300 },
    'luxury': { min: 400, max: 800 }
  };
  
  const rate = dailyRates[level] || dailyRates['mid-range'];
  return {
    min: rate.min * days,
    max: rate.max * days,
    currency: 'USD'
  };
}

function generatePackingList(weather: any[], days: number): string[] {
  const list = ['Travel documents', 'Phone charger', 'Basic toiletries'];
  
  if (weather.some(w => w.tempMax > 25)) list.push('Light clothing', 'Sunscreen');
  if (weather.some(w => w.tempMin < 15)) list.push('Warm layers', 'Jacket');
  if (weather.some(w => w.precipitationChance > 30)) list.push('Umbrella', 'Rain jacket');
  
  return list;
}

function extractTips(guide: string): string[] {
  // Simple extraction - in production, use NLP
  return [
    'Respect local customs and dress codes',
    'Learn basic phrases in the local language',
    'Keep copies of important documents'
  ];
}
