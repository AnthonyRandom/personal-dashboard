import { useState } from "react";
import { CheckSquare, Plus, Calendar, Filter, Search, Loader2, Edit, Trash2, Grid3X3, List, BarChart3, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks, useToggleTask, useDeleteTask, useTaskStats } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { CreateTaskModal } from "@/components/dashboard/CreateTaskModal";
import { EditTaskModal } from "@/components/dashboard/EditTaskModal";
import { QuickTaskEntry } from "@/components/dashboard/QuickTaskEntry";
import { TaskKanbanBoard } from "@/components/dashboard/TaskKanbanBoard";
import { TaskAnalytics } from "@/components/dashboard/TaskAnalytics";
import type { Task } from "@/services/taskService";

export default function TasksPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "today" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "analytics">("list");

  const { data: tasks = [], isLoading, error } = useTasks(filter);
  const { data: stats } = useTaskStats();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    return dueDate < (new Date().toISOString().split('T')[0] || '');
  };

  const formatTimeEstimate = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Please sign in to manage your tasks</p>
          <p className="text-muted-foreground">Your tasks will be synced across all devices</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Failed to load tasks</p>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your daily tasks and projects with advanced features
            </p>
            {stats && (
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{stats.total} total</span>
                <span>•</span>
                <span>{stats.pending} pending</span>
                <span>•</span>
                <span>{stats.completed} completed</span>
                {stats.overdue > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-destructive">{stats.overdue} overdue</span>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Quick Task Entry */}
        <QuickTaskEntry 
          onTaskCreated={() => {
            // Refresh tasks
          }}
          className="mb-6"
        />

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Kanban Board
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Search and Filter */}
            <div className="dashboard-widget">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "pending", "completed", "today", "overdue"].map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(f as typeof filter)}
                      className="hover:scale-[1.02] transition-transform"
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {stats && f !== "all" && (
                        <span className="ml-1 text-xs">
                          ({f === "pending" ? stats.pending : f === "completed" ? stats.completed : f === "today" ? stats.today : stats.overdue})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="dashboard-widget-compact group">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      disabled={toggleTask.isPending}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-medium transition-all ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(task.priority)}
                        >
                          {task.priority}
                        </Badge>
                        {task.due_date && isOverdue(task.due_date) && !task.completed && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{task.category}</span>
                        {task.due_date && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          </>
                        )}
                        {task.time_estimate && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeEstimate(task.time_estimate)}
                            </div>
                          </>
                        )}
                        {task.tags && task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent/50"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {searchQuery ? "No tasks found" : "No tasks yet"}
                </p>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search or filter"
                    : filter === "completed"
                    ? "No completed tasks yet"
                    : "Create your first task to get started"}
                </p>
                {!searchQuery && filter === "all" && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 hover:scale-[1.02] transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="kanban" className="space-y-4">
            <TaskKanbanBoard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TaskAnalytics />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open: boolean) => !open && setEditingTask(null)}
        />
      )}
    </>
  );
}
