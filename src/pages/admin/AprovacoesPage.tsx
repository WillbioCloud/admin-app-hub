
import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Store, GamepadIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePendingComercios, useApproveComercio, useRejectComercio } from '@/hooks/useComercios';
import { useGamifications } from '@/hooks/useGamifications';
import { useCreateNotification } from '@/hooks/useNotifications';
import { ComercioPreview } from '@/components/admin/ComercioPreview';

export default function AprovacoesPage() {
  const { data: pendingComercios = [], isLoading: isLoadingComercios } = usePendingComercios();
  const { data: gamifications = [], isLoading: isLoadingGamifications } = useGamifications();
  const approveComercio = useApproveComercio();
  const rejectComercio = useRejectComercio();
  const createNotification = useCreateNotification();

  const pendingGamifications = gamifications.filter(g => g.status === 'pending');

  const handleApproveComercio = async (comercio: any) => {
    try {
      await approveComercio.mutateAsync(comercio.id);
      // Criar notificação para o comerciante
      await createNotification.mutateAsync({
        title: 'Comércio Aprovado!',
        message: `Seu comércio "${comercio.nome}" foi aprovado e já está disponível na plataforma.`,
        type: 'novo_comercio',
        metadata: { comercio_id: comercio.id },
        user_id: comercio.user_id
      });
    } catch (error) {
      console.error('Erro ao aprovar comércio:', error);
    }
  };

  const handleRejectComercio = async (comercio: any) => {
    try {
      await rejectComercio.mutateAsync(comercio.id);
      // Criar notificação para o comerciante
      await createNotification.mutateAsync({
        title: 'Comércio Rejeitado',
        message: `Seu comércio "${comercio.nome}" foi rejeitado. Entre em contato para mais informações.`,
        type: 'novo_comercio',
        metadata: { comercio_id: comercio.id },
        user_id: comercio.user_id
      });
    } catch (error) {
      console.error('Erro ao rejeitar comércio:', error);
    }
  };

  const handleApproveGamification = (id: string) => {
    // TODO: Implementar aprovação de gamificação
    console.log('Aprovar gamificação:', id);
  };

  const handleRejectGamification = (id: string) => {
    // TODO: Implementar rejeição de gamificação
    console.log('Rejeitar gamificação:', id);
  };

  if (isLoadingComercios || isLoadingGamifications) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
        <p className="text-muted-foreground">
          Gerencie comércios e gamificações pendentes de aprovação
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comércios Pendentes</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComercios.length}</div>
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
            <div className="text-2xl font-bold">{pendingComercios.length + pendingGamifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comercios" className="w-full">
        <TabsList>
          <TabsTrigger value="comercios">
            Comércios ({pendingComercios.length})
          </TabsTrigger>
          <TabsTrigger value="gamificacoes">
            Gamificações ({pendingGamifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comercios">
          <Card>
            <CardHeader>
              <CardTitle>Comércios Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Comércios cadastrados pelos comerciantes aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Layout</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingComercios.map((comercio) => (
                    <TableRow key={comercio.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{comercio.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            {comercio.descricao?.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{comercio.categoria || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {comercio.layout_template || 'moderno'}
                          </Badge>
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: comercio.primary_color || '#3B82F6' }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(comercio.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Preview do Comércio - {comercio.nome}</DialogTitle>
                              </DialogHeader>
                              <ComercioPreview comercio={comercio} />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveComercio(comercio)}
                            disabled={approveComercio.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRejectComercio(comercio)}
                            disabled={rejectComercio.isPending}
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
              {pendingComercios.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum comércio pendente de aprovação
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
                          <div className="font-medium">Comerciante</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.created_by || 'N/A'}
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
