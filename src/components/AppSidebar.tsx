
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Home,
  Newspaper,
  Bell,
  Image,
  Store,
  User,
  Settings,
  LogOut,
  Palette
} from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const adminMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Novidades', url: '/dashboard/news', icon: Newspaper },
  { title: 'Notificações', url: '/dashboard/alerts', icon: Bell },
  { title: 'Mídias', url: '/dashboard/media', icon: Image },
  { title: 'Comércios', url: '/dashboard/comercios', icon: Store },
];

const comercianteMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Perfil do Comércio', url: '/dashboard/perfil', icon: User },
  { title: 'Personalização', url: '/dashboard/customizacao', icon: Palette },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const menuItems = user?.role === 'admin' ? adminMenuItems : comercianteMenuItems;

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {user?.role === 'admin' ? 'A' : 'C'}
            </span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
