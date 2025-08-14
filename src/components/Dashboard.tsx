import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Search, Bell, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthButton } from "./AuthButton";

interface DashboardProps {
  children: React.ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, just log the search - in the future this would handle AI search
      console.log("AI searching for:", query);
      // Could navigate to a search results page or show inline results
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header with AI Search */}
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 gap-4">
              <SidebarTrigger 
                className="hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/20 transition-all" 
                aria-label="Toggle sidebar"
              />

              <div className="flex-1 flex items-center justify-between">
                {/* AI Search Bar */}
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md" role="search">
                  <div className="relative">
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
                      aria-hidden="true"
                    />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask your AI assistant..."
                      className="pl-10 pr-12 bg-muted/50 border-0 focus-visible:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
                      aria-label="Ask your AI assistant"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:scale-105 transition-transform"
                      disabled={!query.trim()}
                      aria-label="Submit AI query"
                    >
                      <Sparkles className="w-3 h-3" />
                    </Button>
                  </div>
                </form>

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
                  <AuthButton />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
