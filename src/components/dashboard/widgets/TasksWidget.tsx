import { useState } from "react";
import { CheckSquare, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Widget } from "@/components/ui/widget";
import { useTasks, useToggleTask, useTaskStats } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { CreateTaskModal } from "../CreateTaskModal";

export function TasksWidget() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: tasks = [], isLoading, error } = useTasks('all');
  const { data: stats } = useTaskStats();
  const toggleTask = useToggleTask();

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  // Show loading state if not authenticated
  if (!user) {
    return (
      <Widget
        title="Tasks"
        icon={<CheckSquare className="w-5 h-5" />}
        footer={
          <p className="text-xs text-muted-foreground">
            Sign in to view your tasks
          </p>
        }
      >
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Please sign in to manage tasks</p>
        </div>
      </Widget>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Widget
        title="Tasks"
        icon={<CheckSquare className="w-5 h-5" />}
        footer={
          <p className="text-xs text-muted-foreground">
            Loading tasks...
          </p>
        }
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Widget>
    );
  }

  // Show error state
  if (error) {
    return (
      <Widget
        title="Tasks"
        icon={<CheckSquare className="w-5 h-5" />}
        footer={
          <p className="text-xs text-destructive">
            Failed to load tasks
          </p>
        }
      >
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Failed to load tasks</p>
        </div>
      </Widget>
    );
  }

  const displayTasks = tasks.slice(0, 3);
  const pendingCount = stats?.pending ?? tasks.filter(t => !t.completed).length;
  const totalCount = stats?.total ?? tasks.length;

  return (
    <>
      <Widget
        title="Tasks"
        icon={<CheckSquare className="w-5 h-5" />}
        actions={
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-accent/50 focus:ring-2 focus:ring-primary/20"
            aria-label="Add new task"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        }
        footer={
          <p className="text-xs text-muted-foreground">
            {pendingCount} of {totalCount} remaining
          </p>
        }
      >
        {displayTasks.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs text-muted-foreground">Create your first task to get started</p>
            </div>
          </div>
        ) : (
          displayTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-2 group">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
                disabled={toggleTask.isPending}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
              />
              <span
                className={`text-sm flex-1 transition-all ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {task.title}
              </span>
            </div>
          ))
        )}
      </Widget>

      <CreateTaskModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
