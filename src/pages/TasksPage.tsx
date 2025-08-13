import { useState } from "react";
import { CheckSquare, Plus, Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  category: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    text: "Review quarterly report",
    completed: false,
    priority: "high",
    dueDate: "2024-01-20",
    category: "Work",
  },
  {
    id: 2,
    text: "Call dentist for appointment",
    completed: true,
    priority: "medium",
    category: "Personal",
  },
  {
    id: 3,
    text: "Finish project presentation",
    completed: false,
    priority: "high",
    dueDate: "2024-01-18",
    category: "Work",
  },
  {
    id: 4,
    text: "Buy groceries",
    completed: false,
    priority: "low",
    category: "Personal",
  },
  {
    id: 5,
    text: "Plan weekend trip",
    completed: false,
    priority: "medium",
    dueDate: "2024-01-25",
    category: "Personal",
  },
  {
    id: 6,
    text: "Update portfolio",
    completed: false,
    priority: "medium",
    category: "Work",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: Math.max(...tasks.map((t) => t.id)) + 1,
        text: newTask.trim(),
        completed: false,
        priority: "medium",
        category: "Personal",
      };
      setTasks([task, ...tasks]);
      setNewTask("");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily tasks and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add New Task */}
      <div className="dashboard-widget">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newTask.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </form>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {["all", "pending", "completed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f as typeof filter)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="dashboard-widget-compact group">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
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
                    {task.text}
                  </span>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(task.priority)}
                  >
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{task.category}</span>
                  {task.dueDate && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-muted-foreground">
            {filter === "completed"
              ? "No completed tasks yet"
              : "Add your first task to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
