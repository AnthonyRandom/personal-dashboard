import { Sparkles, Brain, TrendingUp, Target } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground">Personalized recommendations powered by AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Peak Performance</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Your most productive hours are 9-11 AM. You complete 40% more tasks during this window.
          </p>
          <div className="text-xs text-blue-600 font-medium">
            💡 Schedule important work during these hours
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Goal Optimization</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            You're consistently exceeding daily targets by 15%. Consider increasing goals for optimal challenge.
          </p>
          <div className="text-xs text-green-600 font-medium">
            📈 Recommended: Increase by 20%
          </div>
        </div>
      </div>
    </div>
  );
}