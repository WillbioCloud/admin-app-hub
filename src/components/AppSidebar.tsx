import { NavLink } from 'react-router-dom';
import { Home, Package, Users, LineChart, Settings, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navLinkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
const activeLinkClasses = "bg-muted text-primary";

export function AppSidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/admin" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span className="">Admin Hub</span>
          </NavLink>
          <button className="ml-auto h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/comercios"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Package className="h-4 w-4" />
              Comércios
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </NavLink>
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <Users className="h-4 w-4" />
              Usuários
            </NavLink>
            <NavLink
              to="/admin/relatorios"
              className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <LineChart className="h-4 w-4" />
              Relatórios
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <NavLink to="/admin/perfil" className={navLinkClasses}>
            <Settings className="h-4 w-4" />
            Configurações
          </NavLink>
        </div>
      </div>
    </div>
  );
}