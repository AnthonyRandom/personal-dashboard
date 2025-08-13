import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  { id: 1, text: "Review quarterly report", completed: false },
  { id: 2, text: "Call dentist for appointment", completed: true },
  { id: 3, text: "Finish project presentation", completed: false },
  { id: 4, text: "Buy groceries", completed: false },
];

export function TasksWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Tasks</h3>
        </div>
        <Button variant="ghost" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center space-x-2 group">
            <Checkbox
              checked={task.completed}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span
              className={`text-sm flex-1 transition-all ${
                task.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground group-hover:text-primary"
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {tasks.filter((t) => !t.completed).length} of {tasks.length}{" "}
            remaining
          </p>
        </div>
      </div>
    </div>
  );
}
