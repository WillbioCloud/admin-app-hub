
import React from 'react';
import { Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-16 border-b flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">
              Painel {user.role === 'admin' ? 'Administrativo' : 'do Comerciante'}
            </h1>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
