
import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, GamepadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data para demonstração
const mockPendingGamifications = [
  {
    id: '1',
    title: 'Cliente Fiel',
    description: 'Visite o mesmo comércio 5 vezes',
    type: 'code',
    completion_data: 'FIEL123',
    xp_reward: 200,
    coin_reward: 100,
    is_active: true,
    is_unique: false,
    loteamento_id: 'lote_001',
    location_type: 'farmacia',
    comerciante_name: 'João da Silva',
    comercio_name: 'Farmácia Central',
    created_at: '2024-01-20'
  },
  {
    id: '2',
    title: 'Compra do Mês',
    description: 'Faça uma compra acima de R$ 100',
    type: 'qr_code',
    completion_data: 'COMPRA100',
    xp_reward: 300,
    coin_reward: 150,
    is_active: true,
    is_unique: true,
    loteamento_id: 'lote_001',
    location_type: 'supermercado',
    comerciante_name: 'Maria Santos',
    comercio_name: 'Supermercado Bom Preço',
    created_at: '2024-01-22'
  }
];

const mockPendingUsers = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    tipo: 'comerciante',
    comercio: 'Padaria do Carlos',
    created_at: '2024-01-18'
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana@email.com',
    tipo: 'comerciante',
    comercio: 'Loja da Ana',
    created_at: '2024-01-20'
  }
];

export default function AprovacoesPage() {
  const [pendingGamifications, setPendingGamifications] = useState(mockPendingGamifications);
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers);

  const handleApproveGamification = (id: string) => {
    setPendingGamifications(prev => prev.filter(g => g.id !== id));
  };

  const handleRejectGamification = (id: string) => {
    setPendingGamifications(prev => prev.filter(g => g.id !== id));
  };

  const handleApproveUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleRejectUser = (id: string) => {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
        <p className="text-muted-foreground">
          Gerencie pendências de usuários e gamificações
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Pendentes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gamificações Pendentes</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers.length + pendingGamifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList>
          <TabsTrigger value="usuarios">
            Usuários ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="gamificacoes">
            Gamificações ({pendingGamifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Comerciantes aguardando aprovação para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Comércio</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.tipo}</Badge>
                      </TableCell>
                      <TableCell>{user.comercio}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.created_at}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveUser(user.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRejectUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum usuário pendente de aprovação
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Gamificações Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Missões criadas pelos comerciantes aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Comerciante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recompensas</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingGamifications.map((gamification) => (
                    <TableRow key={gamification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.comerciante_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.comercio_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={gamification.type === 'qr_code' ? 'default' : 'secondary'}>
                          {gamification.type === 'qr_code' ? 'QR Code' : 'Código'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{gamification.xp_reward} XP</div>
                          <div>{gamification.coin_reward} Moedas</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{gamification.location_type}</div>
                          <div className="text-muted-foreground">{gamification.loteamento_id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {gamification.created_at}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveGamification(gamification.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRejectGamification(gamification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pendingGamifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma gamificação pendente de aprovação
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
