import { supabase } from './supabase';

const TOMORROW_API_KEY = import.meta.env.VITE_TOMORROW_API_KEY;
const TOMORROW_BASE_URL = 'https://api.tomorrow.io/v4';

// Rate limiting state
let lastRateLimitHit = 0;
let rateLimitBackoffMs = 0;

// Check if we're in a rate limit backoff period
function isInRateLimitBackoff(): boolean {
  if (rateLimitBackoffMs === 0) return false;
  
  const timeSinceLastHit = Date.now() - lastRateLimitHit;
  if (timeSinceLastHit >= rateLimitBackoffMs) {
    // Backoff period has passed, reset
    rateLimitBackoffMs = 0;
    return false;
  }
  
  return true;
}

// Calculate time until top of next hour
function getTimeUntilNextHour(): number {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Next hour at 0 minutes, 0 seconds
  return nextHour.getTime() - now.getTime();
}

// Set rate limit backoff when we hit a 429 - wait until top of next hour for Tomorrow.io
function setRateLimitBackoff(): void {
  lastRateLimitHit = Date.now();
  // For Tomorrow.io API, wait until the top of the next hour when limits reset
  rateLimitBackoffMs = getTimeUntilNextHour();
}

// Make rate-limit aware API request
async function makeApiRequest(url: string, options?: RequestInit): Promise<Response> {
  if (isInRateLimitBackoff()) {
    const remainingMs = rateLimitBackoffMs - (Date.now() - lastRateLimitHit);
    const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);
    throw new Error(`API rate limit active. Please try again in ${remainingMinutes} minutes (limit resets at the top of each hour).`);
  }

  const response = await fetch(url, options);
  
  if (response.status === 429) {
    setRateLimitBackoff();
    const errorText = await response.text();
    const waitMinutes = Math.ceil(rateLimitBackoffMs / 1000 / 60);
    throw new Error(`Rate limit exceeded. Please try again in ${waitMinutes} minutes when the hourly limit resets. ${errorText}`);
  }
  
  return response;
}

export interface WeatherLocation {
  lat: number;
  lng: number;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  airQuality: number;
  pollen: {
    tree: number;
    grass: number;
    weed: number;
  };
  condition: string;
  conditionCode: number;
  feelsLike: number;
  pressure: number;
  dewPoint: number;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

// Get user's location using browser geolocation API
export async function getBrowserLocation(): Promise<WeatherLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get location name
          const locationData = await reverseGeocodeLocation(latitude, longitude);
          
          resolve({
            lat: latitude,
            lng: longitude,
            city: locationData.city,
            state: locationData.state,
            country: locationData.country,
          });
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 5, // Use cached location for 5 minutes
      }
    );
  });
}

// Reverse geocode coordinates to get location name using Tomorrow.io
async function reverseGeocodeLocation(lat: number, lng: number): Promise<{ city?: string; state?: string; country?: string }> {
  try {
    if (!TOMORROW_API_KEY) {
      throw new Error('Tomorrow.io API key is not configured');
    }

    const url = `${TOMORROW_BASE_URL}/weather/realtime?location=${lat},${lng}&apikey=${TOMORROW_API_KEY}`;
    
    const response = await makeApiRequest(url);
    
    if (!response.ok) {
      console.warn('Failed to reverse geocode location, using coordinates only');
      return { city: `${lat.toFixed(2)}, ${lng.toFixed(2)}` };
    }
    
    const data = await response.json();
    
    return {
      city: data.location?.name,
      state: data.location?.state,
      country: data.location?.country,
    };
  } catch (error) {
    console.warn('Error reverse geocoding:', error);
    return { city: `${lat.toFixed(2)}, ${lng.toFixed(2)}` };
  }
}

// Convert city/zip to coordinates and get all weather data in one efficient call
export async function getLocationCoordinates(location: string): Promise<WeatherLocation> {
  try {
    if (!TOMORROW_API_KEY) {
      throw new Error('Tomorrow.io API key is not configured');
    }

    const url = `${TOMORROW_BASE_URL}/weather/realtime?location=${encodeURIComponent(location)}&apikey=${TOMORROW_API_KEY}`;
    
    const response = await makeApiRequest(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get location coordinates: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.location) {
      throw new Error('Invalid response format from location API');
    }
    
    return {
      lat: data.location.lat,
      lng: data.location.lng || data.location.lon, // Try both lng and lon
      city: data.location.name,
      state: data.location.state,
      country: data.location.country,
    };
  } catch (error) {
    console.error('Error getting location coordinates:', error);
    throw error;
  }
}

// Consolidated weather data interface
export interface AllWeatherData {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  hourlyForecast: HourlyForecast[];
}

