import { Cloud, Sun, CloudRain } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function WeatherWidget() {
  return (
    <Widget
      title="Weather"
      icon={<Sun className="w-5 h-5" />}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">72°F</p>
          <p className="text-sm text-muted-foreground">Sunny</p>
        </div>
        <Sun className="w-8 h-8 text-primary" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="space-y-1 hover-subtle rounded-lg p-2 transition-colors">
          <CloudRain className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Tomorrow</p>
          <p className="text-sm font-medium">68°</p>
        </div>
        <div className="space-y-1 hover-subtle rounded-lg p-2 transition-colors">
          <Cloud className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Thu</p>
          <p className="text-sm font-medium">70°</p>
        </div>
        <div className="space-y-1 hover-subtle rounded-lg p-2 transition-colors">
          <Sun className="w-4 h-4 mx-auto text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">Fri</p>
          <p className="text-sm font-medium">75°</p>
        </div>
      </div>
    </Widget>
  );
}
