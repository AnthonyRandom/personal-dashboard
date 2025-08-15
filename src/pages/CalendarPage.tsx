import { useState } from "react";
import { Calendar, Plus, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { EventCard } from "@/components/calendar/EventCard";
import { EventForm } from "@/components/calendar/EventForm";
import { EventDetails } from "@/components/calendar/EventDetails";
import { 
  useDailyEvents, 
  useUpcomingEvents, 
  useEventStats,
  useCalendarEventSubscription 
} from "@/hooks/useCalendarEvents";
import { useAuth } from "@/hooks/useAuth";
import { type CalendarEvent, type RecurringEventInstance } from "@/services/calendarService";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createEventDate, setCreateEventDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | RecurringEventInstance | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | RecurringEventInstance | null>(null);

  // Subscribe to real-time updates
  useCalendarEventSubscription();

  // Fetch data
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const { data: dailyEvents, isLoading: isDailyLoading } = useDailyEvents(selectedDateStr);
  const { data: upcomingEvents, isLoading: isUpcomingLoading } = useUpcomingEvents(7);
  const { data: eventStats, isLoading: isStatsLoading } = useEventStats();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDateClick = (date: Date, events: (CalendarEvent | RecurringEventInstance)[]) => {
    setSelectedDate(date);
    if (events.length === 1 && events[0]) {
      setSelectedEvent(events[0]);
      setShowEventDetails(true);
    }
  };

  const handleCreateEvent = (date?: Date) => {
    const eventDate = date || selectedDate;
    setCreateEventDate(eventDate);
    // Use setTimeout to ensure state is updated before opening form
    setTimeout(() => {
      setShowCreateForm(true);
    }, 0);
  };

  const handleEventClick = (event: CalendarEvent | RecurringEventInstance) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEditEvent = (event: CalendarEvent | RecurringEventInstance) => {
    setEditingEvent(event);
    setShowEventDetails(false);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Calendar</h2>
          <p className="text-muted-foreground">Please sign in to view your calendar</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your schedule and events
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={() => handleCreateEvent()}
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>

        {/* Stats Cards */}
        {!isStatsLoading && eventStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventStats.total}</div>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventStats.thisWeek}</div>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventStats.thisMonth}</div>
              </CardContent>
            </Card>
            
            <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventStats.upcoming}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 dashboard-widget animate-scale-in">
            <CalendarGrid
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onDateClick={handleDateClick}
              onCreateEvent={handleCreateEvent}
            />
          </div>

          {/* Selected Day's Events */}
          <div className="dashboard-widget animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">
                {format(selectedDate, 'MMM d')} Events
              </h3>
            </div>

            {isDailyLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : dailyEvents && dailyEvents.length > 0 ? (
              <div className="space-y-3">
                {dailyEvents.map((event) => (
                  <EventCard
                    key={'isRecurring' in event ? `${event.parentId}-${event.recurrenceDate}` : event.id}
                    event={event}
                    variant="compact"
                    onView={handleEventClick}
                    onEdit={handleEditEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No events this day</p>
                <p className="text-xs text-muted-foreground mt-1">Double-click on the calendar to add an event</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="dashboard-widget animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold mb-4">Upcoming This Week</h3>
          
          {isUpcomingLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.slice(0, 6).map((event) => (
                <EventCard
                  key={'isRecurring' in event ? `${event.parentId}-${event.recurrenceDate}` : event.id}
                  event={event}
                  variant="compact"
                  onView={handleEventClick}
                  onEdit={handleEditEvent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No upcoming events this week</p>
              <p className="text-sm text-muted-foreground mt-2">Use the "Add Event" button above or double-click on a calendar date</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EventForm
        key={createEventDate ? createEventDate.toISOString() : 'new-event'}
        open={showCreateForm}
        onOpenChange={(open) => {
          setShowCreateForm(open);
          if (!open) {
            setCreateEventDate(null);
          }
        }}
        defaultDate={createEventDate ? createEventDate.toISOString().split('T')[0] : undefined}
      />

      <EventForm
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        event={editingEvent ? ('isRecurring' in editingEvent ? null : editingEvent) : null}
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
