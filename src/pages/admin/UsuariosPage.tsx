
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Edit, Trash2, Smartphone, Monitor, Users } from 'lucide-react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { NovoUsuarioDialog } from '@/components/admin/NovoUsuarioDialog';

const UsuariosPage = () => {
  const { 
    usuarios, 
    totalUsers, 
    usuariosAtivos, 
    usuariosPendentes, 
    usuariosWebApp, 
    usuariosMobileApp,
    isLoading 
  } = useUsuarios();
  
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.comercio.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || usuario.status === filtroStatus;
    const matchTipo = filtroTipo === 'todos' || usuario.tipo === filtroTipo;
    
    return matchBusca && matchStatus && matchTipo;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'mobile_app' ? 
      <Smartphone className="h-4 w-4" /> : 
      <Monitor className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gerenciar Usuários</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie todos os usuários cadastrados na plataforma
          </p>
        </div>
        <NovoUsuarioDialog />
      </div>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Usuários</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{totalUsers}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Users className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
              <div className="text-3xl font-bold text-green-600 mt-2">{usuariosAtivos}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Pendentes</CardTitle>
              <div className="text-3xl font-bold text-yellow-600 mt-2">{usuariosPendentes}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Web / Mobile</CardTitle>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span className="font-bold text-foreground">{usuariosWebApp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="font-bold text-foreground">{usuariosMobileApp}</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Monitor className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou comércio..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="web_app">Web App</SelectItem>
              <SelectItem value="mobile_app">Mobile App</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Usuários</CardTitle>
          <CardDescription>
            {usuariosFiltrados.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Comércio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium">{usuario.nome}</div>
                      <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      <div className="text-sm text-muted-foreground">{usuario.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{usuario.comercio}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{usuario.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoIcon(usuario.tipo)}
                      <span className="text-sm">
                        {usuario.tipo === 'mobile_app' ? 'Mobile' : 'Web'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(usuario.status)}>
                      {usuario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-green-100 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-100 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsuariosPage;
