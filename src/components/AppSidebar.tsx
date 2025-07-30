
import { Home, Users, FileText, Bell, Store, Settings, Palette, User } from 'lucide-react';
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
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Usuários',
      url: '/dashboard/usuarios',
      icon: Users,
    },
    {
      title: 'Novidades',
      url: '/dashboard/novidades',
      icon: FileText,
    },
    {
      title: 'Notificações',
      url: '/dashboard/notificacoes',
      icon: Bell,
    },
    {
      title: 'Comércios',
      url: '/dashboard/comercios',
      icon: Store,
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.role === 'admin' ? 'Administração' : 'Comerciante'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
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
