import { create } from 'zustand';

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  icon: string;
  enabled: boolean;
  position: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
}

export interface WidgetStoreState {
  widgets: WidgetConfig[];
  availableWidgets: Omit<WidgetConfig, 'enabled' | 'position'>[];
  addWidget: (widgetType: string) => void;
  removeWidget: (widgetId: string) => void;
  updateWidgetPosition: (widgetId: string, position: WidgetConfig['position']) => void;
  toggleWidget: (widgetId: string) => void;
  resetToDefault: () => void;
}

const defaultWidgets: WidgetConfig[] = [
  {
    id: 'tasks',
    type: 'tasks',
    title: 'Tasks',
    icon: 'CheckSquare',
    enabled: true,
    position: { row: 0, col: 0, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'weather',
    type: 'weather',
    title: 'Weather',
    icon: 'Cloud',
    enabled: true,
    position: { row: 0, col: 1, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'calendar',
    type: 'calendar',
    title: 'Calendar',
    icon: 'Calendar',
    enabled: true,
    position: { row: 0, col: 2, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'health',
    type: 'health',
    title: 'Health',
    icon: 'Activity',
    enabled: true,
    position: { row: 0, col: 3, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'productivity',
    type: 'productivity', 
    title: 'Productivity',
    icon: 'TrendingUp',
    enabled: true,
    position: { row: 2, col: 0, rowSpan: 2, colSpan: 2 }
  },
  {
    id: 'finance',
    type: 'finance',
    title: 'Finance',
    icon: 'DollarSign',
    enabled: true,
    position: { row: 2, col: 2, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'mood',
    type: 'mood',
    title: 'Mood',
    icon: 'Smile',
    enabled: true,
    position: { row: 2, col: 3, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'news',
    type: 'news',
    title: 'News',
    icon: 'Newspaper',
    enabled: true,
    position: { row: 4, col: 0, rowSpan: 2, colSpan: 3 }
  },
  {
    id: 'insights',
    type: 'insights',
    title: 'AI Insights',
    icon: 'Brain',
    enabled: true,
    position: { row: 4, col: 3, rowSpan: 2, colSpan: 1 }
  },
  {
    id: 'social',
    type: 'social',
    title: 'Social',
    icon: 'Users',
    enabled: true,
    position: { row: 6, col: 0, rowSpan: 2, colSpan: 2 }
  }
];

const availableWidgets = [
  { id: 'tasks', type: 'tasks', title: 'Tasks', icon: 'CheckSquare' },
  { id: 'weather', type: 'weather', title: 'Weather', icon: 'Cloud' },
  { id: 'calendar', type: 'calendar', title: 'Calendar', icon: 'Calendar' },
  { id: 'health', type: 'health', title: 'Health', icon: 'Activity' },
  { id: 'productivity', type: 'productivity', title: 'Productivity', icon: 'TrendingUp' },
  { id: 'finance', type: 'finance', title: 'Finance', icon: 'DollarSign' },
  { id: 'mood', type: 'mood', title: 'Mood', icon: 'Smile' },
  { id: 'news', type: 'news', title: 'News', icon: 'Newspaper' },
  { id: 'insights', type: 'insights', title: 'AI Insights', icon: 'Brain' },
  { id: 'social', type: 'social', title: 'Social', icon: 'Users' }
];

export const useWidgetStore = create<WidgetStoreState>((set, get) => ({
      widgets: defaultWidgets,
      availableWidgets,
      
      addWidget: (widgetType: string) => {
        const availableWidget = availableWidgets.find(w => w.type === widgetType);
        if (!availableWidget) return;
        
        const existingWidget = get().widgets.find(w => w.type === widgetType);
        if (existingWidget) {
          // Enable existing widget
          set(state => ({
            widgets: state.widgets.map(w => 
              w.type === widgetType 
                ? { ...w, enabled: true }
                : w
            )
          }));
          return;
        }
        
        // Find next available position
        const widgets = get().widgets;
        const maxRow = Math.max(...widgets.map(w => w.position.row + w.position.rowSpan - 1), -1);
        
        const newWidget: WidgetConfig = {
          ...availableWidget,
          id: `${widgetType}-${Date.now()}`,
          enabled: true,
          position: { row: maxRow + 1, col: 0, rowSpan: 1, colSpan: 1 }
        };
        
        set(state => ({
          widgets: [...state.widgets, newWidget]
        }));
      },
      
      removeWidget: (widgetId: string) => {
        set(state => ({
          widgets: state.widgets.filter(w => w.id !== widgetId)
        }));
      },
      
      updateWidgetPosition: (widgetId: string, position: WidgetConfig['position']) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.id === widgetId 
              ? { ...w, position }
              : w
          )
        }));
      },
      
      toggleWidget: (widgetId: string) => {
        set(state => ({
          widgets: state.widgets.map(w =>
            w.id === widgetId 
              ? { ...w, enabled: !w.enabled }
              : w
          )
        }));
      },
      
      resetToDefault: () => {
        set({ widgets: defaultWidgets });
      }
    }));
