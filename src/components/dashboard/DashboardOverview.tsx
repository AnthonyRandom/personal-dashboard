import { DraggableDashboard } from "./DraggableDashboard";

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

      {/* Draggable Dashboard */}
      <DraggableDashboard />
    </div>
  );
}