// Weather cache functions
async function getWeatherFromCache(userId: string, locationKey: string): Promise<AllWeatherData | null> {
  try {
    const { data, error } = await supabase
      .from('weather_cache')
      .select('cache_data, expires_at')
      .eq('user_id', userId)
      .eq('location_key', locationKey)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // No cache found
    if (!data) {
      return null;
    }

    // Check if cache is still valid
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      // Cache expired, delete it
      await supabase
        .from('weather_cache')
        .delete()
        .eq('user_id', userId)
        .eq('location_key', locationKey);
      return null;
    }

    return data.cache_data as AllWeatherData;
  } catch (error) {
    console.error('Error reading weather cache:', error);
    return null;
  }
}

async function saveWeatherToCache(userId: string, locationKey: string, weatherData: AllWeatherData): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 6); // Cache for 6 hours

    const { error } = await supabase
      .from('weather_cache')
      .upsert({
        user_id: userId,
        location_key: locationKey,
        cache_data: weatherData,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,location_key'
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving weather cache:', error);
    // Don't throw error - cache failure shouldn't break the main flow
  }
}

async function cleanupExpiredCache(): Promise<void> {
  try {
    await supabase.rpc('cleanup_expired_weather_cache');
  } catch (error) {
    console.error('Error cleaning up expired cache:', error);
  }
}

// Daily cache cleanup function - removes all cache entries that are older than today
export async function cleanupDailyWeatherCache(): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const { error } = await supabase
      .from('weather_cache')
      .delete()
      .lt('created_at', today.toISOString());

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error cleaning up daily weather cache:', error);
  }
}

// Check if we should run daily cleanup (run once per day)
export async function checkAndRunDailyCleanup(): Promise<void> {
  try {
    const lastCleanupKey = 'weather_cache_last_cleanup';
    const lastCleanup = localStorage.getItem(lastCleanupKey);
    const today = new Date().toDateString();
    
    if (lastCleanup !== today) {
      await cleanupDailyWeatherCache();
      localStorage.setItem(lastCleanupKey, today);
    }
  } catch (error) {
    console.error('Error checking daily cleanup:', error);
  }
}

