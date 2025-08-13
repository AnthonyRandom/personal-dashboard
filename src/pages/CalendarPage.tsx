import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const events = [
    {
      id: 1,
      time: "9:00 AM",
      title: "Team standup",
      type: "meeting",
      color: "bg-blue-100 border-blue-200",
    },
    {
      id: 2,
      time: "11:30 AM",
      title: "Project review",
      type: "review",
      color: "bg-green-100 border-green-200",
    },
    {
      id: 3,
      time: "2:00 PM",
      title: "Client call",
      type: "call",
      color: "bg-purple-100 border-purple-200",
    },
    {
      id: 4,
      time: "4:30 PM",
      title: "Design review",
      type: "review",
      color: "bg-orange-100 border-orange-200",
    },
    {
      id: 5,
      time: "6:00 PM",
      title: "Gym workout",
      type: "personal",
      color: "bg-red-100 border-red-200",
    },
  ];

  // Generate calendar days (simplified)
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and events
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 dashboard-widget">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{currentMonth}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                const isCurrentMonth = date.getMonth() === today.getMonth();

                return (
                  <div
                    key={index}
                    className={`p-2 text-center text-sm cursor-pointer rounded-lg transition-colors hover:bg-accent ${
                      isToday
                        ? "bg-primary text-primary-foreground font-semibold"
                        : isCurrentMonth
                          ? "text-foreground hover:bg-accent"
                          : "text-muted-foreground"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Events */}
        <div className="dashboard-widget">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Today's Events</h3>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${event.color} hover-subtle cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No events today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Upcoming This Week</h3>
        <div className="space-y-3">
          {[
            {
              day: "Tomorrow",
              events: 3,
              preview: "Morning standup, Client presentation...",
            },
            {
              day: "Wednesday",
              events: 2,
              preview: "Team lunch, Code review...",
            },
            {
              day: "Thursday",
              events: 4,
              preview: "Workshop, Design meeting...",
            },
            { day: "Friday", events: 1, preview: "Weekly retrospective" },
          ].map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium">{day.day}</p>
                <p className="text-sm text-muted-foreground">{day.preview}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{day.events} events</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
