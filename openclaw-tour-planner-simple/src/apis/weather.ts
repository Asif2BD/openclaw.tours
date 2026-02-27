import axios from 'axios';
import { WeatherDay } from '../types';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY || '';

export async function getWeather(lat: number, lon: number, days: number = 7): Promise<WeatherDay[]> {
  if (!API_KEY) {
    console.warn('No Visual Crossing API key set');
    return [];
  }
  
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/next${days}days`;
    const response = await axios.get(url, {
      params: { unitGroup: 'metric', key: API_KEY, contentType: 'json' }
    });
    
    return response.data.days.map((day: any) => ({
      date: day.datetime,
      tempMax: day.tempmax,
      tempMin: day.tempmin,
      conditions: day.conditions,
      precipitationChance: day.precipprob || 0
    }));
  } catch (error) {
    console.error('Weather API error:', error);
    return [];
  }
}
