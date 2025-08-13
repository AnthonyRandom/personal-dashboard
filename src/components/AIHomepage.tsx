import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Calendar,
  Cloud,
  Newspaper,
  Heart,
  TrendingUp,
  DollarSign,
  CheckSquare,
  BookOpen,
  Share2,
  Bell,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Widget } from "@/components/ui/widget";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const quickActions = [
  { icon: Calendar, label: "Make a plan", color: "text-blue-500", path: "/calendar" },
  { icon: Cloud, label: "Check weather", color: "text-sky-500", path: "/weather" },
  { icon: Newspaper, label: "Summarize news", color: "text-orange-500", path: "/news" },
  { icon: Heart, label: "Health insights", color: "text-red-500", path: "/health" },
  { icon: TrendingUp, label: "Productivity tips", color: "text-green-500", path: "/productivity" },
  { icon: DollarSign, label: "Finance overview", color: "text-emerald-500", path: "/finance" },
  { icon: Sparkles, label: "Surprise me", color: "text-purple-500", path: "/insights" },
];

const features = [
  { title: "Smart Tasks", desc: "AI-organized", icon: CheckSquare, path: "/tasks" },
  { title: "Weather", desc: "Real-time", icon: Cloud, path: "/weather" },
  { title: "Journal", desc: "Reflective", icon: BookOpen, path: "/journal" },
  { title: "Social", desc: "Connected", icon: Share2, path: "/social" },
];

export function AIHomepage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, just log the search - in the future this would handle AI search
      console.log("Searching for:", query);
      // Could navigate to a search results page or show inline results
    }
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-4">
              <SidebarTrigger 
                className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/20 transition-all" 
                aria-label="Toggle sidebar"
              />

              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-accent/70 focus:ring-2 focus:ring-primary/20 transition-all group"
                    aria-label="View notifications (1 new)"
                  >
                    <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"
                      aria-hidden="true"
                    ></span>
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-2 hover-lift focus:ring-2 focus:ring-primary/20 transition-all"
                    aria-label="Add new widget to dashboard"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Plus className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main AI Chat Content */}
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl mx-auto text-center space-y-8">
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
                <form onSubmit={handleSearch} className="relative" role="search">
                  <div className="relative">
                    <Search 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" 
                      aria-hidden="true"
                    />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask anything..."
                      className="pl-12 pr-16 py-4 text-lg bg-card border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      aria-label="Search your dashboard"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl hover:scale-105 transition-transform"
                      disabled={!query.trim()}
                      aria-label="Submit search"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-3" role="list" aria-label="Quick actions">
                  {quickActions.map((action, index) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="gap-2 rounded-full hover-lift focus:ring-2 focus:ring-primary/20"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      onClick={() => handleQuickAction(action.path)}
                      role="listitem"
                    >
                      <action.icon className={`w-4 h-4 ${action.color}`} aria-hidden="true" />
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
                {features.map((feature, index) => (
                  <Widget
                    key={feature.title}
                    variant="compact"
                    className="text-center space-y-2 cursor-pointer group"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                    onClick={() => handleFeatureClick(feature.path)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to ${feature.title} page`}
                  >
                    <feature.icon className="w-6 h-6 mx-auto text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </Widget>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
