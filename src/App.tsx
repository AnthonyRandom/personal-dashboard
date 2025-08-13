import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TasksPage from "./pages/TasksPage";
import WeatherPage from "./pages/WeatherPage";
import CalendarPage from "./pages/CalendarPage";
import NewsPage from "./pages/NewsPage";
import HealthPage from "./pages/HealthPage";
import ProductivityPage from "./pages/ProductivityPage";
import FinancePage from "./pages/FinancePage";
import JournalPage from "./pages/JournalPage";
import InsightsPage from "./pages/InsightsPage";
import SocialPage from "./pages/SocialPage";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./components/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
