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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { DashboardOverview } from "./components/dashboard/DashboardOverview";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Create a wrapper component for dashboard pages
const DashboardPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Dashboard>{children}</Dashboard>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPageWrapper><DashboardOverview /></DashboardPageWrapper>} />
          <Route path="/tasks" element={<DashboardPageWrapper><TasksPage /></DashboardPageWrapper>} />
          <Route path="/weather" element={<DashboardPageWrapper><WeatherPage /></DashboardPageWrapper>} />
          <Route path="/calendar" element={<DashboardPageWrapper><CalendarPage /></DashboardPageWrapper>} />
          <Route path="/news" element={<DashboardPageWrapper><NewsPage /></DashboardPageWrapper>} />
          <Route path="/health" element={<DashboardPageWrapper><HealthPage /></DashboardPageWrapper>} />
          <Route path="/productivity" element={<DashboardPageWrapper><ProductivityPage /></DashboardPageWrapper>} />
          <Route path="/finance" element={<DashboardPageWrapper><FinancePage /></DashboardPageWrapper>} />
          <Route path="/journal" element={<DashboardPageWrapper><JournalPage /></DashboardPageWrapper>} />
          <Route path="/insights" element={<DashboardPageWrapper><InsightsPage /></DashboardPageWrapper>} />
          <Route path="/social" element={<DashboardPageWrapper><SocialPage /></DashboardPageWrapper>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
