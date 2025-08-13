import { Heart, Activity, Target } from "lucide-react";

export function HealthWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Health</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Steps</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">8,547</p>
            <p className="text-xs text-muted-foreground">of 10,000</p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: "85%" }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">7h 23m</p>
            <p className="text-xs text-muted-foreground">Sleep</p>
          </div>
          <div>
            <p className="text-lg font-semibold">1.2L</p>
            <p className="text-xs text-muted-foreground">Water</p>
          </div>
        </div>
      </div>
    </div>
  );
}
