import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const widgetVariants = cva(
  "bg-card border border-border rounded-xl transition-all duration-300 ease-out w-full h-full flex flex-col overflow-hidden",
  {
    variants: {
      variant: {
        default: "p-6 hover-lift",
        compact: "p-4 hover-subtle",
        minimal: "p-3 hover:bg-accent/50",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
      },
      animation: {
        none: "",
        scale: "animate-scale-in",
        fade: "animate-fade-in",
        slide: "animate-slide-up",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
);

export interface WidgetProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof widgetVariants> {
  children: ReactNode;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  staggerDelay?: number;
}

const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      children,
      icon,
      title,
      subtitle,
      actions,
      footer,
      staggerDelay,
      style,
      ...props
    },
    ref
  ) => {
    const widgetStyle = staggerDelay
      ? { "--stagger-delay": staggerDelay, ...style } as React.CSSProperties
      : style;

    return (
      <div
        className={cn(widgetVariants({ variant, size, animation, className }))}
        ref={ref}
        style={widgetStyle}
        {...props}
      >
        {(title || icon || actions) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title && (
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        )}
        
        <div className="space-y-3 flex-1 min-h-0 overflow-hidden">{children}</div>
        
        {footer && (
          <div className="pt-3 mt-3 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Widget.displayName = "Widget";

export { Widget, widgetVariants };
