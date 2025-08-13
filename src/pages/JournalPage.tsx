import { BookOpen, Smile, Meh, Frown, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const moodData = [
  { date: "Today", mood: "great", icon: Smile, color: "text-green-500", entry: "Feeling productive and focused today. Great progress on projects!" },
  { date: "Yesterday", mood: "good", icon: Smile, color: "text-blue-500", entry: "Had a successful meeting with the team. Feeling optimistic about upcoming deadlines." },
  { date: "Jan 14", mood: "okay", icon: Meh, color: "text-yellow-500", entry: "Bit stressed about workload but managed to complete important tasks." },
  { date: "Jan 13", mood: "good", icon: Smile, color: "text-blue-500", entry: "Great workout session this morning. Feeling energized for the day ahead." },
  { date: "Jan 12", mood: "amazing", icon: Heart, color: "text-red-500", entry: "Celebrated a major project milestone with the team. Feeling grateful and accomplished." },
];

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mood & Journal</h1>
          <p className="text-muted-foreground">Track your daily mood and reflect on your thoughts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Today's Mood */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
        <div className="flex justify-center gap-8 mb-6">
          {[
            { icon: Heart, label: "Amazing", color: "text-red-500 hover:bg-red-50" },
            { icon: Smile, label: "Great", color: "text-green-500 hover:bg-green-50" },
            { icon: Smile, label: "Good", color: "text-blue-500 hover:bg-blue-50" },
            { icon: Meh, label: "Okay", color: "text-yellow-500 hover:bg-yellow-50" },
            { icon: Frown, label: "Poor", color: "text-gray-500 hover:bg-gray-50" },
          ].map((mood, index) => (
            <button
              key={index}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:scale-105 ${mood.color}`}
            >
              <mood.icon className="w-8 h-8" />
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Write about your day...</h4>
          <Textarea
            placeholder="What's on your mind? Reflect on your day, achievements, challenges, or anything you'd like to remember..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end">
            <Button>Save Entry</Button>
          </div>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-2">{day}</p>
              <div className="h-12 bg-muted rounded flex items-end justify-center">
                <div 
                  className="w-6 bg-primary rounded-t"
                  style={{ height: `${Math.random() * 40 + 20}px` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Your average mood this week: <span className="font-medium text-green-600">Good</span>
        </p>
      </div>

      {/* Recent Entries */}
      <div className="dashboard-widget">
        <h3 className="text-lg font-semibold mb-4">Recent Journal Entries</h3>
        <div className="space-y-4">
          {moodData.map((entry, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <entry.icon className={`w-5 h-5 ${entry.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{entry.date}</span>
                    <span className={`text-sm capitalize ${entry.color}`}>{entry.mood}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {entry.entry}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="dashboard-widget">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Mood Pattern</h4>
            <p className="text-sm text-blue-700">
              You tend to feel better on days when you exercise in the morning. Consider maintaining this routine.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Consistency</h4>
            <p className="text-sm text-green-700">
              You've been journaling for 12 days straight! This consistency is great for mental wellbeing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}