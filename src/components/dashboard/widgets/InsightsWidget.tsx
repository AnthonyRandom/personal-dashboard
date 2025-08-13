import { Sparkles, Brain } from "lucide-react";

export function InsightsWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">Peak Performance</p>
            <p className="text-xs text-muted-foreground">
              Your most productive hours are 9-11 AM
            </p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            AI suggests scheduling important tasks during morning hours
          </p>
        </div>
      </div>
    </div>
  );
}