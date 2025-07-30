
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, User, Store, Palette, FileText, Image } from 'lucide-react';

interface Aprovacao {
  id: string;
  tipo: 'perfil' | 'layout' | 'conteudo';
  comercio: string;
  proprietario: string;
  dataEnvio: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  alteracoes: string[];
  observacoes?: string;
}

const mockAprovacoes: Aprovacao[] = [
  {
    id: '1',
    tipo: 'layout',
    comercio: 'Loja do João',
    proprietario: 'João da Silva',
    dataEnvio: '2024-01-25',
    status: 'pendente',
    alteracoes: ['Mudança de layout para moderno', 'Alteração de cor primária para #3B82F6']
  },
  {
    id: '2',
    tipo: 'perfil',
    comercio: 'Farmácia Central',
    proprietario: 'Maria Santos',
    dataEnvio: '2024-01-24',
    status: 'pendente',
    alteracoes: ['Atualização de descrição', 'Novos horários de funcionamento', 'Adição de serviço: Entrega 24h']
  },
  {
    id: '3',
    tipo: 'conteudo',
    comercio: 'Academia Forte',
    proprietario: 'Carlos Oliveira',
    dataEnvio: '2024-01-23',
    status: 'aprovada',
    alteracoes: ['Upload de novas fotos da academia', 'Atualização do logo']
  },
  {
    id: '4',
    tipo: 'perfil',
    comercio: 'Padaria do Bairro',
    proprietario: 'Ana Costa',
    dataEnvio: '2024-01-22',
    status: 'rejeitada',
    alteracoes: ['Mudança de categoria', 'Atualização de endereço'],
    observacoes: 'Documentação inadequada para mudança de endereço'
  }
];

const AprovacoesPage = () => {
  const [aprovacoes, setAprovacoes] = useState<Aprovacao[]>(mockAprovacoes);
  const [filtro, setFiltro] = useState<'todas' | 'pendente' | 'aprovada' | 'rejeitada'>('todas');

  const aprovacoesFiltradas = aprovacoes.filter(aprovacao => 
    filtro === 'todas' || aprovacao.status === filtro
  );

  const handleAprovar = (id: string) => {
    setAprovacoes(aprovacoes.map(aprovacao =>
      aprovacao.id === id ? { ...aprovacao, status: 'aprovada' as const } : aprovacao
    ));
  };

  const handleRejeitar = (id: string, observacoes: string) => {
    setAprovacoes(aprovacoes.map(aprovacao =>
      aprovacao.id === id ? { ...aprovacao, status: 'rejeitada' as const, observacoes } : aprovacao
    ));
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'perfil': return <User className="h-4 w-4" />;
      case 'layout': return <Palette className="h-4 w-4" />;
      case 'conteudo': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'perfil': return 'bg-blue-100 text-blue-800';
      case 'layout': return 'bg-purple-100 text-purple-800';
      case 'conteudo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'aprovada': return <CheckCircle className="h-4 w-4" />;
      case 'rejeitada': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sistema de Aprovações</h2>
        <p className="text-muted-foreground">
          Gerencie todas as solicitações de alterações dos comerciantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {aprovacoes.filter(a => a.status === 'pendente').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando análise
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {aprovacoes.filter(a => a.status === 'aprovada').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {aprovacoes.filter(a => a.status === 'rejeitada').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">
              Para aprovação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para filtrar */}
      <Tabs value={filtro} onValueChange={(value) => setFiltro(value as any)}>
        <TabsList>
          <TabsTrigger value="todas">Todas ({aprovacoes.length})</TabsTrigger>
          <TabsTrigger value="pendente">
            Pendentes ({aprovacoes.filter(a => a.status === 'pendente').length})
          </TabsTrigger>
          <TabsTrigger value="aprovada">
            Aprovadas ({aprovacoes.filter(a => a.status === 'aprovada').length})
          </TabsTrigger>
          <TabsTrigger value="rejeitada">
            Rejeitadas ({aprovacoes.filter(a => a.status === 'rejeitada').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filtro} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Aprovação</CardTitle>
              <CardDescription>
                {aprovacoesFiltradas.length} solicitação(ões) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Comércio</TableHead>
                    <TableHead>Alterações</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aprovacoesFiltradas.map((aprovacao) => (
                    <TableRow key={aprovacao.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTipoColor(aprovacao.tipo)}>
                            {getTipoIcon(aprovacao.tipo)}
                            <span className="ml-1 capitalize">{aprovacao.tipo}</span>
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{aprovacao.comercio}</div>
                          <div className="text-sm text-muted-foreground">
                            {aprovacao.proprietario}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <ul className="text-sm space-y-1">
                            {aprovacao.alteracoes.map((alteracao, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-gray-300 rounded-full mr-2 mt-2 flex-shrink-0" />
                                {alteracao}
                              </li>
                            ))}
                          </ul>
                          {aprovacao.observacoes && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                              <strong>Observações:</strong> {aprovacao.observacoes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(aprovacao.dataEnvio).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(aprovacao.status)}>
                          {getStatusIcon(aprovacao.status)}
                          <span className="ml-1 capitalize">{aprovacao.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {aprovacao.status === 'pendente' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAprovar(aprovacao.id)}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRejeitar(aprovacao.id, 'Precisa de mais informações')}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AprovacoesPage;
