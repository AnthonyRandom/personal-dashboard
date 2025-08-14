import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringCorner, setIsHoveringCorner] = useState(false);

  const handleRemove = () => {
    onRemove(widgetId);
    setShowRemoveDialog(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const widgetElement = (e.target as HTMLElement).closest('.widget-container') as HTMLElement;
    const panelElement = widgetElement?.closest('[data-panel]') as HTMLElement;
    
    if (!panelElement) return;

    const startWidth = panelElement.offsetWidth;
    const startHeight = panelElement.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newWidth = Math.max(200, startWidth + deltaX);
      const newHeight = Math.max(200, startHeight + deltaY);
      
      panelElement.style.minWidth = `${newWidth}px`;
      panelElement.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <div 
        className={cn(
          "relative group animate-scale-in h-full widget-container transition-all duration-300 ease-out",
          isHoveringCorner && "rounded-br-xl shadow-lg",
          isResizing && "select-none cursor-se-resize"
        )}
        style={staggerDelay ? { "--stagger-delay": staggerDelay } as React.CSSProperties : undefined}
      >
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
        
        {/* Resize corner area - invisible but interactive */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-20"
          onMouseDown={handleResizeStart}
          onMouseEnter={() => setIsHoveringCorner(true)}
          onMouseLeave={() => setIsHoveringCorner(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // For keyboard users, we could implement arrow key resizing
            }
          }}
          aria-label={`Resize ${title} widget by dragging this corner`}
          role="button"
          tabIndex={0}
        />
        
        <div className="h-full">{children}</div>
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

export function ResizableDashboard() {
  const { widgets, removeWidget } = useWidgetStore();
  const enabledWidgets = widgets.filter(w => w.enabled);

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

  // Group widgets into rows for responsive layout
  const widgetRows: typeof enabledWidgets[] = [];
  let currentRow: typeof enabledWidgets = [];
  let currentRowSpan = 0;

  enabledWidgets
    .sort((a, b) => a.position.row - b.position.row || a.position.col - b.position.col)
    .forEach((widget) => {
      if (currentRow.length === 0 || currentRowSpan + widget.position.colSpan > 4) {
        if (currentRow.length > 0) {
          widgetRows.push(currentRow);
        }
        currentRow = [widget];
        currentRowSpan = widget.position.colSpan;
      } else {
        currentRow.push(widget);
        currentRowSpan += widget.position.colSpan;
      }
    });

  if (currentRow.length > 0) {
    widgetRows.push(currentRow);
  }

  return (
    <div className="space-y-4 dashboard-container" style={{ overflow: 'visible' }}>
      {widgetRows.map((row, rowIndex) => (
        <PanelGroup
          key={`row-${rowIndex}`}
          direction="horizontal"
          className="h-auto min-h-[280px]"
          style={{ overflow: 'visible' }}
        >
          {row.map((widget, colIndex) => {
            const WidgetComponent = widgetComponents[widget.type as keyof typeof widgetComponents];
            const isLast = colIndex === row.length - 1;

            return (
              <div key={widget.id} className="contents">
                <Panel
                  defaultSize={25 * widget.position.colSpan}
                  minSize={Math.max(25 * widget.position.colSpan, 25)}
                  className={cn(
                    "relative",
                    "animate-scale-in"
                  )}
                  style={{ 
                    "--stagger-delay": rowIndex * row.length + colIndex + 1,
                    overflow: 'visible'
                  } as React.CSSProperties}
                >
                  <WidgetWrapper
                    title={widget.title}
                    widgetId={widget.id}
                    onRemove={removeWidget}
                    staggerDelay={rowIndex * row.length + colIndex + 1}
                  >
                    {WidgetComponent && (
                      <div style={{ height: '100%', width: '100%' }}>
                        <WidgetComponent />
                      </div>
                    )}
                  </WidgetWrapper>
                </Panel>
                
                {!isLast && (
                  <PanelResizeHandle className="w-2 bg-transparent hover:bg-border transition-colors flex items-center justify-center group">
                    <div className="w-1 h-8 bg-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </PanelResizeHandle>
                )}
              </div>
            );
          })}
        </PanelGroup>
      ))}
    </div>
  );
}
