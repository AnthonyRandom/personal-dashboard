import { useState, useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useWidgetStore } from "@/stores/widgetStore";
import { TasksWidget } from "./widgets/TasksWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { NewsWidget } from "./widgets/NewsWidget";
import { HealthWidget } from "./widgets/HealthWidget";
import { ProductivityWidget } from "./widgets/ProductivityWidget";
import { FinanceWidget } from "./widgets/FinanceWidget";
import { MoodWidget } from "./widgets/MoodWidget";
import { InsightsWidget } from "./widgets/InsightsWidget";
import { SocialWidget } from "./widgets/SocialWidget";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { RemoveWidgetDialog } from "./RemoveWidgetDialog";
import { cn } from "@/lib/utils";

// Import required CSS for react-grid-layout
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  tasks: TasksWidget,
  weather: WeatherWidget,
  calendar: CalendarWidget,
  news: NewsWidget,
  health: HealthWidget,
  productivity: ProductivityWidget,
  finance: FinanceWidget,
  mood: MoodWidget,
  insights: InsightsWidget,
  social: SocialWidget,
};

interface WidgetWrapperProps {
  children: React.ReactNode;
  title: string;
  widgetId: string;
  onRemove: (widgetId: string) => void;
  staggerDelay?: number;
}

function WidgetWrapper({ children, title, widgetId, onRemove, staggerDelay }: WidgetWrapperProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRemove = () => {
    onRemove(widgetId);
    setShowRemoveDialog(false);
  };

  return (
    <>
      <div 
        className="relative group h-full animate-scale-in"
        style={staggerDelay ? { "--stagger-delay": staggerDelay } as React.CSSProperties : undefined}
      >
        {/* Drag handle - styled to match your design */}
        <div className="drag-handle absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <div className="w-6 h-6 bg-background/80 backdrop-blur border border-border rounded-md flex items-center justify-center hover:bg-accent">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>

        {/* Remove button - positioned outside of any clipping containers */}
        <div className="absolute -top-3 -right-3 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 bg-background border border-border rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground focus:ring-2 focus:ring-destructive/20 shadow-lg"
            onClick={() => setShowRemoveDialog(true)}
            aria-label={`Remove ${title} widget`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="h-full w-full">{children}</div>
      </div>
      
      <RemoveWidgetDialog
        isOpen={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        widgetTitle={title}
        onConfirm={handleRemove}
      />
    </>
  );
}

export function DraggableDashboard() {
  const { widgets, removeWidget, updateWidgetPosition } = useWidgetStore();
  const enabledWidgets = widgets.filter(w => w.enabled);

  // Convert widget positions to react-grid-layout format
  const layouts = useMemo(() => {
    const layout: Layout[] = enabledWidgets.map((widget) => ({
      i: widget.id,
      x: widget.position.col,
      y: widget.position.row,
      w: widget.position.colSpan,
      h: widget.position.rowSpan,
      minW: 1,
      minH: 1,
      maxW: 4,
      maxH: 3,
    }));

    return {
      lg: layout,
      md: layout,
      sm: layout.map(item => ({ ...item, w: Math.min(item.w, 2) })),
      xs: layout.map(item => ({ ...item, w: 1, x: 0 })),
    };
  }, [enabledWidgets]);

  const handleLayoutChange = (layout: Layout[]) => {
    // Update widget positions in the store
    layout.forEach((item) => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        updateWidgetPosition(widget.id, {
          row: item.y,
          col: item.x,
          rowSpan: item.h,
          colSpan: item.w,
        });
      }
    });
  };

  if (enabledWidgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center animate-fade-in">
        <div className="space-y-3">
          <p className="text-muted-foreground">No widgets added yet</p>
          <p className="text-sm text-muted-foreground">
            Click "Add Widget" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ overflow: 'visible' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1 }}
        rowHeight={140}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".drag-handle"
        preventCollision={true}
        compactType="vertical"
        useCSSTransforms={true}
        style={{ overflow: 'visible' }}
      >
        {enabledWidgets.map((widget, index) => {
          const WidgetComponent = widgetComponents[widget.type as keyof typeof widgetComponents];
          
          return (
            <div 
              key={widget.id}
              className={cn(
                "widget-item",
                "stagger-animation"
              )}
              style={{ 
                "--stagger-delay": index + 1,
                overflow: 'visible',
                position: 'relative'
              } as React.CSSProperties}
            >
              <WidgetWrapper
                title={widget.title}
                widgetId={widget.id}
                onRemove={removeWidget}
                staggerDelay={index + 1}
              >
                {WidgetComponent && <WidgetComponent />}
              </WidgetWrapper>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
