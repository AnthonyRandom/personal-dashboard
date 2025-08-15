import { useState } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { ForecastList } from "@/components/weather/ForecastList";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { LocationForm } from "@/components/weather/LocationForm";
import { GeolocationPrompt } from "@/components/weather/GeolocationPrompt";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

export default function WeatherPage() {
  const [showGeolocationPrompt, setShowGeolocationPrompt] = useState(true);
  
  const {
    currentWeather,
    forecast,
    hourlyForecast,
    userLocation,
    isLoading,
    hasError,
    weatherError,
    retryAll,
  } = useWeatherData();

  // Check if we're rate limited or have location issues
  const isRateLimit = weatherError?.message?.includes('429') || 
                     weatherError?.message?.includes('rate limit') ||
                     weatherError?.message?.includes('Too Many Calls');
  
  const isLocationError = weatherError?.message?.includes('Invalid location data');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
          <p className="text-muted-foreground">Current conditions and forecast</p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
          <p className="text-muted-foreground">Current conditions and forecast</p>
        </div>

        <Alert variant={isRateLimit ? "default" : "destructive"} className="animate-slide-up">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isRateLimit ? (
              <>
                Weather API rate limit reached. Please wait a few minutes before refreshing. 
                The limit resets every hour.
              </>
            ) : isLocationError ? (
              "Please set a valid location to view weather data."
            ) : (
              "Failed to load weather data. Please check your location settings and try again."
            )}
          </AlertDescription>
        </Alert>

        {!isRateLimit && !isLocationError && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={retryAll} className="hover:scale-[1.02] transition-transform">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {isLocationError && <LocationForm />}

        {isRateLimit && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              API usage will reset at the top of the next hour. <br />
              Weather data will automatically refresh when available.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
          <p className="text-muted-foreground">Set your location to view weather data</p>
        </div>

        {/* Show geolocation prompt first - but not if rate limited */}
        {showGeolocationPrompt && !isRateLimit && (
          <GeolocationPrompt onDismiss={() => setShowGeolocationPrompt(false)} />
        )}

        {/* Show rate limit warning if applicable */}
        {isRateLimit && (
          <Alert variant="default" className="animate-slide-up">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Weather API rate limit reached. Please wait for the limit to reset before setting a new location.
            </AlertDescription>
          </Alert>
        )}

        {!isRateLimit && <LocationForm />}
      </div>
    );
  }

  if (!currentWeather || !forecast || !hourlyForecast) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
          <p className="text-muted-foreground">Current conditions and forecast</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Weather data is not available. Please try updating your location.
          </AlertDescription>
        </Alert>

        <LocationForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
        <p className="text-muted-foreground">Current conditions and forecast</p>
      </div>

      {/* Weather Cards - 3 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <WeatherCard 
          weather={currentWeather} 
          location={(() => {
            const locationData: { city?: string; state?: string; country?: string } = {};
            if (userLocation.city) locationData.city = userLocation.city;
            if (userLocation.state) locationData.state = userLocation.state;
            if (userLocation.country) locationData.country = userLocation.country;
            return locationData;
          })()}
        />

        {/* 5-Day Forecast */}
        <ForecastList forecast={forecast} />
        
        {/* Hourly Forecast */}
        <HourlyForecast hourlyForecast={hourlyForecast} />
      </div>

      {/* Location Settings */}
      <LocationForm />
    </div>
  );
}
