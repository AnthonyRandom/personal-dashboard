import { useState } from "react";
import {
  Search,
  Sparkles,
  Calendar,
  Cloud,
  Newspaper,
  Heart,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickActions = [
  { icon: Calendar, label: "Make a plan", color: "text-blue-500" },
  { icon: Cloud, label: "Check weather", color: "text-sky-500" },
  { icon: Newspaper, label: "Summarize news", color: "text-orange-500" },
  { icon: Heart, label: "Health insights", color: "text-red-500" },
  { icon: TrendingUp, label: "Productivity tips", color: "text-green-500" },
  { icon: DollarSign, label: "Finance overview", color: "text-emerald-500" },
  { icon: Sparkles, label: "Surprise me", color: "text-purple-500" },
];

export function AIHomepage() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle AI search
      console.log("Searching for:", query);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        {/* Welcome Message */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready when you are.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered personal assistant is here to help with tasks,
            insights, and daily management.
          </p>
        </div>

        {/* Search Interface */}
        <div
          className="space-y-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="pl-12 pr-12 py-4 text-lg bg-card border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
                disabled={!query.trim()}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant="outline"
                className="gap-2 rounded-full hover-lift"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { title: "Smart Tasks", desc: "AI-organized" },
            { title: "Weather", desc: "Real-time" },
            { title: "Insights", desc: "Personalized" },
            { title: "Analytics", desc: "Detailed" },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="dashboard-widget-compact text-center space-y-2"
              style={{ animationDelay: `${0.7 + index * 0.1}s` }}
            >
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
