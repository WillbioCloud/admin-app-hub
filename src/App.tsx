
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsuariosPage from "./pages/admin/UsuariosPage";
import ComerciosPage from "./pages/admin/ComerciosPage";
import GamificacoesPage from "./pages/admin/GamificacoesPage";
import RelatoriosPage from "./pages/admin/RelatoriosPage";
import CategoriasPage from "./pages/admin/CategoriasPage";
import AprovacoesPage from "./pages/admin/AprovacoesPage";
import AdminPerfilPage from "./pages/admin/AdminPerfilPage";

// Comerciante Pages
import ComercianteDashboard from "./pages/comerciante/ComercianteDashboard";
import PerfilPage from "./pages/comerciante/PerfilPage";
import PersonalizacaoPage from "./pages/comerciante/PersonalizacaoPage";
import ConfiguracoesPage from "./pages/comerciante/ConfiguracoesPage";
import ComercianteGamificacoesPage from "./pages/comerciante/GamificacoesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <DashboardLayout>
                <Index />
              </DashboardLayout>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            } />
            <Route path="/admin/usuarios" element={
              <DashboardLayout>
                <UsuariosPage />
              </DashboardLayout>
            } />
            <Route path="/admin/comercios" element={
              <DashboardLayout>
                <ComerciosPage />
              </DashboardLayout>
            } />
            <Route path="/admin/gamificacoes" element={
              <DashboardLayout>
                <GamificacoesPage />
              </DashboardLayout>
            } />
            <Route path="/admin/relatorios" element={
              <DashboardLayout>
                <RelatoriosPage />
              </DashboardLayout>
            } />
            <Route path="/admin/categorias" element={
              <DashboardLayout>
                <CategoriasPage />
              </DashboardLayout>
            } />
            <Route path="/admin/aprovacoes" element={
              <DashboardLayout>
                <AprovacoesPage />
              </DashboardLayout>
            } />
            <Route path="/admin/perfil" element={
              <DashboardLayout>
                <AdminPerfilPage />
              </DashboardLayout>
            } />

            {/* Comerciante Routes */}
            <Route path="/comerciante" element={
              <DashboardLayout>
                <ComercianteDashboard />
              </DashboardLayout>
            } />
            <Route path="/comerciante/perfil" element={
              <DashboardLayout>
                <PerfilPage />
              </DashboardLayout>
            } />
            <Route path="/comerciante/personalizacao" element={
              <DashboardLayout>
                <PersonalizacaoPage />
              </DashboardLayout>
            } />
            <Route path="/comerciante/configuracoes" element={
              <DashboardLayout>
                <ConfiguracoesPage />
              </DashboardLayout>
            } />
            <Route path="/comerciante/gamificacoes" element={
              <DashboardLayout>
                <ComercianteGamificacoesPage />
              </DashboardLayout>
            } />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
