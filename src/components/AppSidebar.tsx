import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Cloud,
  Calendar,
  Newspaper,
  Heart,
  TrendingUp,
  DollarSign,
  BookOpen,
  Sparkles,
  Share2,
  Moon,
  Sun,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Weather", url: "/weather", icon: Cloud },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "News Feed", url: "/news", icon: Newspaper },
  { title: "Health", url: "/health", icon: Heart },
  { title: "Productivity", url: "/productivity", icon: TrendingUp },
  { title: "Finance", url: "/finance", icon: DollarSign },
  { title: "Journal", url: "/journal", icon: BookOpen },
  { title: "AI Insights", url: "/insights", icon: Sparkles },
  { title: "Social", url: "/social", icon: Share2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // Theme state with localStorage persistence
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard-theme");
      if (saved) return saved === "dark";
      // Check system preference if no saved theme
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply theme on mount and changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("dashboard-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem("dashboard-theme");
      if (!savedTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/20";

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  // Keyboard navigation handler for theme toggle
  const handleThemeKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  }, [toggleTheme]);

  // Comprehensive keyboard navigation for sidebar
  const handleSidebarKeyDown = useCallback((event: React.KeyboardEvent) => {
    const focusableElements = Array.from(
      document.querySelectorAll('[data-sidebar-focusable="true"]')
    ) as HTMLElement[];
    
    const currentIndex = focusableElements.findIndex(
      el => el === document.activeElement
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
        break;
        
      case "ArrowUp":
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
        break;
        
      case "Home":
        event.preventDefault();
        focusableElements[0]?.focus();
        break;
        
      case "End":
        event.preventDefault();
        focusableElements[focusableElements.length - 1]?.focus();
        break;
    }
  }, []);

  return (
    <Sidebar
      className="border-r border-border sidebar-transition"
      collapsible="icon"
      onKeyDown={handleSidebarKeyDown}
    >
      <SidebarHeader className={`${collapsed ? "p-3" : "p-6"} border-b border-border sidebar-transition`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-2"}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="sidebar-content-transition animate-slide-right">
              <h1 className="text-lg font-semibold whitespace-nowrap">AI Dashboard</h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                Personal Assistant
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${collapsed ? "px-2" : "px-3"} py-4 sidebar-transition`}>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="w-full"
                    {...(collapsed && { tooltip: item.title })}
                    isActive={isActive(item.url)}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 focus-visible-ring ${getNavCls({ isActive: isActive(item.url) })}`}
                      data-sidebar-focusable="true"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.currentTarget.click();
                        }
                      }}
                    >
                      <item.icon
                        className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`}
                        aria-hidden="true"
                      />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`${collapsed ? "p-2" : "p-3"} border-t border-border sidebar-transition`}>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={toggleTheme}
          onKeyDown={handleThemeKeyDown}
          className="w-full justify-start hover:bg-accent/70 focus:ring-2 focus:ring-primary/20 transition-all duration-300 group"
          data-sidebar-focusable="true"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={collapsed ? `Switch to ${isDark ? "light" : "dark"} mode` : undefined}
        >
          {isDark ? (
            <Sun 
              className={`h-4 w-4 ${collapsed ? "" : "mr-2"} group-hover:rotate-90 transition-transform duration-500 ease-in-out`}
              aria-hidden="true"
            />
          ) : (
            <Moon 
              className={`h-4 w-4 ${collapsed ? "" : "mr-2"} group-hover:rotate-12 transition-transform duration-500 ease-in-out`}
              aria-hidden="true"
            />
          )}
          {!collapsed && (
            <span className="transition-opacity duration-200">
              {isDark ? "Light" : "Dark"} Mode
            </span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
