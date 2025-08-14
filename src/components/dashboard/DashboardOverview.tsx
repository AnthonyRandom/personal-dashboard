import { DraggableDashboard } from "./DraggableDashboard";
import { useAuth } from "@/hooks/useAuth";
import { AddWidgetModal } from "./AddWidgetModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardOverview() {
  const { user } = useAuth();
  
  // Get the user's first name from user metadata or email
  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'there';
  };

  const firstName = getFirstName();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="animate-fade-in relative">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Good morning, {firstName}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your day
            </p>
          </div>
          <AddWidgetModal 
            trigger={
              <Button 
                size="lg" 
                className="gap-3 hover-lift focus:ring-2 focus:ring-primary/20 transition-all shadow-lg"
                aria-label="Add new widget to dashboard"
              >
                <Plus className="w-5 h-5" />
                Add Widget
              </Button>
            }
          />
        </div>
      </div>

      {/* Draggable Dashboard */}
      <DraggableDashboard />
    </div>
  );
}
