import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherIcon, WindIcon, HumidityIcon, VisibilityIcon, UVIcon, AirQualityIcon } from "./WeatherIcon";
import { type CurrentWeather } from "@/services/weatherApi";
import { format } from "date-fns";

interface WeatherCardProps {
  weather: CurrentWeather;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export function WeatherCard({ weather, location }: WeatherCardProps) {

  const getUVLabel = (uv: number) => {
    if (uv <= 2) return { label: "Low", color: "bg-green-500" };
    if (uv <= 5) return { label: "Moderate", color: "bg-yellow-500" };
    if (uv <= 7) return { label: "High", color: "bg-orange-500" };
    if (uv <= 10) return { label: "Very High", color: "bg-red-500" };
    return { label: "Extreme", color: "bg-purple-500" };
  };

  const getPollenLabel = (pollen: number) => {
    if (pollen <= 2.4) return { label: "Low", color: "bg-green-500" };
    if (pollen <= 4.8) return { label: "Moderate", color: "bg-yellow-500" };
    if (pollen <= 7.2) return { label: "High", color: "bg-orange-500" };
    return { label: "Very High", color: "bg-red-500" };
  };

  const locationName = [location.city, location.state, location.country]
    .filter(Boolean)
    .join(", ");

  const uvInfo = getUVLabel(weather.uvIndex);

  return (
    <Card className="dashboard-widget animate-scale-in">
      <CardContent className="p-6">
        {/* Header with location and weather icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold leading-tight">{locationName}</h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d")}
            </p>
          </div>
          <WeatherIcon 
            conditionCode={weather.conditionCode} 
            size={80} 
            className="text-primary ml-4"
          />
        </div>

        {/* Main temperature and condition */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-light">{weather.temperature}°</span>
            <span className="text-lg text-muted-foreground">F</span>
          </div>
          <p className="text-lg text-muted-foreground mb-1">{weather.condition}</p>
          <p className="text-sm text-muted-foreground">
            Feels like {weather.feelsLike}°F
          </p>
        </div>

        {/* Weather metrics in compact grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <WindIcon className="text-muted-foreground w-4 h-4 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-medium">{weather.windSpeed} mph</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HumidityIcon className="text-muted-foreground w-4 h-4 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VisibilityIcon className="text-muted-foreground w-4 h-4 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium">{weather.visibility} mi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UVIcon className="text-muted-foreground w-4 h-4 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">UV Index</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{weather.uvIndex}</span>
                <Badge 
                  variant="secondary" 
                  className={`${uvInfo.color} text-white text-xs px-1.5 py-0.5`}
                >
                  {uvInfo.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality section header */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <AirQualityIcon className="text-muted-foreground w-4 h-4" />
            <span className="text-sm font-medium">Air Quality</span>
          </div>
        </div>

        {/* Pollen information in compact layout */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tree</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{weather.pollen.tree}</span>
              <Badge 
                variant="secondary" 
                className={`${getPollenLabel(weather.pollen.tree).color} text-white text-xs px-1 py-0.5`}
              >
                {getPollenLabel(weather.pollen.tree).label}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Grass</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{weather.pollen.grass}</span>
              <Badge 
                variant="secondary" 
                className={`${getPollenLabel(weather.pollen.grass).color} text-white text-xs px-1 py-0.5`}
              >
                {getPollenLabel(weather.pollen.grass).label}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Weed</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{weather.pollen.weed}</span>
              <Badge 
                variant="secondary" 
                className={`${getPollenLabel(weather.pollen.weed).color} text-white text-xs px-1 py-0.5`}
              >
                {getPollenLabel(weather.pollen.weed).label}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
