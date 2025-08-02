import { Home, Users, FileText, Bell, Store, Settings, Palette, User, GamepadIcon, Newspaper, Search, Menu, Sun, Moon, Gift, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import fbzLogo from '@/assets/fbz-logo.png';
export function AppSidebar() {
  const {
    user
  } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const navigationItems = [{
    title: 'Dashboard',
    url: user?.role === 'admin' ? '/admin/dashboard' : '/dashboard',
    icon: Home,
    color: 'text-blue-500'
  }, {
    title: 'Usuários',
    url: '/admin/usuarios',
    icon: Users,
    color: 'text-green-500',
    adminOnly: true
  }, {
    title: 'Comércios',
    url: '/admin/comercios',
    icon: Store,
    color: 'text-purple-500',
    adminOnly: true
  }, {
    title: 'Mapa',
    url: '/admin/mapa',
    icon: MapPin,
    color: 'text-emerald-500',
    adminOnly: true
  }, {
    title: 'Categorias',
    url: '/admin/categorias',
    icon: FileText,
    color: 'text-orange-500',
    adminOnly: true
  }, {
    title: 'Perfil',
    url: user?.role === 'admin' ? '/admin/perfil' : '/dashboard/perfil',
    icon: User,
    color: 'text-pink-500'
  }];
  const appItems = [{
    title: 'Gamificações',
    url: user?.role === 'admin' ? '/admin/gamificacoes' : '/dashboard/gamificacoes',
    icon: GamepadIcon,
    color: 'text-red-500'
  }, {
    title: 'Recompensas',
    url: user?.role === 'admin' ? '/admin/recompensas' : '/dashboard/recompensas',
    icon: Gift,
    color: 'text-amber-500'
  }, {
    title: 'Notificações',
    url: '/admin/notificacoes',
    icon: Bell,
    color: 'text-yellow-500',
    adminOnly: true
  }, {
    title: 'Notícias',
    url: '/admin/noticias',
    icon: Newspaper,
    color: 'text-cyan-500',
    adminOnly: true
  }, {
    title: 'Aprovações',
    url: '/admin/aprovacoes',
    icon: Bell,
    color: 'text-indigo-500',
    adminOnly: true
  }, {
    title: 'Relatórios',
    url: '/admin/relatorios',
    icon: FileText,
    color: 'text-teal-500',
    adminOnly: true
  }, {
    title: 'Personalização',
    url: '/dashboard/personalizacao',
    icon: Palette,
    color: 'text-violet-500',
    comercianteOnly: true
  }, {
    title: 'Configurações',
    url: '/dashboard/configuracoes',
    icon: Settings,
    color: 'text-gray-500',
    comercianteOnly: true
  }];
  const filteredNavigationItems = navigationItems.filter(item => !item.adminOnly || user?.role === 'admin');
  const filteredAppItems = appItems.filter(item => (!item.adminOnly || user?.role === 'admin') && (!item.comercianteOnly || user?.role === 'comerciante'));
  return <Sidebar className="border-r bg-white dark:bg-gray-900 shadow-lg">
      <SidebarContent className="flex flex-col h-full">
        {/* Header com Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src={fbzLogo} alt="FBZ Logo" className="w-8 h-8 rounded" />
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">FBZ</h2>
            </div>
          </div>
          
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search" className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <SidebarGroup className="px-4 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {filteredNavigationItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({
                    isActive
                  }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* APP Section */}
          <SidebarGroup className="px-4 py-2">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              APP
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {filteredAppItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={({
                    isActive
                  }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Upgrade Card */}
          

          {/* Upgrade Plan Button */}
          

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-gray-500" />
              <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer" onClick={() => setIsDark(!isDark)}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <Moon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>;
}