// Get ALL weather data in a single API call using the Timeline API
export async function getAllWeatherData(location: WeatherLocation, userId?: string): Promise<AllWeatherData> {
  try {
    // Validate location data before making API call
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      throw new Error('Invalid location data: latitude and longitude must be valid numbers');
    }

    if (isNaN(location.lat) || isNaN(location.lng)) {
      throw new Error('Invalid location data: latitude and longitude cannot be NaN');
    }

    if (Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) {
      throw new Error('Invalid location data: coordinates out of valid range');
    }

    const locationKey = `${location.lat.toFixed(6)},${location.lng.toFixed(6)}`;

    // Check cache first if userId is provided
    if (userId) {
      const cachedData = await getWeatherFromCache(userId, locationKey);
      if (cachedData) {
        return cachedData;
      }
    }

    if (!TOMORROW_API_KEY) {
      throw new Error('Tomorrow.io API key is not configured');
    }

    // Use the Timeline API to get all data in one call
    const requestBody = {
      location: `${location.lat},${location.lng}`,
      fields: [
        // Current weather fields
        'temperature',
        'humidity',
        'windSpeed',
        'visibility',
        'uvIndex',
        'epaIndex',
        'treeIndex',
        'grassIndex',
        'weedIndex',
        'weatherCode',
        'temperatureApparent',
        'pressureSurfaceLevel',
        'dewPoint',
        // Forecast fields
        'temperatureMax',
        'temperatureMin',
        'precipitationProbability'
      ],
      units: 'imperial',
      timesteps: ['current', '1h', '1d'],
      startTime: 'now',
      endTime: 'nowPlus5d' // Changed from 7d to 5d due to API plan restrictions
    };

    const url = `${TOMORROW_BASE_URL}/timelines?apikey=${TOMORROW_API_KEY}`;
    
    const response = await makeApiRequest(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch weather data: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.timelines) {
      throw new Error('Invalid response format from Timeline API');
    }

    // Parse the response to extract current, hourly, and daily data
    const timelines = data.data.timelines;
    
    // Find current, hourly, and daily timelines
    const currentTimeline = timelines.find((t: any) => t.timestep === 'current');
    const hourlyTimeline = timelines.find((t: any) => t.timestep === '1h');
    const dailyTimeline = timelines.find((t: any) => t.timestep === '1d');

    // Parse current weather
    let currentWeather: CurrentWeather;
    if (currentTimeline && currentTimeline.intervals && currentTimeline.intervals[0]) {
      const values = currentTimeline.intervals[0].values;
      currentWeather = {
        temperature: Math.round(values.temperature || 0),
        humidity: Math.round(values.humidity || 0),
        windSpeed: Math.round(values.windSpeed || 0),
        visibility: Math.round(values.visibility || 0),
        uvIndex: Math.round(values.uvIndex || 0),
        airQuality: Math.round(values.epaIndex || 0),
        pollen: {
          tree: Math.round(values.treeIndex || 0),
          grass: Math.round(values.grassIndex || 0),
          weed: Math.round(values.weedIndex || 0),
        },
        condition: getWeatherCondition(values.weatherCode || 1000),
        conditionCode: values.weatherCode || 1000,
        feelsLike: Math.round(values.temperatureApparent || values.temperature || 0),
        pressure: Math.round(values.pressureSurfaceLevel || 0),
        dewPoint: Math.round(values.dewPoint || 0),
      };
    } else {
      throw new Error('Current weather data not available');
    }

    // Parse hourly forecast
    const hourlyForecast: HourlyForecast[] = [];
    if (hourlyTimeline && hourlyTimeline.intervals) {
      hourlyTimeline.intervals.slice(0, 24).forEach((interval: any) => {
        const values = interval.values;
        const time = new Date(interval.startTime);
        hourlyForecast.push({
          time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: Math.round(values.temperature || 0),
          condition: getWeatherCondition(values.weatherCode || 1000),
          conditionCode: values.weatherCode || 1000,
          humidity: Math.round(values.humidity || 0),
          windSpeed: Math.round(values.windSpeed || 0),
          precipitation: Math.round(values.precipitationProbability || 0),
        });
      });
    }

    // Parse daily forecast
    const forecast: ForecastDay[] = [];
    if (dailyTimeline && dailyTimeline.intervals) {
      dailyTimeline.intervals.slice(0, 5).forEach((interval: any) => {
        const values = interval.values;
        forecast.push({
          date: interval.startTime.split('T')[0],
          high: Math.round(values.temperatureMax || values.temperature || 0),
          low: Math.round(values.temperatureMin || values.temperature || 0),
          condition: getWeatherCondition(values.weatherCode || 1000),
          conditionCode: values.weatherCode || 1000,
          humidity: Math.round(values.humidity || 0),
          windSpeed: Math.round(values.windSpeed || 0),
          precipitation: Math.round(values.precipitationProbability || 0),
          uvIndex: Math.round(values.uvIndex || 0),
        });
      });
    }

    const allWeatherData = {
      currentWeather,
      forecast,
      hourlyForecast
    };

    // Save to cache if userId is provided
    if (userId) {
      await saveWeatherToCache(userId, locationKey, allWeatherData);
      
      // Cleanup expired cache entries (run occasionally)
      if (Math.random() < 0.1) { // 10% chance to run cleanup
        cleanupExpiredCache();
      }
    }

    return allWeatherData;
  } catch (error) {
    console.error('Error fetching all weather data:', error);
    throw error;
  }
}

// Legacy functions for backward compatibility - now use the consolidated API
export async function getCurrentWeather(location: WeatherLocation, userId?: string): Promise<CurrentWeather> {
  const data = await getAllWeatherData(location, userId);
  return data.currentWeather;
}

export async function getForecast(location: WeatherLocation, userId?: string): Promise<ForecastDay[]> {
  const data = await getAllWeatherData(location, userId);
  return data.forecast;
}

export async function getHourlyForecast(location: WeatherLocation, userId?: string): Promise<HourlyForecast[]> {
  const data = await getAllWeatherData(location, userId);
  return data.hourlyForecast;
}

// Weather condition mapping based on Tomorrow.io weather codes
function getWeatherCondition(code: number): string {
  const conditions: { [key: number]: string } = {
    1000: 'Clear',
    1100: 'Mostly Clear',
    1101: 'Partly Cloudy',
    1102: 'Mostly Cloudy',
    2000: 'Fog',
    4000: 'Drizzle',
    4001: 'Rain',
    4200: 'Light Rain',
    4201: 'Heavy Rain',
    5000: 'Snow',
    5001: 'Flurries',
    5100: 'Light Snow',
    5101: 'Heavy Snow',
    6000: 'Freezing Drizzle',
    6200: 'Light Freezing Rain',
    6201: 'Heavy Freezing Rain',
    7000: 'Ice Pellets',
    7101: 'Heavy Ice Pellets',
    7102: 'Light Ice Pellets',
    8000: 'Thunderstorm',
  };
  
  return conditions[code] || 'Unknown';
}

// Save user's weather location preference to Supabase
export async function saveUserLocation(userId: string, location: WeatherLocation): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        weather_location: location,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving user location:', error);
    throw error;
  }
}

// Get user's saved weather location from Supabase
export async function getUserLocation(userId: string): Promise<WeatherLocation | null> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('weather_location')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, return null
        return null;
      }
      throw error;
    }

    return data?.weather_location || null;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
}
