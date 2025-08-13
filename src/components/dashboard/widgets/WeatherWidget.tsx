import { Cloud, Sun, CloudRain } from "lucide-react";

export function WeatherWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Weather</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">72°F</p>
            <p className="text-sm text-muted-foreground">Sunny</p>
          </div>
          <Sun className="w-8 h-8 text-primary" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <CloudRain className="w-4 h-4 mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Tomorrow</p>
            <p className="text-sm font-medium">68°</p>
          </div>
          <div className="space-y-1">
            <Cloud className="w-4 h-4 mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Thu</p>
            <p className="text-sm font-medium">70°</p>
          </div>
          <div className="space-y-1">
            <Sun className="w-4 h-4 mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Fri</p>
            <p className="text-sm font-medium">75°</p>
          </div>
        </div>
      </div>
    </div>
  );
}
