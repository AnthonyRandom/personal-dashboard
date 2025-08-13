import { Heart, Activity } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function HealthWidget() {
  return (
    <Widget
      title="Health"
      icon={<Heart className="w-5 h-5" />}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">Steps</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">8,547</p>
          <p className="text-xs text-muted-foreground">of 10,000</p>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100} aria-label="Steps progress: 85%">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: "85%" }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="hover-subtle rounded-lg p-2 transition-colors">
          <p className="text-lg font-semibold">7h 23m</p>
          <p className="text-xs text-muted-foreground">Sleep</p>
        </div>
        <div className="hover-subtle rounded-lg p-2 transition-colors">
          <p className="text-lg font-semibold">1.2L</p>
          <p className="text-xs text-muted-foreground">Water</p>
        </div>
      </div>
    </Widget>
  );
}
