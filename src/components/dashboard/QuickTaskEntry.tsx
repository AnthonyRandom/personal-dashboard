import { useState, useRef, useEffect } from "react";
import { useCreateTask } from "@/hooks/useTasks";
import { parseNaturalLanguage } from "@/services/taskService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Clock, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  CheckCircle,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

interface QuickTaskEntryProps {
  onTaskCreated?: () => void;
  className?: string;
}

export function QuickTaskEntry({ onTaskCreated, className }: QuickTaskEntryProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [parsedTask, setParsedTask] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask();

  // Auto-expand when focused
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // Parse input as user types
  useEffect(() => {
    if (input.trim()) {
      const parsed = parseNaturalLanguage(input);
      setParsedTask(parsed);
    } else {
      setParsedTask(null);
    }
  }, [input]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      await createTask.mutateAsync({
        title: parsedTask?.title || input.trim(),
        description: parsedTask?.description,
        priority: parsedTask?.priority || "medium",
        category: "Personal",
        due_date: parsedTask?.due_date,
        tags: parsedTask?.tags,
        time_estimate: parsedTask?.time_estimate,
      });

      setInput("");
      setParsedTask(null);
      setIsExpanded(false);
      onTaskCreated?.();
      
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setInput("");
    setParsedTask(null);
    setIsExpanded(false);
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

  return (
    <Card className={`transition-all duration-300 ${className} ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Add a task... (e.g., 'Call John tomorrow at 3pm #work urgent')"
              className="pr-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base"
              disabled={isProcessing}
            />
            
            {isProcessing && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {!isProcessing && (
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              size="sm"
              className="shrink-0 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Parsed Task Preview */}
        {isExpanded && parsedTask && input.trim() && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg animate-slide-up">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{parsedTask.title}</h4>
              {parsedTask.priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(parsedTask.priority)}`}
                >
                  {parsedTask.priority}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {parsedTask.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Due {new Date(parsedTask.due_date).toLocaleDateString()}</span>
                </div>
              )}
              
              {parsedTask.time_estimate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeEstimate(parsedTask.time_estimate)}</span>
                </div>
              )}
              
              {parsedTask.tags && parsedTask.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{parsedTask.tags.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
              <Button
                onClick={handleSubmit}
                size="sm"
                className="h-7 text-xs"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                Create Task
              </Button>
              
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Help text */}
        {isExpanded && !parsedTask && input.trim() && (
          <div className="mt-2 text-xs text-muted-foreground animate-slide-up">
            <p>💡 Try: "Call John tomorrow at 3pm #work urgent" or "Review docs in 2 hours"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
