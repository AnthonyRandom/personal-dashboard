import { Calendar, Clock } from "lucide-react";
import { Widget } from "@/components/ui/widget";

const events = [
  { time: "9:00 AM", title: "Team standup", type: "meeting" },
  { time: "2:00 PM", title: "Client call", type: "call" },
  { time: "4:30 PM", title: "Design review", type: "review" },
];

export function CalendarWidget() {
  return (
    <Widget
      title="Today"
      icon={<Calendar className="w-5 h-5" />}
      footer={<p className="text-xs text-muted-foreground">3 events today</p>}
    >
      {events.map((event, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover-subtle rounded-lg p-2 -m-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          role="button"
          tabIndex={0}
          aria-label={`Event: ${event.title} at ${event.time}`}
        >
          <div className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{event.title}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {event.time}
            </div>
          </div>
        </div>
      ))}
    </Widget>
  );
}
