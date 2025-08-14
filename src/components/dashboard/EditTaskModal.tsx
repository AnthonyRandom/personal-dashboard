import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTask } from "@/hooks/useTasks";
import { taskUpdateSchema, type TaskUpdateData, type Task } from "@/services/taskService";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit } from "lucide-react";

interface EditTaskModalProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskModal({ task, open, onOpenChange }: EditTaskModalProps) {
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskUpdateData>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category,
      due_date: task.due_date || "",
      completed: task.completed,
      time_estimate: task.time_estimate,
      tags: task.tags,
    },
  });

  const priority = watch("priority");
  const completed = watch("completed");

  const onSubmit = async (data: TaskUpdateData) => {
    try {
      await updateTask.mutateAsync({ taskId: task.id, updates: data });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        category: task.category,
        due_date: task.due_date || "",
        completed: task.completed,
        time_estimate: task.time_estimate,
        tags: task.tags,
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Task
          </DialogTitle>
          <DialogDescription>
            Update the task details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              className="focus:ring-2 focus:ring-primary/20"
              disabled={updateTask.isPending}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive animate-slide-up">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description (optional)..."
              className="focus:ring-2 focus:ring-primary/20 min-h-[80px]"
              disabled={updateTask.isPending}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive animate-slide-up">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={priority || "medium"}
                onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
                disabled={updateTask.isPending}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive animate-slide-up">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Input
                id="category"
                placeholder="e.g., Work, Personal"
                className="focus:ring-2 focus:ring-primary/20"
                disabled={updateTask.isPending}
                {...register("category")}
              />
              {errors.category && (
                <p className="text-sm text-destructive animate-slide-up">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-medium">
                Due Date
              </Label>
              <Input
                id="due_date"
                type="date"
                className="focus:ring-2 focus:ring-primary/20"
                disabled={updateTask.isPending}
                {...register("due_date")}
              />
              {errors.due_date && (
                <p className="text-sm text-destructive animate-slide-up">
                  {errors.due_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_estimate" className="text-sm font-medium">
                Time Estimate (minutes)
              </Label>
              <Input
                id="time_estimate"
                type="number"
                placeholder="e.g., 30"
                className="focus:ring-2 focus:ring-primary/20"
                disabled={updateTask.isPending}
                {...register("time_estimate", { valueAsNumber: true })}
              />
              {errors.time_estimate && (
                <p className="text-sm text-destructive animate-slide-up">
                  {errors.time_estimate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags (comma-separated)
            </Label>
            <Input
              id="tags"
              placeholder="e.g., work, urgent, meeting"
              className="focus:ring-2 focus:ring-primary/20"
              disabled={updateTask.isPending}
              {...register("tags")}
            />
            {errors.tags && (
              <p className="text-sm text-destructive animate-slide-up">
                {errors.tags.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={completed || false}
              onCheckedChange={(checked) => setValue("completed", !!checked)}
              disabled={updateTask.isPending}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="completed" className="text-sm font-medium cursor-pointer">
              Mark as completed
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateTask.isPending}
              className="hover:bg-accent/50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateTask.isPending}
              className="hover:scale-[1.02] transition-transform"
            >
              {updateTask.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
