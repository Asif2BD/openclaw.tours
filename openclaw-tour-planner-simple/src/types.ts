// Core types for tour planner

export interface Destination {
  name: string;
  country: string;
  coordinates: { lat: number; lon: number };
  timezone?: string;
  currency?: string;
  language?: string;
}

export interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  conditions: string;
  precipitationChance: number;
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: number;
  cost: number;
}

export interface DayPlan {
  day: number;
  theme: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  estimatedCost: number;
}

export interface Itinerary {
  destination: Destination;
  durationDays: number;
  days: DayPlan[];
  weatherSummary?: string;
  budgetEstimate: { min: number; max: number; currency: string };
  packingList: string[];
  tips: string[];
}

export interface PlanRequest {
  destination: string;
  durationDays: number;
  startDate?: string;
  budgetLevel?: 'budget' | 'mid-range' | 'luxury';
  interests?: string[];
}
