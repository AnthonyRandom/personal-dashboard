import { useState } from "react";
import { Calendar, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/ui/widget";
import { useUpcomingEvents } from "@/hooks/useCalendarEvents";
import { useAuth } from "@/hooks/useAuth";
import { EventCard } from "@/components/calendar/EventCard";
import { EventForm } from "@/components/calendar/EventForm";
import { EventDetails } from "@/components/calendar/EventDetails";
import { type CalendarEvent, type RecurringEventInstance } from "@/services/calendarService";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export function CalendarWidget() {
  const { user } = useAuth();
  const { data: upcomingEvents, isLoading, error } = useUpcomingEvents(7);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | RecurringEventInstance | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | RecurringEventInstance | null>(null);

  const handleEventClick = (event: CalendarEvent | RecurringEventInstance) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEditEvent = (event: CalendarEvent | RecurringEventInstance) => {
    setEditingEvent(event);
    setShowEventDetails(false);
  };

  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  if (error) {
    return (
      <Widget
        title="Calendar"
        icon={<Calendar className="w-5 h-5" />}
        variant="default"
        className="animate-scale-in"
      >
        <div className="text-center py-8">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load events</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Widget>
    );
  }

  if (!user) {
    return (
      <Widget
        title="Calendar"
        icon={<Calendar className="w-5 h-5" />}
        variant="default"
        className="animate-scale-in"
      >
        <div className="text-center py-8">
          <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Please sign in to view your calendar</p>
        </div>
      </Widget>
    );
  }

  return (
    <>
      <Widget
        title="Upcoming Events"
        icon={<Calendar className="w-5 h-5" />}
        variant="default"
        className="animate-scale-in"
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateEvent}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to="/calendar" className="gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard
                key={'isRecurring' in event ? `${event.parentId}-${event.recurrenceDate}` : event.id}
                event={event}
                variant="compact"
                onView={handleEventClick}
                onEdit={handleEditEvent}
              />
            ))}
            
            {upcomingEvents.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground">
                    +{upcomingEvents.length - 3} more events
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">No upcoming events</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateEvent}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create your first event
            </Button>
          </div>
        )}
      </Widget>

      <EventForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        defaultDate={format(new Date(), 'yyyy-MM-dd')}
      />

      <EventForm
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        event={editingEvent ? 'isRecurring' in editingEvent ? null : editingEvent : null}
      />

      <EventDetails
        event={selectedEvent}
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        onEdit={handleEditEvent}
      />
    </>
  );
}