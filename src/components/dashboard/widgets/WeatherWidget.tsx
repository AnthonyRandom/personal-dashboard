import { Cloud, Sun, CloudRain } from "lucide-react";
import { Widget } from "@/components/ui/widget";
import { useWeatherData } from "@/hooks/useWeatherData";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { Loader2 } from "lucide-react";

export function WeatherWidget() {
  const { currentWeather, forecast, userLocation, isLoading } = useWeatherData();

  if (isLoading) {
    return (
      <Widget
        title="Weather"
        icon={<Sun className="w-5 h-5" />}
      >
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Widget>
    );
  }

  if (!currentWeather || !forecast || !userLocation) {
    return (
      <Widget
        title="Weather"
        icon={<Sun className="w-5 h-5" />}
      >
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-muted-foreground text-center">
            Set location to view weather
          </p>
        </div>
      </Widget>
    );
  }

  const locationName = [userLocation.city, userLocation.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Widget
      title="Weather"
      icon={<Sun className="w-5 h-5" />}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold">{currentWeather.temperature}°F</p>
          <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
          <p className="text-xs text-muted-foreground">{locationName}</p>
        </div>
        <WeatherIcon 
          conditionCode={currentWeather.conditionCode} 
          size={32} 
          className="text-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {forecast.slice(1, 4).map((day, index) => (
          <div key={day.date} className="space-y-1 hover-subtle rounded-lg p-2 transition-colors">
            <WeatherIcon 
              conditionCode={day.conditionCode} 
              size={16} 
              className="mx-auto text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              {index === 0 ? "Tomorrow" : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <p className="text-sm font-medium">{day.high}°</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}
