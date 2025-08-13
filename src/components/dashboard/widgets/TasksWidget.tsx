import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Widget } from "@/components/ui/widget";

const tasks = [
  { id: 1, text: "Review quarterly report", completed: false },
  { id: 2, text: "Call dentist for appointment", completed: true },
  { id: 3, text: "Finish project presentation", completed: false },
  { id: 4, text: "Buy groceries", completed: false },
];

export function TasksWidget() {
  return (
    <Widget
      title="Tasks"
      icon={<CheckSquare className="w-5 h-5" />}
      actions={
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-accent/50 focus:ring-2 focus:ring-primary/20"
          aria-label="Add new task"
        >
          <Plus className="w-4 h-4" />
        </Button>
      }
      footer={
        <p className="text-xs text-muted-foreground">
          {tasks.filter((t) => !t.completed).length} of {tasks.length}{" "}
          remaining
        </p>
      }
    >
      {tasks.slice(0, 3).map((task) => (
        <div key={task.id} className="flex items-center space-x-2 group">
          <Checkbox
            checked={task.completed}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
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
    </Widget>
  );
}
