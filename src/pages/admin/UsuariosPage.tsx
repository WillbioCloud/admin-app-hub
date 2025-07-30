
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, MoreHorizontal, Eye, Edit, Trash2, Filter } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  comercio: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
  categoria: string;
}

const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nome: 'João da Silva',
    email: 'joao@lojadojoao.com',
    telefone: '(11) 99999-9999',
    comercio: 'Loja do João',
    status: 'ativo',
    dataCadastro: '2024-01-15',
    categoria: 'Alimentação'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@farmacia.com',
    telefone: '(11) 88888-8888',
    comercio: 'Farmácia Central',
    status: 'ativo',
    dataCadastro: '2024-01-10',
    categoria: 'Saúde'
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos@academia.com',
    telefone: '(11) 77777-7777',
    comercio: 'Academia Forte',
    status: 'pendente',
    dataCadastro: '2024-01-20',
    categoria: 'Fitness'
  }
];

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(busca.toLowerCase()) ||
                      usuario.comercio.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || usuario.status === filtroStatus;
    const matchCategoria = filtroCategoria === 'todas' || usuario.categoria === filtroCategoria;
    
    return matchBusca && matchStatus && matchCategoria;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (usuarioId: string, novoStatus: 'ativo' | 'inativo') => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === usuarioId ? { ...usuario, status: novoStatus } : usuario
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os comerciantes cadastrados na plataforma
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
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

          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="Alimentação">Alimentação</SelectItem>
              <SelectItem value="Saúde">Saúde</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Serviços">Serviços</SelectItem>
              <SelectItem value="Varejo">Varejo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
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
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{usuario.nome}</div>
                      <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      <div className="text-sm text-muted-foreground">{usuario.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.comercio}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{usuario.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(usuario.status)}>
                      {usuario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {usuario.status === 'pendente' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(usuario.id, 'ativo')}
                            className="text-green-600"
                          >
                            Aprovar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(usuario.id, 'inativo')}
                            className="text-red-600"
                          >
                            Rejeitar
                          </Button>
                        </>
                      )}
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
