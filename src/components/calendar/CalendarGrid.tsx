import { useState, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthlyEvents, useDateHasEvents, useEventsCountForDate } from "@/hooks/useCalendarEvents";
import { type CalendarEvent, type RecurringEventInstance } from "@/services/calendarService";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths } from "date-fns";

interface CalendarGridProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onDateClick?: (date: Date, events: (CalendarEvent | RecurringEventInstance)[]) => void;
  onCreateEvent?: (date: Date) => void;
  className?: string;
}

export function CalendarGrid({ 
  selectedDate, 
  onDateSelect, 
  onDateClick,
  onCreateEvent,
  className 
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  const { data: monthlyEvents, isLoading } = useMonthlyEvents(currentMonth);
  const dateHasEvents = useDateHasEvents();
  const getEventsCount = useEventsCountForDate();

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect?.(date);
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      const eventsForDate = monthlyEvents?.filter(event => {
        // Check if event starts on this date
        if (event.date === dateStr) return true;
        
        // Check if event spans across this date
        if (event.end_date && event.end_date !== event.date) {
          const eventStart = new Date(event.date + 'T00:00:00');
          const eventEnd = new Date(event.end_date + 'T00:00:00');
          const currentDate = new Date(dateStr + 'T00:00:00');
          return currentDate >= eventStart && currentDate <= eventEnd;
        }
        
        return false;
      }) || [];
      onDateClick?.(date, eventsForDate);
    }
  };

  const handleDateDoubleClick = (date: Date) => {
    onCreateEvent?.(date);
  };

  // Track double-click state
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect?.(today);
  };

  // Custom day renderer with event indicators
  const customDayRenderer = ({ date, displayMonth }: { date: Date; displayMonth: Date }) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
    const hasEvents = dateHasEvents(date);
    const eventsCount = getEventsCount(date);
    const isSelected = selectedDate?.toDateString() === date.toDateString();

    // Get single-day events (events that start on this date)
    const dateStr = date.toISOString().split('T')[0];
    const singleDayEvents = monthlyEvents?.filter(event => event.date === dateStr) || [];

    const handleClick = (e: React.MouseEvent) => {
      if (clickTimeoutRef.current) {
        // Double click detected
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        handleDateDoubleClick(date);
      } else {
        // Single click - set timeout to detect if double click follows
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
          handleDateSelect(date);
        }, 250);
      }
    };

    return (
      <div 
        className={cn(
          "relative w-full h-full flex flex-col items-center justify-center p-1 cursor-pointer transition-all rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          isSelected && "bg-primary text-primary-foreground font-semibold",
          isToday && !isSelected && "bg-accent text-accent-foreground font-medium",
          !isCurrentMonth && "text-muted-foreground opacity-50"
        )}
        onClick={handleClick}
        title={hasEvents ? `${eventsCount} event${eventsCount > 1 ? 's' : ''}` : undefined}
      >
        <span className="text-sm">{date.getDate()}</span>
        
        {/* Event indicators - only show single-day events here */}
        {singleDayEvents.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {singleDayEvents.length <= 3 ? (
              // Show individual dots for 1-3 single-day events
              Array.from({ length: Math.min(singleDayEvents.length, 3) }).map((_, i) => (
                <div 
                  key={`single-${i}`} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} 
                />
              ))
            ) : (
              // Show count for 4+ single-day events
              <div 
                className={cn(
                  "text-xs px-1 py-0.5 rounded-full font-medium min-w-[16px] text-center",
                  isSelected 
                    ? "bg-primary-foreground text-primary" 
                    : "bg-primary text-primary-foreground"
                )}
              >
                {singleDayEvents.length}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };



  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="ml-2"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg p-4 bg-background relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="w-full"
          classNames={{
            months: "flex w-full",
            month: "space-y-4 w-full",
            caption: "hidden", // We have our own header
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-white rounded-md w-full font-bold text-sm text-center p-2",
            row: "flex w-full mt-2",
            cell: "h-12 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",
            day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            day_today: "bg-accent text-accent-foreground font-medium rounded-md",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
          components={{
            Day: ({ date, displayMonth }) => customDayRenderer({ date, displayMonth }),
          }}
        />
        {/* Multi-day events overlay */}
        <div className="absolute inset-0 pointer-events-none">

        </div>
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Click a date to view events • Double-click to create an event</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>Single-day events</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-2 bg-primary/20 border border-primary rounded-sm"></div>
            <span>Multi-day events</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-accent text-accent-foreground text-xs flex items-center justify-center">
              #
            </div>
            <span>Multiple events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
