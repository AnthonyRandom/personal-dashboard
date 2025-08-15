import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useCalendarEvents";
import { eventSchema, type EventFormData, type CalendarEvent, EVENT_CATEGORIES } from "@/services/calendarService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar, Clock, MapPin, Repeat, Bell } from "lucide-react";
import { format } from "date-fns";

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultDate?: string | undefined;
}

export function EventForm({ open, onOpenChange, event, defaultDate }: EventFormProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date || defaultDate || format(new Date(), 'yyyy-MM-dd'),
      end_date: event?.end_date || "",
      time: event?.time || "",
      end_time: event?.end_time || "",
      location: event?.location || "",
      color: event?.color || EVENT_CATEGORIES.Personal,
      category: event?.category || "Personal",
      recurrence_type: event?.recurrence_type || "none",
      recurrence_interval: event?.recurrence_interval || 1,
      recurrence_end_date: event?.recurrence_end_date || "",
      recurrence_count: event?.recurrence_count || undefined,
      all_day: event?.all_day || false,
      reminder_minutes: event?.reminder_minutes || undefined,
    },
  });

  const allDay = watch("all_day");
  const recurrenceType = watch("recurrence_type");
  const category = watch("category");

  const onSubmit = async (data: EventFormData) => {
    try {
      if (isEditing && event) {
        await updateEvent.mutateAsync({ eventId: event.id, updates: data });
      } else {
        await createEvent.mutateAsync(data);
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} event:`, error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  const isLoading = createEvent.isPending || updateEvent.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the event details below.' 
              : 'Fill in the details for your new calendar event.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              {...register("title")}
              disabled={isLoading}
              className="focus-ring"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add event description..."
              rows={3}
              {...register("description")}
              disabled={isLoading}
              className="focus-ring resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Start Date *
              </Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                disabled={isLoading}
                className="focus-ring"
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
                disabled={isLoading}
                className="focus-ring"
              />
              {errors.end_date && (
                <p className="text-sm text-destructive">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="all_day" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                All Day Event
              </Label>
              <Switch
                id="all_day"
                checked={allDay}
                onCheckedChange={(checked) => setValue("all_day", checked)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Time inputs (hidden when all day is enabled) */}
          {!allDay && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time")}
                  disabled={isLoading}
                  className="focus-ring"
                  defaultValue={event?.time || ""}
                />
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  {...register("end_time")}
                  disabled={isLoading}
                  className="focus-ring"
                  defaultValue={event?.end_time || ""}
                />
                {errors.end_time && (
                  <p className="text-sm text-destructive">{errors.end_time.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Add location..."
              {...register("location")}
              disabled={isLoading}
              className="focus-ring"
            />
          </div>

          {/* Category and Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setValue("category", value);
                  setValue("color", EVENT_CATEGORIES[value as keyof typeof EVENT_CATEGORIES]);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_CATEGORIES).map(([key, colorClass]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colorClass.split(' ')[0]}`} />
                        {key}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder_minutes" className="flex items-center gap-1">
                <Bell className="w-4 h-4" />
                Reminder (optional)
              </Label>
              <Input
                id="reminder_minutes"
                type="number"
                min="0"
                placeholder="Enter minutes before event"
                {...register("reminder_minutes", { 
                  setValueAs: (value) => {
                    if (value === "" || value === null || value === undefined) {
                      return undefined;
                    }
                    const num = Number(value);
                    return isNaN(num) ? undefined : num;
                  }
                })}
                disabled={isLoading}
                className="focus-ring"
              />
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <Repeat className="w-4 h-4" />
              <Label htmlFor="recurrence_type">Recurrence</Label>
            </div>
            
            <Select
              value={recurrenceType}
              onValueChange={(value) => setValue("recurrence_type", value as any)}
              disabled={isLoading}
            >
              <SelectTrigger className="focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            {recurrenceType !== "none" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recurrence_interval">
                    Repeat every
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="recurrence_interval"
                      type="number"
                      min="1"
                      {...register("recurrence_interval", { valueAsNumber: true })}
                      disabled={isLoading}
                      className="focus-ring w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      {recurrenceType === "daily" && "day(s)"}
                      {recurrenceType === "weekly" && "week(s)"}
                      {recurrenceType === "monthly" && "month(s)"}
                      {recurrenceType === "yearly" && "year(s)"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurrence_end_date">End Date</Label>
                  <Input
                    id="recurrence_end_date"
                    type="date"
                    {...register("recurrence_end_date")}
                    disabled={isLoading}
                    className="focus-ring"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
