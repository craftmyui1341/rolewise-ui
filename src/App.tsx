import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/employee/Tasks";
import Leaves from "./pages/employee/Leaves";
import Tickets from "./pages/employee/Tickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/tickets" element={<Tickets />} />
            {/* Placeholder routes for other pages */}
            <Route path="/payslips" element={<Dashboard />} />
            <Route path="/holidays" element={<Dashboard />} />
            <Route path="/attendance" element={<Dashboard />} />
            <Route path="/employees" element={<Dashboard />} />
            <Route path="/leave-management" element={<Dashboard />} />
            <Route path="/complaints" element={<Dashboard />} />
            <Route path="/payslip-upload" element={<Dashboard />} />
            <Route path="/performance" element={<Dashboard />} />
            <Route path="/attendance-overview" element={<Dashboard />} />
            <Route path="/employee-management" element={<Dashboard />} />
            <Route path="/team-performance" element={<Dashboard />} />
            <Route path="/admin-complaints" element={<Dashboard />} />
            <Route path="/admin-leaves" element={<Dashboard />} />
            <Route path="/admin-attendance" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;