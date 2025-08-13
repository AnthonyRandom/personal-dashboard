import { BookOpen, Smile } from "lucide-react";
import { Widget } from "@/components/ui/widget";

export function MoodWidget() {
  return (
    <Widget
      title="Mood & Journal"
      icon={<BookOpen className="w-5 h-5" />}
    >
      <div className="text-center hover-subtle rounded-lg p-3 transition-colors">
        <Smile className="w-8 h-8 mx-auto text-primary mb-2" aria-hidden="true" />
        <p className="text-lg font-semibold">Great</p>
        <p className="text-xs text-muted-foreground">Today's mood</p>
      </div>

      <div className="text-center p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground italic">
          "Feeling productive and focused today. Great progress on projects!"
        </p>
      </div>
    </Widget>
  );
}
