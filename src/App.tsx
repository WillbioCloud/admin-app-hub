
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ComercianteDashboard from "./pages/comerciante/ComercianteDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route 
          path="/" 
          element={
            user.role === 'admin' ? 
              <AdminDashboard /> : 
              <ComercianteDashboard />
          } 
        />
        {/* Rotas específicas serão adicionadas conforme implementamos cada seção */}
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<DashboardRouter />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
