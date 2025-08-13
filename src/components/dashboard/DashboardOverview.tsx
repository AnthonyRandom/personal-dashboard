import { TasksWidget } from "./widgets/TasksWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { NewsWidget } from "./widgets/NewsWidget";
import { HealthWidget } from "./widgets/HealthWidget";
import { ProductivityWidget } from "./widgets/ProductivityWidget";
import { FinanceWidget } from "./widgets/FinanceWidget";
import { MoodWidget } from "./widgets/MoodWidget";
import { InsightsWidget } from "./widgets/InsightsWidget";
import { SocialWidget } from "./widgets/SocialWidget";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, Alex
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your day
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animation">
        <div style={{ "--stagger-delay": "1" } as React.CSSProperties}>
          <TasksWidget />
        </div>

        <div style={{ "--stagger-delay": "2" } as React.CSSProperties}>
          <WeatherWidget />
        </div>

        <div style={{ "--stagger-delay": "3" } as React.CSSProperties}>
          <CalendarWidget />
        </div>

        <div style={{ "--stagger-delay": "4" } as React.CSSProperties}>
          <HealthWidget />
        </div>

        <div
          style={{ "--stagger-delay": "5" } as React.CSSProperties}
          className="md:col-span-2"
        >
          <ProductivityWidget />
        </div>

        <div style={{ "--stagger-delay": "6" } as React.CSSProperties}>
          <FinanceWidget />
        </div>

        <div style={{ "--stagger-delay": "7" } as React.CSSProperties}>
          <MoodWidget />
        </div>

        <div
          style={{ "--stagger-delay": "8" } as React.CSSProperties}
          className="md:col-span-2 lg:col-span-3"
        >
          <NewsWidget />
        </div>

        <div style={{ "--stagger-delay": "9" } as React.CSSProperties}>
          <InsightsWidget />
        </div>

        <div
          style={{ "--stagger-delay": "10" } as React.CSSProperties}
          className="md:col-span-2"
        >
          <SocialWidget />
        </div>
      </div>
    </div>
  );
}
