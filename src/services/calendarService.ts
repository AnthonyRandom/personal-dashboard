import { supabase, type Database } from './supabase';
import { z } from 'zod';
import { addDays, addWeeks, addMonths, addYears, isBefore, startOfDay, endOfDay } from 'date-fns';

export type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
export type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert'];
export type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update'];

// Validation schemas
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  date: z.string().min(1, 'Date is required'),
  end_date: z.string().optional(),
  time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
  color: z.string().default('bg-blue-100 border-blue-200'),
  category: z.string().max(50, 'Category must be less than 50 characters').default('Personal'),
  recurrence_type: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']).default('none'),
  recurrence_interval: z.number().min(1).default(1),
  recurrence_end_date: z.string().optional(),
  recurrence_count: z.number().min(1).optional(),
  all_day: z.boolean().default(false),
  reminder_minutes: z.union([z.number().min(0), z.string().transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  })]).optional(),
});

export const eventUpdateSchema = eventSchema.partial();

export type EventFormData = z.infer<typeof eventSchema>;
export type EventUpdateData = z.infer<typeof eventUpdateSchema>;

// Recurring event generation interface
export interface RecurringEventInstance {
  id: string;
  parentId: string;
  title: string;
  description?: string | undefined;
  date: string;
  end_date?: string | undefined;
  time?: string | undefined;
  end_time?: string | undefined;
  location?: string | undefined;
  color: string;
  category: string;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_interval: number;
  recurrence_end_date?: string | undefined;
  recurrence_count?: number | undefined;
  all_day: boolean;
  reminder_minutes?: number | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
  isRecurring: true;
  recurrenceDate: string;
}

// Event categories with colors
export const EVENT_CATEGORIES = {
  Personal: 'bg-blue-100 border-blue-200 text-blue-800',
  Work: 'bg-purple-100 border-purple-200 text-purple-800',
  Health: 'bg-green-100 border-green-200 text-green-800',
  Social: 'bg-pink-100 border-pink-200 text-pink-800',
  Travel: 'bg-orange-100 border-orange-200 text-orange-800',
  Education: 'bg-indigo-100 border-indigo-200 text-indigo-800',
  Finance: 'bg-yellow-100 border-yellow-200 text-yellow-800',
  Other: 'bg-gray-100 border-gray-200 text-gray-800',
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORIES;

// Utility function to generate recurring event instances
export function generateRecurringEvents(
  event: CalendarEvent,
  startDate: Date,
  endDate: Date
): RecurringEventInstance[] {
  if (event.recurrence_type === 'none') return [];

  const instances: RecurringEventInstance[] = [];
  const eventStartDate = new Date(event.date);
  let currentDate = new Date(Math.max(eventStartDate.getTime(), startDate.getTime()));
  
  // Calculate end date for recurrence
  let recurEndDate = endDate;
  if (event.recurrence_end_date) {
    recurEndDate = new Date(Math.min(new Date(event.recurrence_end_date).getTime(), endDate.getTime()));
  }

  let count = 0;
  const maxCount = event.recurrence_count || 100; // Prevent infinite loops

  while (isBefore(currentDate, recurEndDate) && count < maxCount) {
    // Skip the original event date to avoid duplicates
    if (currentDate.getTime() !== eventStartDate.getTime()) {
      instances.push({
        id: `${event.id}-${currentDate.toISOString().split('T')[0]}`,
        parentId: event.id,
        title: event.title,
        description: event.description,
        date: currentDate.toISOString().split('T')[0]!,
        end_date: event.end_date,
        time: event.time,
        end_time: event.end_time,
        location: event.location,
        color: event.color,
        category: event.category,
        recurrence_type: event.recurrence_type,
        recurrence_interval: event.recurrence_interval,
        recurrence_end_date: event.recurrence_end_date,
        recurrence_count: event.recurrence_count,
        all_day: event.all_day,
        reminder_minutes: event.reminder_minutes,
        created_at: event.created_at,
        updated_at: event.updated_at,
        isRecurring: true,
        recurrenceDate: currentDate.toISOString().split('T')[0]!,
      });
    }

    // Move to next occurrence
    switch (event.recurrence_type) {
      case 'daily':
        currentDate = addDays(currentDate, event.recurrence_interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, event.recurrence_interval);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, event.recurrence_interval);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, event.recurrence_interval);
        break;
    }

    count++;
  }

  return instances;
}

// Enhanced event interface that includes recurring instances
export interface EnhancedCalendarEvent extends CalendarEvent {
  isRecurring?: boolean;
  recurrenceDate?: string;
}

