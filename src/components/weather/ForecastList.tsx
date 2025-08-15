import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import { type ForecastDay } from "@/services/weatherApi";
import { format } from "date-fns";

interface ForecastListProps {
  forecast: ForecastDay[];
}

export function ForecastList({ forecast }: ForecastListProps) {
  const getDayLabel = (dateString: string, index: number) => {
    const date = new Date(dateString);
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    return format(date, "EEEE");
  };

  return (
    <Card className="dashboard-widget animate-scale-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">5-Day Forecast</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {forecast.slice(0, 5).map((day, index) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <WeatherIcon 
                  conditionCode={day.conditionCode} 
                  size={24} 
                  className="text-muted-foreground"
                />
                <div>
                  <p className="font-medium">{getDayLabel(day.date, index)}</p>
                  <p className="text-sm text-muted-foreground">
                    {day.condition}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {day.humidity}% humidity
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {day.windSpeed} mph wind
                    </span>
                    {day.precipitation > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {day.precipitation}% rain
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{day.high}°</p>
                <p className="text-sm text-muted-foreground">{day.low}°</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
