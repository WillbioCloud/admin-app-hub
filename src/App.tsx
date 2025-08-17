
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
import NotificacoesPage from "./pages/admin/NotificacoesPage";
import NoticiasPage from "./pages/admin/NoticiasPage";
import RelatoriosPage from "./pages/admin/RelatoriosPage";
import CategoriasPage from "./pages/admin/CategoriasPage";
import AprovacoesPage from "./pages/admin/AprovacoesPage";
import AdminPerfilPage from "./pages/admin/AdminPerfilPage";
import AdminRecompensasPage from "./pages/admin/RecompensasPage";
import MapaPage from "./pages/admin/MapaPage";
import LoteamentosPage from "./pages/admin/LoteamentosPage";
import { ConquistasPage } from "./pages/admin/ConquistasPage";

// Comerciante Pages
import ComercianteDashboard from "./pages/comerciante/ComercianteDashboard";
import PersonalizacaoPage from "./pages/comerciante/PersonalizacaoPage";
import ConfiguracoesPage from "./pages/comerciante/ConfiguracoesPage";
import ComercianteGamificacoesPage from "./pages/comerciante/GamificacoesPage";
import ComercianteRecompensasPage from "./pages/comerciante/RecompensasPage";
import ComerciantePerfilPage from "./pages/comerciante/ComerciantePerfilPage";

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
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rota Raiz: Apenas o Index para redirecionar */}
            <Route path="/" element={<Index />} />
            
            {/* Rotas de Admin (Protegidas pelo DashboardLayout) */}
            <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/usuarios" element={<DashboardLayout><UsuariosPage /></DashboardLayout>} />
            <Route path="/admin/comercios" element={<DashboardLayout><ComerciosPage /></DashboardLayout>} />
            <Route path="/admin/gamificacoes" element={<DashboardLayout><GamificacoesPage /></DashboardLayout>} />
            <Route path="/admin/notificacoes" element={<DashboardLayout><NotificacoesPage /></DashboardLayout>} />
            <Route path="/admin/noticias" element={<DashboardLayout><NoticiasPage /></DashboardLayout>} />
            <Route path="/admin/relatorios" element={<DashboardLayout><RelatoriosPage /></DashboardLayout>} />
            <Route path="/admin/categorias" element={<DashboardLayout><CategoriasPage /></DashboardLayout>} />
            <Route path="/admin/aprovacoes" element={<DashboardLayout><AprovacoesPage /></DashboardLayout>} />
            <Route path="/admin/perfil" element={<DashboardLayout><AdminPerfilPage /></DashboardLayout>} />
            <Route path="/admin/recompensas" element={<DashboardLayout><AdminRecompensasPage /></DashboardLayout>} />
            <Route path="/admin/conquistas" element={<DashboardLayout><ConquistasPage /></DashboardLayout>} />
            <Route path="/admin/mapa" element={<DashboardLayout><MapaPage /></DashboardLayout>} />
            <Route path="/admin/loteamentos" element={<DashboardLayout><LoteamentosPage /></DashboardLayout>} />

            {/* Rotas de Comerciante (Protegidas pelo DashboardLayout) */}
            <Route path="/dashboard" element={<DashboardLayout><ComercianteDashboard /></DashboardLayout>} />
            <Route path="/dashboard/perfil" element={<DashboardLayout><ComerciantePerfilPage /></DashboardLayout>} />
            <Route path="/dashboard/personalizacao" element={<DashboardLayout><PersonalizacaoPage /></DashboardLayout>} />
            <Route path="/dashboard/configuracoes" element={<DashboardLayout><ConfiguracoesPage /></DashboardLayout>} />
            <Route path="/dashboard/gamificacoes" element={<DashboardLayout><ComercianteGamificacoesPage /></DashboardLayout>} />
            <Route path="/dashboard/recompensas" element={<DashboardLayout><ComercianteRecompensasPage /></DashboardLayout>} />

            {/* Rotas de Fallback */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