class CalendarService {
  async getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId);

    // Filter by date range if provided
    if (startDate && endDate) {
      const startDateStr = startOfDay(startDate).toISOString().split('T')[0];
      const endDateStr = endOfDay(endDate).toISOString().split('T')[0];
      query = query.gte('date', startDateStr).lte('date', endDateStr);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getEventsWithRecurring(userId: string, startDate: Date, endDate: Date): Promise<(CalendarEvent | RecurringEventInstance)[]> {
    // Get all events that could have instances in the date range
    const expandedStartDate = addYears(startDate, -1); // Look back to catch recurring events
    const { data: allEvents, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .gte('date', expandedStartDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    const events: (CalendarEvent | RecurringEventInstance)[] = [];
    const startDateStr = startOfDay(startDate).toISOString().split('T')[0]!;
    const endDateStr = endOfDay(endDate).toISOString().split('T')[0]!;

    for (const event of allEvents || []) {
      // Add the original event if it's in range
      if (event.date >= startDateStr && event.date <= endDateStr) {
        events.push(event);
      }

      // Add recurring instances
      const recurringInstances = generateRecurringEvents(event, startDate, endDate);
      events.push(...recurringInstances);
    }

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getEventsByDate(userId: string, date: string): Promise<(CalendarEvent | RecurringEventInstance)[]> {
    const targetDate = new Date(date);
    const nextDay = addDays(targetDate, 1);
    
    return this.getEventsWithRecurring(userId, targetDate, nextDay);
  }

  async createEvent(userId: string, eventData: EventFormData): Promise<CalendarEvent> {
    const validatedData = eventSchema.parse(eventData);
    
    // Clean up empty string values for database insertion
    const cleanedData = {
      ...validatedData,
      time: validatedData.time || null,
      end_time: validatedData.end_time || null,
      end_date: validatedData.end_date || null,
      location: validatedData.location || null,
      description: validatedData.description || null,
      recurrence_end_date: validatedData.recurrence_end_date || null,
      reminder_minutes: validatedData.reminder_minutes || null,
      user_id: userId,
    };
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(cleanedData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEvent(eventId: string, userId: string, updates: EventUpdateData): Promise<CalendarEvent> {
    const validatedData = eventUpdateSchema.parse(updates);
    
    // Clean up empty string values for database update
    const cleanedData: any = {
      updated_at: new Date().toISOString(),
    };
    
    // Only add fields that are being updated, converting empty strings to null
    Object.keys(validatedData).forEach(key => {
      const value = (validatedData as any)[key];
      if (value !== undefined) {
        if (key === 'time' || key === 'end_time' || key === 'end_date' || 
            key === 'location' || key === 'description' || key === 'recurrence_end_date' ||
            key === 'reminder_minutes') {
          cleanedData[key] = value || null;
        } else {
          cleanedData[key] = value;
        }
      }
    });
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(cleanedData)
      .eq('id', eventId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getEventCategories(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('category')
      .eq('user_id', userId)
      .not('category', 'is', null);

    if (error) throw error;
    
    const categories = data
      .map(event => event.category)
      .filter((category, index, arr) => arr.indexOf(category) === index)
      .filter(Boolean);
    
    return categories;
  }

  async getUpcomingEvents(userId: string, days: number = 7): Promise<(CalendarEvent | RecurringEventInstance)[]> {
    const today = new Date();
    const futureDate = addDays(today, days);
    
    return this.getEventsWithRecurring(userId, today, futureDate);
  }

  async getEventStats(userId: string): Promise<{
    total: number;
    thisWeek: number;
    thisMonth: number;
    upcoming: number;
    categories: Record<string, number>;
  }> {
    const today = new Date();
    const weekEnd = addDays(today, 7);
    const monthEnd = addMonths(today, 1);

    const [allEvents, weekEvents, monthEvents] = await Promise.all([
      this.getEvents(userId),
      this.getEventsWithRecurring(userId, today, weekEnd),
      this.getEventsWithRecurring(userId, today, monthEnd),
    ]);

    const categories: Record<string, number> = {};
    for (const event of allEvents) {
      const category = event.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    }

    return {
      total: allEvents.length,
      thisWeek: weekEvents.length,
      thisMonth: monthEvents.length,
      upcoming: weekEvents.filter(event => event.date >= today.toISOString().split('T')[0]!).length,
      categories,
    };
  }

  // Real-time subscription for calendar events
  subscribeToEvents(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('calendar_events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}

export const calendarService = new CalendarService();
