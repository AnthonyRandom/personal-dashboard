import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from './useAuth';
import {
  getAllWeatherData,
  getLocationCoordinates,
  getBrowserLocation,
  saveUserLocation,
  getUserLocation,
  checkAndRunDailyCleanup,
} from '@/services/weatherApi';
import { toast } from 'sonner';

export function useWeatherData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Run daily cache cleanup check when component mounts
  React.useEffect(() => {
    if (user?.id) {
      checkAndRunDailyCleanup();
    }
  }, [user?.id]);

  // Get user's saved location
  const { data: userLocation } = useQuery({
    queryKey: ['user-location', user?.id],
    queryFn: () => getUserLocation(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Check for corrupted location data when it changes
  React.useEffect(() => {
    if (userLocation && userLocation.lat && !userLocation.lng) {
      console.error('Location is missing lng property! This location data is corrupted:', userLocation);
      toast.error('Location data is corrupted. Please re-enter your location.');
    }
  }, [userLocation]);

  // Get ALL weather data in a single optimized API call
  const {
    data: allWeatherData,
    isLoading: isLoadingWeather,
    error: weatherError,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ['all-weather-data', userLocation?.lat, userLocation?.lng],
    queryFn: () => {
      if (!userLocation || 
          typeof userLocation.lat !== 'number' || 
          typeof userLocation.lng !== 'number' ||
          isNaN(userLocation.lat) || 
          isNaN(userLocation.lng)) {
        throw new Error('Invalid location data for weather request');
      }
      return getAllWeatherData(userLocation, user?.id);
    },
    enabled: !!userLocation && 
             typeof userLocation.lat === 'number' && 
             typeof userLocation.lng === 'number' &&
             !isNaN(userLocation.lat) && 
             !isNaN(userLocation.lng) &&
             Math.abs(userLocation.lat) <= 90 &&
             Math.abs(userLocation.lng) <= 180,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours - cache data is fresh for 6 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    refetchInterval: 1000 * 60 * 60 * 6, // Auto-refresh every 6 hours
    refetchIntervalInBackground: false, // Only refresh when tab is active
    refetchOnMount: false, // Don't refetch on mount - use cache first
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
    retry: (failureCount, error: any) => {
      // Don't retry if we hit rate limits or have invalid data
      if (error?.message?.includes('429') || 
          error?.message?.includes('rate limit') ||
          error?.message?.includes('Too Many Calls') ||
          error?.message?.includes('Invalid location data')) {
        return false;
      }
      // Max 3 retries for other errors (as requested)
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with jitter: 1s, 2s, 4s + random 0-100ms
      const baseDelay = 1000 * Math.pow(2, attemptIndex);
      const jitter = Math.random() * 100;
      return Math.min(baseDelay + jitter, 60000);
    },
  });

  // Extract individual data from the consolidated response
  const currentWeather = allWeatherData?.currentWeather;
  const forecast = allWeatherData?.forecast;
  const hourlyForecast = allWeatherData?.hourlyForecast;

  // Update location mutation (manual input)
  const updateLocationMutation = useMutation({
    mutationFn: async (locationInput: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // First get coordinates from the location input
      const location = await getLocationCoordinates(locationInput);
      
      // Save to user preferences
      await saveUserLocation(user.id, location);
      
      return location;
    },
    onSuccess: (newLocation) => {
      // Update the user location cache
      queryClient.setQueryData(['user-location', user?.id], newLocation);
      
      // Invalidate all weather data queries to force fresh fetch
      queryClient.invalidateQueries({ 
        queryKey: ['all-weather-data'],
        exact: false 
      });
      
      // Wait a moment and then refetch to ensure the location cache has updated
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ['all-weather-data', newLocation.lat, newLocation.lng],
          exact: true 
        });
        
        // Also manually set the query data to force an immediate fetch
        queryClient.invalidateQueries({ 
          queryKey: ['all-weather-data', newLocation.lat, newLocation.lng],
          exact: true 
        });
      }, 100);
      
      toast.success('Location updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error updating location:', error);
      toast.error('Failed to update location. Please try again.');
    },
  });

  // Browser geolocation mutation
  const useBrowserLocationMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get browser location
      const location = await getBrowserLocation();
      
      // Save to user preferences
      await saveUserLocation(user.id, location);
      
      return location;
    },
    onSuccess: (newLocation) => {
      // Update the user location cache
      queryClient.setQueryData(['user-location', user?.id], newLocation);
      
      // Invalidate all weather data queries to force fresh fetch
      queryClient.invalidateQueries({ 
        queryKey: ['all-weather-data'],
        exact: false 
      });
      
      // Wait a moment and then refetch to ensure the location cache has updated
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ['all-weather-data', newLocation.lat, newLocation.lng],
          exact: true 
        });
        
        // Also manually set the query data to force an immediate fetch
        queryClient.invalidateQueries({ 
          queryKey: ['all-weather-data', newLocation.lat, newLocation.lng],
          exact: true 
        });
      }, 100);
      
      toast.success('Location detected and updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error getting browser location:', error);
      
      // Show specific error messages for different scenarios
      if (error.message.includes('Rate limit') || error.message.includes('rate limit')) {
        toast.error(error.message);
      } else if (error.message.includes('API rate limit active')) {
        toast.error(error.message);
      } else if (error.message.includes('denied')) {
        toast.error('Location access denied. Please allow location access or set location manually.');
      } else if (error.message.includes('unavailable')) {
        toast.error('Location unavailable. Please check your GPS settings or set location manually.');
      } else if (error.message.includes('timeout')) {
        toast.error('Location request timed out. Please try again or set location manually.');
      } else {
        toast.error(error.message || 'Failed to get your location. Please set it manually.');
      }
    },
  });

  // Retry all weather data
  const retryAll = () => {
    refetchWeather();
  };

  // Check if weather data is loading
  const isLoading = isLoadingWeather;

  // Check if there are any errors
  const hasError = weatherError;

  return {
    // Data
    currentWeather,
    forecast,
    hourlyForecast,
    userLocation,
    
    // Loading states
    isLoading,
    isLoadingWeather,
    
    // Error states
    hasError,
    weatherError,
    
    // Actions
    updateLocation: updateLocationMutation.mutate,
    updateLocationAsync: updateLocationMutation.mutateAsync,
    isUpdatingLocation: updateLocationMutation.isPending,
    useBrowserLocation: useBrowserLocationMutation.mutate,
    useBrowserLocationAsync: useBrowserLocationMutation.mutateAsync,
    isUsingBrowserLocation: useBrowserLocationMutation.isPending,
    retryAll,
  };
}
