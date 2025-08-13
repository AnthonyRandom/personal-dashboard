import { Calendar, Clock } from "lucide-react";

const events = [
  { time: "9:00 AM", title: "Team standup", type: "meeting" },
  { time: "2:00 PM", title: "Client call", type: "call" },
  { time: "4:30 PM", title: "Design review", type: "review" },
];

export function CalendarWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Today</h3>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group hover-subtle rounded-lg p-2 -m-2"
          >
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {event.time}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">3 events today</p>
        </div>
      </div>
    </div>
  );
}
