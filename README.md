# Personal Dashboard

A modern, AI-powered personal dashboard web application built with React, TypeScript, and Tailwind CSS. This dashboard provides a centralized platform for managing daily activities, accessing real-time information, and gaining AI-driven insights through an intuitive, widget-based interface.

## Features

### Core Functionality
- **Modular Widget Dashboard** - Customizable dashboard with resizable widgets for different modules
- **Task Management** - Add, complete, and track personal tasks with completion status
- **Multi-Module Navigation** - Dedicated pages for Tasks, Weather, Calendar, News, Health, Productivity, Finance, Journal, AI Insights, and Social features
- **Theme Support** - Light and dark mode switching with persistence
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Global Search** - Search functionality across dashboard content
- **Notifications** - Toast notification system for alerts and updates

### Planned Integrations
- Weather API for real-time weather data
- News API for personalized news feeds
- AI API (xAI Grok) for intelligent insights
- Calendar integration with event management
- Health metrics tracking
- Productivity analytics with charts
- Financial management tools
- Social media integration

## Technology Stack

### Frontend Framework
- **React** 18.3.1 - Modern React with hooks and functional components
- **TypeScript** 5.8.3 - Type-safe development with strict type checking
- **Vite** 5.4.19 - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components built on Radix UI
- **Lucide React** - Beautiful, customizable icon library
- **Tailwind Animate** - Smooth animations and transitions

### Data Management
- **TanStack Query** 5.83.0 - Powerful data fetching and caching
- **React Hook Form** 7.61.1 - Performant forms with validation
- **Zod** 3.25.76 - TypeScript-first schema validation

### Routing & Navigation
- **React Router DOM** 6.30.1 - Client-side routing with nested routes

## Getting Started

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```
   
   The development server will start at `http://localhost:8080`

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run type-check` - Run TypeScript type checking

### Building
- `npm run build` - Build for production (optimized bundle)
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint for code linting
- `npm run lint:fix` - Fix auto-fixable ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/
│   │   ├── DashboardOverview.tsx
│   │   └── widgets/           # Dashboard widgets
│   ├── AIHomepage.tsx
│   ├── AppSidebar.tsx
│   └── Dashboard.tsx
├── pages/                     # Route pages
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
└── App.tsx                    # Main app component
```

## Environment Configuration

The application runs on port 8080 by default and supports:
- Host configuration: `::` (all interfaces)
- Path aliases: `@/` points to `src/`
- Development: Component tagging with Lovable tagger

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance Goals

- **Initial Load Time**: < 2 seconds on 4G connection
- **Bundle Size**: < 500 KB (minified and gzipped)
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first responsive design

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Use descriptive variable names and add proper type annotations
3. Include proper error handling and loading states
4. Test across supported browsers
5. Ensure accessibility standards are met

## Future Roadmap

- [ ] API integrations for weather, news, and AI insights
- [ ] Offline support with data caching
- [ ] Widget customization and persistence
- [ ] Advanced productivity analytics
- [ ] Mobile app development with React Native
- [ ] Real-time data synchronization
