import { TrendingUp, Target, Clock } from "lucide-react";

export function ProductivityWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Productivity Insights</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">6.2h</p>
            <p className="text-xs text-muted-foreground">Focus Time</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">12/15</p>
            <p className="text-xs text-muted-foreground">Goals Met</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold">+15%</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          You're 15% more productive than last week! Keep it up! 🚀
        </p>
      </div>
    </div>
  );
}
