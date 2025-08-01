import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/employee/Tasks";
import Leaves from "./pages/employee/Leaves";
import Tickets from "./pages/employee/Tickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userRole = user?.role || 'employee';

  return (
    <Layout userRole={userRole}>
      <Routes>
        {/* Redirect root to appropriate dashboard */}
        <Route path="/" element={<Navigate to={`/dashboard/${userRole}`} replace />} />
        <Route path="/login" element={<Navigate to={`/dashboard/${userRole}`} replace />} />

        {/* Employee Routes */}
        <Route path="/dashboard/employee" element={
          <ProtectedRoute requiredRole="employee">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/employee/tasks" element={
          <ProtectedRoute requiredRole="employee">
            <Tasks />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/employee/leaves" element={
          <ProtectedRoute requiredRole="employee">
            <Leaves />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/employee/tickets" element={
          <ProtectedRoute requiredRole="employee">
            <Tickets />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/employee/*" element={
          <ProtectedRoute requiredRole="employee">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* HR Routes */}
        <Route path="/dashboard/hr" element={
          <ProtectedRoute requiredRole="hr">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/hr/*" element={
          <ProtectedRoute requiredRole="hr">
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;