
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AgentsPage from "./pages/AgentsPage";
import WorkflowsPage from "./pages/WorkflowsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import MonitoringPage from "./pages/MonitoringPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
