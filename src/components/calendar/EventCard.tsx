import { useState } from "react";
import { Calendar, Clock, MapPin, Repeat, Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type CalendarEvent, type RecurringEventInstance } from "@/services/calendarService";
import { useDeleteEvent } from "@/hooks/useCalendarEvents";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent | RecurringEventInstance;
  onEdit?: (event: CalendarEvent | RecurringEventInstance) => void;
  onView?: (event: CalendarEvent | RecurringEventInstance) => void;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export function EventCard({ 
  event, 
  onEdit, 
  onView, 
  variant = "default",
  className 
}: EventCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteEvent = useDeleteEvent();

  const isRecurring = 'isRecurring' in event && event.isRecurring;
  const canEdit = !isRecurring; // For now, only allow editing base events, not recurring instances

  const handleDelete = async () => {
    if (isRecurring) {
      // For recurring instances, we can't delete individual instances
      // Only the base recurring event can be deleted (which deletes the entire series)
      console.error('Cannot delete individual recurring event instances');
      return;
    }
    
    try {
      await deleteEvent.mutateAsync(event.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      if (!hours || !minutes) return time;
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return time;
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM d');
    } catch {
      return dateStr;
    }
  };

  const getDateRangeDisplay = () => {
    if (event.end_date && event.end_date !== event.date) {
      const startDate = formatDateDisplay(event.date);
      const endDate = formatDateDisplay(event.end_date!);
      return `${startDate} - ${endDate}`;
    }
    return formatDateDisplay(event.date);
  };

  const getTimeDisplay = () => {
    if (event.all_day) {
      return 'All day';
    }
    
    if (event.time && event.end_time) {
      return `${formatTime(event.time)} - ${formatTime(event.end_time)}`;
    }
    
    if (event.time) {
      return formatTime(event.time);
    }
    
    return '';
  };

  if (variant === "minimal") {
    return (
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-md border text-sm hover-subtle cursor-pointer",
          event.color,
          className
        )}
        onClick={() => onView?.(event)}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{event.title}</p>
          {getTimeDisplay() && (
            <p className="text-xs text-muted-foreground">{getTimeDisplay()}</p>
          )}
        </div>
        {isRecurring && <Repeat className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <Card className={cn("hover-subtle transition-all", className)}>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${event.color.split(' ')[0]}`} />
                  <h4 className="font-medium text-sm truncate">{event.title}</h4>
                  {isRecurring && <Repeat className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                </div>
                
                <div className="space-y-1">
                  {getTimeDisplay() && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {getTimeDisplay()}
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(event)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(event)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                {event.recurrence_type && event.recurrence_type !== 'none' ? (
                  <>
                    Are you sure you want to delete "{event.title}"? This will delete the entire recurring series.
                    <br />
                    <span className="text-sm text-muted-foreground mt-1 block">
                      This action cannot be undone.
                    </span>
                  </>
                ) : (
                  `Are you sure you want to delete "${event.title}"? This action cannot be undone.`
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Card className={cn("hover-lift transition-all", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full ${event.color.split(' ')[0]}`} />
              <h3 className="font-semibold truncate">{event.title}</h3>
              {isRecurring && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Repeat className="w-3 h-3" />
                  <span>Recurring</span>
                </div>
              )}
            </div>
            
            {event.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{getDateRangeDisplay()}</span>
                {getTimeDisplay() && (
                  <>
                    <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                    <span>{getTimeDisplay()}</span>
                  </>
                )}
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  event.color
                )}>
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          {canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(event)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(event)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
