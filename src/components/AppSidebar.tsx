import { useState } from "react";
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
  { title: "Overview", url: "/", icon: LayoutDashboard },
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
  const [isDark, setIsDark] = useState(false);
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-accent hover:text-accent-foreground";

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className="p-6 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Dashboard</h1>
              <p className="text-xs text-muted-foreground">Personal Assistant</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={toggleTheme}
          className="w-full justify-start"
        >
          {isDark ? (
            <Sun className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
          ) : (
            <Moon className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
          )}
          {!collapsed && <span>{isDark ? "Light" : "Dark"} Mode</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}