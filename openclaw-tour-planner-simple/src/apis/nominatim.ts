import axios from 'axios';
import { Destination } from '../types';

const client = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  headers: { 'User-Agent': 'OpenCLAW-TourPlanner/1.0' }
});

export async function geocode(query: string): Promise<Destination | null> {
  try {
    const response = await client.get('/search', {
      params: { q: query, format: 'json', limit: 1, addressdetails: 1 }
    });
    
    if (!response.data.length) return null;
    
    const item = response.data[0];
    const address = item.address || {};
    
    return {
      name: item.name || item.display_name.split(',')[0],
      country: address.country || '',
      coordinates: { lat: parseFloat(item.lat), lon: parseFloat(item.lon) }
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
