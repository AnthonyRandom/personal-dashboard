import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { type HourlyForecast as HourlyForecastType } from "@/services/weatherApi";

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastType[];
}

export function HourlyForecast({ hourlyForecast }: HourlyForecastProps) {
  return (
    <Card className="dashboard-widget animate-scale-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hourly Forecast</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {hourlyForecast.slice(0, 10).map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <p className="text-sm font-medium">
                {hour.time}
              </p>
              <WeatherIcon 
                conditionCode={hour.conditionCode} 
                size={36} 
                className="text-muted-foreground"
              />
              <p className="text-base font-semibold">{hour.temperature}°</p>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  {hour.humidity}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {hour.windSpeed} mph
                </p>
                {hour.precipitation > 0 && (
                  <p className="text-xs text-blue-500">
                    {hour.precipitation}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
