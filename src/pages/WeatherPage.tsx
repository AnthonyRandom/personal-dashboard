import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Thermometer } from "lucide-react";

export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
        <p className="text-muted-foreground">Current conditions and forecast</p>
      </div>

      {/* Current Weather */}
      <div className="dashboard-widget">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">San Francisco, CA</h2>
            <p className="text-muted-foreground">Today, January 15</p>
          </div>
          <Sun className="w-12 h-12 text-yellow-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-6xl font-light">72°F</p>
            <p className="text-xl text-muted-foreground">Sunny</p>
            <p className="text-sm text-muted-foreground mt-2">Feels like 75°F</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Wind</span>
              </div>
              <p className="text-lg font-semibold">8 mph</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Humidity</span>
              </div>
              <p className="text-lg font-semibold">65%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Visibility</span>
              </div>
              <p className="text-lg font-semibold">10 mi</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">UV Index</span>
              </div>
              <p className="text-lg font-semibold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
        <div className="space-y-3">
          {[
            { day: "Today", icon: Sun, high: 72, low: 58, condition: "Sunny" },
            { day: "Tomorrow", icon: CloudRain, high: 68, low: 54, condition: "Light Rain" },
            { day: "Thursday", icon: Cloud, high: 70, low: 56, condition: "Cloudy" },
            { day: "Friday", icon: Sun, high: 75, low: 60, condition: "Sunny" },
            { day: "Saturday", icon: CloudRain, high: 65, low: 52, condition: "Showers" },
            { day: "Sunday", icon: Sun, high: 73, low: 59, condition: "Partly Sunny" },
            { day: "Monday", icon: Cloud, high: 69, low: 55, condition: "Overcast" },
          ].map((forecast, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <forecast.icon className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">{forecast.day}</p>
                  <p className="text-sm text-muted-foreground">{forecast.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{forecast.high}°</p>
                <p className="text-sm text-muted-foreground">{forecast.low}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { time: "Now", temp: 72, icon: Sun },
            { time: "1 PM", temp: 74, icon: Sun },
            { time: "2 PM", temp: 75, icon: Sun },
            { time: "3 PM", temp: 76, icon: Cloud },
            { time: "4 PM", temp: 74, icon: Cloud },
            { time: "5 PM", temp: 72, icon: CloudRain },
          ].map((hour, index) => (
            <div key={index} className="flex flex-col items-center min-w-0 space-y-2 p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium whitespace-nowrap">{hour.time}</p>
              <hour.icon className="w-6 h-6 text-muted-foreground" />
              <p className="text-sm font-semibold">{hour.temp}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}