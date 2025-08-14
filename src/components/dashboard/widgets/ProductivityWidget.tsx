import { TrendingUp, Target, Clock } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function ProductivityWidget() {
  return (
    <Widget
      title="Productivity Insights"
      icon={<TrendingUp className="w-5 h-5" />}
      footer={
        <p className="text-sm text-muted-foreground">
          You're 15% more productive than last week! Keep it up! 🚀
        </p>
      }
    >
      <div className="grid grid-cols-3 gap-4 md:gap-6 xl:gap-8 items-start content-start min-h-0">
        <div className="text-center space-y-2 rounded-lg p-2 transition-all">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 md:w-7 md:h-7 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-bold leading-tight">6.2h</p>
            <p className="text-xs text-muted-foreground">Focus Time</p>
          </div>
        </div>

        <div className="text-center space-y-2 rounded-lg p-2 transition-all">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <Target className="w-6 h-6 md:w-7 md:h-7 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-bold leading-tight">12/15</p>
            <p className="text-xs text-muted-foreground">Goals Met</p>
          </div>
        </div>

        <div className="text-center space-y-2 rounded-lg p-2 transition-all">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg md:text-xl font-bold leading-tight">+15%</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
      </div>
    </Widget>
  );
}
