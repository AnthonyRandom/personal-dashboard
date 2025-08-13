import { BookOpen, Smile } from "lucide-react";

export function MoodWidget() {
  return (
    <div className="dashboard-widget animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Mood & Journal</h3>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <Smile className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="text-lg font-semibold">Great</p>
          <p className="text-xs text-muted-foreground">Today's mood</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            "Feeling productive and focused today. Great progress on projects!"
          </p>
        </div>
      </div>
    </div>
  );
}
