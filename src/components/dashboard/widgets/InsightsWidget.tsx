import { Sparkles, Brain } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function InsightsWidget() {
  return (
    <Widget
      title="AI Insights"
      icon={<Sparkles className="w-5 h-5" />}
      footer={
        <p className="text-xs text-muted-foreground">
          AI suggests scheduling important tasks during morning hours
        </p>
      }
    >
      <div className="flex items-start gap-3 hover-subtle rounded-lg p-2 -m-2 transition-colors">
        <Brain className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium">Peak Performance</p>
          <p className="text-xs text-muted-foreground">
            Your most productive hours are 9-11 AM
          </p>
        </div>
      </div>
    </Widget>
  );
}
