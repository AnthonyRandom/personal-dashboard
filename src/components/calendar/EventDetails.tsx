import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Repeat,
  Bell,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
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

interface EventDetailsProps {
  event: CalendarEvent | RecurringEventInstance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: CalendarEvent | RecurringEventInstance) => void;
}

export function EventDetails({ event, open, onOpenChange, onEdit }: EventDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteEvent = useDeleteEvent();

  if (!event) return null;

  const isRecurring = 'isRecurring' in event && event.isRecurring;
  const canEdit = !isRecurring; // For now, only allow editing base events

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
      // Create date in local timezone by adding T00:00:00 to ensure proper parsing
      const date = new Date(dateStr + 'T00:00:00');
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const getDateRangeDisplay = () => {
    if (event.end_date && event.end_date !== event.date) {
      return `${formatDateDisplay(event.date)} - ${formatDateDisplay(event.end_date!)}`;
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
      return `${formatTime(event.time)}`;
    }
    
    return 'No specific time';
  };

  const getRecurrenceDisplay = () => {
    if (!event.recurrence_type || event.recurrence_type === 'none') {
      return 'Does not repeat';
    }

    const interval = event.recurrence_interval || 1;
    const type = event.recurrence_type;
    
    let display = '';
    if (interval === 1) {
      display = `Every ${type.slice(0, -2)}`; // Remove 'ly' from 'daily', 'weekly', etc.
    } else {
      display = `Every ${interval} ${type === 'daily' ? 'days' : type === 'weekly' ? 'weeks' : type === 'monthly' ? 'months' : 'years'}`;
    }

    if (event.recurrence_end_date) {
      try {
        const endDate = new Date(event.recurrence_end_date);
        display += ` until ${format(endDate, 'MMM d, yyyy')}`;
      } catch {
        display += ` until ${event.recurrence_end_date}`;
      }
    }

    return display;
  };

  const handleDelete = async () => {
    if (isRecurring) {
      // For recurring instances, we'd need to handle this differently
      // For now, we'll just close the dialog
      setShowDeleteDialog(false);
      return;
    }
    
    try {
      await deleteEvent.mutateAsync(event.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-start justify-between gap-4">
            <DialogDescription className="sr-only">
              Event details for {event.title}
            </DialogDescription>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full ${event.color.split(' ')[0]}`} />
                  <span className="font-semibold text-lg">{event.title}</span>
                </div>
                {isRecurring && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Repeat className="w-4 h-4" />
                    <span>Recurring event instance</span>
                  </div>
                )}
              </div>
              
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(event)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Description */}
            {event.description && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Event Details */}
            <div className="space-y-3">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{getDateRangeDisplay()}</p>
                  <p className="text-sm text-muted-foreground">{getTimeDisplay()}</p>
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Category</p>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", event.color)}
                  >
                    {event.category}
                  </Badge>
                </div>
              </div>

              {/* Recurrence */}
              {(event.recurrence_type && event.recurrence_type !== 'none') && (
                <div className="flex items-start gap-3">
                  <Repeat className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Recurrence</p>
                    <p className="text-sm text-muted-foreground">
                      {getRecurrenceDisplay()}
                    </p>
                  </div>
                </div>
              )}

              {/* Reminder */}
              {event.reminder_minutes && (
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Reminder</p>
                    <p className="text-sm text-muted-foreground">
                      {event.reminder_minutes} minutes before
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            {event.created_at && (
              <>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  <p>
                    Created {format(new Date(event.created_at), 'PPp')}
                  </p>
                  {event.updated_at && event.updated_at !== event.created_at && (
                    <p>
                      Last updated {format(new Date(event.updated_at), 'PPp')}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
              {event.recurrence_type && event.recurrence_type !== 'none' && (
                <span className="block mt-2 font-medium">
                  This will delete the entire recurring series.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteEvent.isPending ? 'Deleting...' : 'Delete Event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
