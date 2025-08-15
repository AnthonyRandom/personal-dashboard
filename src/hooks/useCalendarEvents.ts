import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  calendarService, 
  type CalendarEvent, 
  type EventFormData, 
  type EventUpdateData,
  type RecurringEventInstance
} from '@/services/calendarService';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useEffect } from 'react';

export function useCalendarEvents(startDate?: Date, endDate?: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-events', user?.id, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      if (startDate && endDate) {
        return calendarService.getEventsWithRecurring(user.id, startDate, endDate);
      } else {
        return calendarService.getEvents(user.id);
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useMonthlyEvents(date: Date = new Date()) {
  const { user } = useAuth();
  const startDate = startOfWeek(startOfMonth(date));
  const endDate = endOfWeek(endOfMonth(date));

  return useQuery({
    queryKey: ['calendar-events-monthly', user?.id, date.getFullYear(), date.getMonth()],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.getEventsWithRecurring(user.id, startDate, endDate);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useDailyEvents(date: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-events-daily', user?.id, date],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      if (!date) throw new Error('Date is required');
      return calendarService.getEventsByDate(user.id, date);
    },
    enabled: !!user?.id && !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUpcomingEvents(days: number = 7) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-events-upcoming', user?.id, days],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.getUpcomingEvents(user.id, days);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useEventStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-event-stats', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.getEventStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useEventCategories() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-event-categories', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.getEventCategories(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCreateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: EventFormData) => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.createEvent(user.id, eventData);
    },
    onSuccess: (_newEvent) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['calendar-events', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-monthly', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-daily', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-upcoming', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-event-stats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-event-categories', user?.id] });
      
      toast.success('Event created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    },
  });
}

export function useUpdateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, updates }: { eventId: string; updates: EventUpdateData }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.updateEvent(eventId, user.id, updates);
    },
    onMutate: async ({ eventId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['calendar-events', user?.id] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData<(CalendarEvent | RecurringEventInstance)[]>(['calendar-events', user?.id]);

      // Optimistically update the event
      if (previousEvents) {
        queryClient.setQueryData(
          ['calendar-events', user?.id],
          previousEvents.map(event =>
            'isRecurring' in event ? event : event.id === eventId ? { ...event, ...updates } : event
          )
        );
      }

      return { previousEvents };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEvents) {
        queryClient.setQueryData(['calendar-events', user?.id], context.previousEvents);
      }
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
    },
    onSuccess: (_updatedEvent) => {
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['calendar-events-monthly', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-daily', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-upcoming', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-event-stats', user?.id] });
      
      toast.success('Event updated successfully!');
    },
  });
}

export function useDeleteEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.deleteEvent(eventId, user.id);
    },
    onMutate: async (eventId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['calendar-events', user?.id] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData<(CalendarEvent | RecurringEventInstance)[]>(['calendar-events', user?.id]);

      // Optimistically remove the event
      if (previousEvents) {
        queryClient.setQueryData(
          ['calendar-events', user?.id],
          previousEvents.filter(event => {
            // For recurring events, check if the parent ID matches
            if ('isRecurring' in event && event.isRecurring) {
              return event.parentId !== eventId;
            }
            // For regular events, check if the ID matches
            return event.id !== eventId;
          })
        );
      }

      return { previousEvents };
    },
    onError: (error, _eventId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousEvents) {
        queryClient.setQueryData(['calendar-events', user?.id], context.previousEvents);
      }
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event. Please try again.');
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['calendar-events-monthly', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-daily', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events-upcoming', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['calendar-event-stats', user?.id] });
      
      toast.success('Event deleted successfully!');
    },
  });
}

// Real-time subscription hook for calendar events
export function useCalendarEventSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const subscription = calendarService.subscribeToEvents(
      user.id,
      (payload) => {
        console.log('Calendar event change:', payload);
        
        // Invalidate relevant queries on any change
        queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
        queryClient.invalidateQueries({ queryKey: ['calendar-events-monthly'] });
        queryClient.invalidateQueries({ queryKey: ['calendar-events-daily'] });
        queryClient.invalidateQueries({ queryKey: ['calendar-events-upcoming'] });
        queryClient.invalidateQueries({ queryKey: ['calendar-event-stats'] });
        
        // Show appropriate toast based on event type
        switch (payload.eventType) {
          case 'INSERT':
            toast.success('New event added');
            break;
          case 'UPDATE':
            toast.success('Event updated');
            break;
          case 'DELETE':
            toast.success('Event deleted');
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient]);
}

// Helper function to get events for a specific date range
export function useEventsByDateRange(startDate: Date, endDate: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-events-range', user?.id, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return calendarService.getEventsWithRecurring(user.id, startDate, endDate);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Helper function to check if a date has events
export function useDateHasEvents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const monthlyEvents = queryClient.getQueryData<(CalendarEvent | RecurringEventInstance)[]>([
      'calendar-events-monthly', 
      user?.id, 
      date.getFullYear(), 
      date.getMonth()
    ]);

    if (!monthlyEvents) return false;

    return monthlyEvents.some(event => {
      // Check if event starts on this date
      if (event.date === dateStr) return true;
      
      // Check if event spans across this date (but don't double count)
      if (event.end_date && event.end_date !== event.date) {
        const eventStart = new Date(event.date + 'T00:00:00');
        const eventEnd = new Date(event.end_date + 'T00:00:00');
        const currentDate = new Date(dateStr + 'T00:00:00');
        return currentDate >= eventStart && currentDate <= eventEnd;
      }
      
      return false;
    });
  };
}

// Helper function to get events count for a specific date
export function useEventsCountForDate() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    const monthlyEvents = queryClient.getQueryData<(CalendarEvent | RecurringEventInstance)[]>([
      'calendar-events-monthly', 
      user?.id, 
      date.getFullYear(), 
      date.getMonth()
    ]);

    if (!monthlyEvents) return 0;

    // Count events that either start on this date or span across this date
    return monthlyEvents.filter(event => {
      // Check if event starts on this date
      if (event.date === dateStr) return true;
      
      // Check if event spans across this date (but don't double count)
      if (event.end_date && event.end_date !== event.date) {
        const eventStart = new Date(event.date + 'T00:00:00');
        const eventEnd = new Date(event.end_date + 'T00:00:00');
        const currentDate = new Date(dateStr + 'T00:00:00');
        return currentDate >= eventStart && currentDate <= eventEnd;
      }
      
      return false;
    }).length;
  };
}
