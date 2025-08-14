import { useState, useEffect } from "react";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { Task, TaskUpdateData } from "@/services/taskService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Calendar, 
  Tag, 
  CheckCircle, 
  Circle,
  AlertTriangle,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskKanbanBoardProps {
  className?: string;
}

type KanbanColumn = {
  id: string;
  title: string;
  filter: (task: Task) => boolean;
  color: string;
};

export function TaskKanbanBoard({ className }: TaskKanbanBoardProps) {
  const { data: tasks = [], isLoading } = useTasks('all');
  const updateTask = useUpdateTask();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      filter: (task) => {
        if (task.completed) return false;
        if (!task.due_date) return true;
        return task.due_date > new Date().toISOString().split('T')[0]!;
      },
      color: 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
    },
    {
      id: 'overdue',
      title: 'Overdue',
      filter: (task) => !task.completed && !!task.due_date && task.due_date < new Date().toISOString().split('T')[0]!,
      color: 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
    },
    {
      id: 'completed',
      title: 'Done',
      filter: (task) => task.completed,
      color: 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
    }
  ];

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: KanbanColumn) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    let updates: TaskUpdateData = {};

    // Determine what to update based on target column
    switch (targetColumn.id) {
      case 'todo':
        updates = { completed: false };
        // Remove due_date if it's overdue
        if (draggedTask.due_date && draggedTask.due_date < new Date().toISOString().split('T')[0]!) {
          updates.due_date = undefined;
        }
        break;
      case 'overdue':
        // Keep as is, just move to overdue column
        break;
      case 'completed':
        updates = { completed: true };
        break;
    }

    try {
      await updateTask.mutateAsync({ taskId: draggedTask.id, updates });
    } catch (error) {
      console.error('Failed to update task:', error);
    }

    setDraggedTask(null);
  };

  const formatTimeEstimate = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const isOverdue = (dueDate: string) => {
    return dueDate < new Date().toISOString().split('T')[0]!;
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {columns.map((column) => {
        const columnTasks = tasks.filter(column.filter);
        
        return (
          <Card 
            key={column.id}
            className={cn("flex flex-col", column.color)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>{column.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-300px)] px-3">
                <div className="space-y-2 pb-4">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={cn(
                        "p-3 bg-background border rounded-lg cursor-move transition-all hover:shadow-md",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        draggedTask?.id === task.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={cn(
                          "text-sm font-medium leading-tight",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(task.priority))}
                        >
                          {task.priority}
                        </Badge>
                        
                        {task.tags && task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className={cn(
                              isOverdue(task.due_date) && !task.completed && "text-red-500"
                            )}>
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        {task.time_estimate && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeEstimate(task.time_estimate)}</span>
                          </div>
                        )}
                      </div>

                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-2" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
