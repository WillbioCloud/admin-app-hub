
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Store, MapPin, Clock, Phone, Instagram, Eye, Edit, Trash2 } from 'lucide-react';

interface Comercio {
  id: string;
  nome: string;
  categoria: string;
  endereco: string;
  telefone: string;
  instagram?: string;
  proprietario: string;
  status: 'ativo' | 'inativo' | 'pendente';
  layout: 'moderno' | 'classico';
  cor: string;
  avaliacoes: number;
  nota: number;
}

const mockComercios: Comercio[] = [
  {
    id: '1',
    nome: 'Loja do João',
    categoria: 'Alimentação',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 99999-9999',
    instagram: '@lojadojoao',
    proprietario: 'João da Silva',
    status: 'ativo',
    layout: 'moderno',
    cor: '#3B82F6',
    avaliacoes: 45,
    nota: 4.8
  },
  {
    id: '2',
    nome: 'Farmácia Central',
    categoria: 'Saúde',
    endereco: 'Av. Principal, 456 - Centro',
    telefone: '(11) 88888-8888',
    proprietario: 'Maria Santos',
    status: 'ativo',
    layout: 'classico',
    cor: '#10B981',
    avaliacoes: 67,
    nota: 4.9
  },
  {
    id: '3',
    nome: 'Academia Forte',
    categoria: 'Fitness',
    endereco: 'Rua dos Esportes, 789 - Jardim',
    telefone: '(11) 77777-7777',
    instagram: '@academiaforte',
    proprietario: 'Carlos Oliveira',
    status: 'pendente',
    layout: 'moderno',
    cor: '#F59E0B',
    avaliacoes: 23,
    nota: 4.5
  }
];

const ComerciosPage = () => {
  const [comercios, setComercios] = useState<Comercio[]>(mockComercios);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  const comerciosFiltrados = comercios.filter(comercio => {
    const matchBusca = comercio.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      comercio.proprietario.toLowerCase().includes(busca.toLowerCase()) ||
                      comercio.endereco.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || comercio.status === filtroStatus;
    const matchCategoria = filtroCategoria === 'todas' || comercio.categoria === filtroCategoria;
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Comércios</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os estabelecimentos cadastrados
          </p>
        </div>
        <Button>
          <Store className="h-4 w-4 mr-2" />
          Novo Comércio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comércios</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comercios.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comercios.filter(c => c.status === 'ativo').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <div className="h-2 w-2 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {comercios.filter(c => c.status === 'pendente').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <div className="h-4 w-4 text-yellow-500">⭐</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(comercios.reduce((acc, c) => acc + c.nota, 0) / comercios.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, proprietário ou endereço..."
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
              <SelectItem value="Saúde e Fitness">Saúde e Fitness</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Serviços">Serviços</SelectItem>
              <SelectItem value="Varejo">Varejo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estabelecimentos</CardTitle>
          <CardDescription>
            {comerciosFiltrados.length} estabelecimento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comércio</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Avaliações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comerciosFiltrados.map((comercio) => (
                <TableRow key={comercio.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: comercio.cor }}
                        />
                        {comercio.nome}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {comercio.endereco}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{comercio.proprietario}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{comercio.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {comercio.telefone}
                      </div>
                      {comercio.instagram && (
                        <div className="flex items-center text-muted-foreground">
                          <Instagram className="h-3 w-3 mr-1" />
                          {comercio.instagram}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={comercio.layout === 'moderno' ? 'default' : 'secondary'}>
                      {comercio.layout}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">⭐ {comercio.nota}</div>
                      <div className="text-xs text-muted-foreground">
                        {comercio.avaliacoes} avaliações
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(comercio.status)}>
                      {comercio.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
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

export default ComerciosPage;
