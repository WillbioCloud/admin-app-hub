
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsuariosPage from '@/pages/admin/UsuariosPage';
import ComerciosPage from '@/pages/admin/ComerciosPage';
import CategoriasPage from '@/pages/admin/CategoriasPage';
import GamificacoesPage from '@/pages/admin/GamificacoesPage';
import AprovacoesPage from '@/pages/admin/AprovacoesPage';
import RelatoriosPage from '@/pages/admin/RelatoriosPage';
import AdminPerfilPage from '@/pages/admin/AdminPerfilPage';

// Comerciante Pages
import ComercianteDashboard from '@/pages/comerciante/ComercianteDashboard';
import PerfilPage from '@/pages/comerciante/PerfilPage';
import PersonalizacaoPage from '@/pages/comerciante/PersonalizacaoPage';
import ConfiguracoesPage from '@/pages/comerciante/ConfiguracoesPage';
import Comerciante_GamificacoesPage from '@/pages/comerciante/GamificacoesPage';

// Layout
import { DashboardLayout } from '@/components/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Admin */}
          <Route path="/admin/dashboard" element={
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
          <Route path="/admin/categorias" element={
            <DashboardLayout>
              <CategoriasPage />
            </DashboardLayout>
          } />
          <Route path="/admin/gamificacoes" element={
            <DashboardLayout>
              <GamificacoesPage />
            </DashboardLayout>
          } />
          <Route path="/admin/aprovacoes" element={
            <DashboardLayout>
              <AprovacoesPage />
            </DashboardLayout>
          } />
          <Route path="/admin/relatorios" element={
            <DashboardLayout>
              <RelatoriosPage />
            </DashboardLayout>
          } />
          <Route path="/admin/perfil" element={
            <DashboardLayout>
              <AdminPerfilPage />
            </DashboardLayout>
          } />

          {/* Protected Routes - Comerciante */}
          <Route path="/dashboard" element={
            <DashboardLayout>
              <ComercianteDashboard />
            </DashboardLayout>
          } />
          <Route path="/dashboard/perfil" element={
            <DashboardLayout>
              <PerfilPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/gamificacoes" element={
            <DashboardLayout>
              <Comerciante_GamificacoesPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/personalizacao" element={
            <DashboardLayout>
              <PersonalizacaoPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/configuracoes" element={
            <DashboardLayout>
              <ConfiguracoesPage />
            </DashboardLayout>
          } />

          {/* Legacy routes for backward compatibility */}
          <Route path="/dashboard/usuarios" element={
            <DashboardLayout>
              <UsuariosPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/comercios" element={
            <DashboardLayout>
              <ComerciosPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/categorias" element={
            <DashboardLayout>
              <CategoriasPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/aprovacoes" element={
            <DashboardLayout>
              <AprovacoesPage />
            </DashboardLayout>
          } />
          <Route path="/dashboard/relatorios" element={
            <DashboardLayout>
              <RelatoriosPage />
            </DashboardLayout>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
