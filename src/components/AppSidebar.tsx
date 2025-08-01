import { Home, Users, FileText, Bell, Store, Settings, Palette, User, GamepadIcon, Newspaper } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth } from '@/contexts/AuthContext';

export function AppSidebar() {
  const { user } = useAuth();

  const adminItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: Home,
    },
    {
      title: 'Usuários',
      url: '/admin/usuarios',
      icon: Users,
    },
    {
      title: 'Comércios',
      url: '/admin/comercios',
      icon: Store,
    },
    {
      title: 'Categorias',
      url: '/admin/categorias',
      icon: FileText,
    },
    {
      title: 'Gamificações',
      url: '/admin/gamificacoes',
      icon: GamepadIcon,
    },
    {
      title: 'Notificações',
      url: '/admin/notificacoes',
      icon: Bell,
    },
    {
      title: 'Notícias',
      url: '/admin/noticias',
      icon: Newspaper,
    },
    {
      title: 'Aprovações',
      url: '/admin/aprovacoes',
      icon: Bell,
    },
    {
      title: 'Relatórios',
      url: '/admin/relatorios',
      icon: FileText,
    },
    {
      title: 'Perfil',
      url: '/admin/perfil',
      icon: User,
    },
  ];

  const comercianteItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Perfil',
      url: '/dashboard/perfil',
      icon: User,
    },
    {
      title: 'Gamificações',
      url: '/dashboard/gamificacoes',
      icon: GamepadIcon,
    },
    {
      title: 'Personalização',
      url: '/dashboard/personalizacao',
      icon: Palette,
    },
    {
      title: 'Configurações',
      url: '/dashboard/configuracoes',
      icon: Settings,
    },
  ];

  const items = user?.role === 'admin' ? adminItems : comercianteItems;

  return (
    <Sidebar className="border-r bg-card/50 backdrop-blur-sm">
      <SidebarContent className="p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Lovable</h2>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Business Panel'}
              </p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            {user?.role === 'admin' ? 'Administração' : 'Comerciante'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
