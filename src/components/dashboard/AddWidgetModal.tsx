import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useWidgetStore } from "@/stores/widgetStore";
import * as Icons from "lucide-react";

interface AddWidgetModalProps {
  trigger?: React.ReactNode;
}

export function AddWidgetModal({ trigger }: AddWidgetModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { availableWidgets, widgets, addWidget } = useWidgetStore();

  const enabledWidgetTypes = widgets.filter(w => w.enabled).map(w => w.type);

  const handleAddWidget = (widgetType: string) => {
    addWidget(widgetType);
    setIsOpen(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            size="sm" 
            className="gap-2 hover-lift focus:ring-2 focus:ring-primary/20 transition-all"
            aria-label="Add new widget to dashboard"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your dashboard. You can customize its position after adding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {availableWidgets.map((widget) => {
            const isEnabled = enabledWidgetTypes.includes(widget.type);
            
            return (
              <Button
                key={widget.id}
                variant={isEnabled ? "secondary" : "outline"}
                className="h-auto p-4 flex flex-col gap-2 hover-lift focus:ring-2 focus:ring-primary/20 transition-all"
                onClick={() => handleAddWidget(widget.type)}
                disabled={isEnabled}
                aria-label={`Add ${widget.title} widget${isEnabled ? ' (already added)' : ''}`}
              >
                <div className="text-primary">
                  {getIcon(widget.icon)}
                </div>
                <span className="text-sm font-medium">{widget.title}</span>
                {isEnabled && (
                  <span className="text-xs text-muted-foreground">Added</span>
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="hover:bg-accent focus:ring-2 focus:ring-primary/20"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
