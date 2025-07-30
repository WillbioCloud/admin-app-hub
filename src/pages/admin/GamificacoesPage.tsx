
import React, { useState } from 'react';
import { Plus, Edit, Trash2, GamepadIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { GamificationDialog } from '@/components/gamification/GamificationDialog';
import { useGamifications, useDeleteGamification, useApproveGamification, useRejectGamification, Gamification } from '@/hooks/useGamifications';

export default function GamificacoesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGamification, setEditingGamification] = useState<Gamification | null>(null);

  const { data: gamifications = [], isLoading, error } = useGamifications();
  const deleteGamification = useDeleteGamification();
  const approveGamification = useApproveGamification();
  const rejectGamification = useRejectGamification();

  const handleCreate = () => {
    setEditingGamification(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (gamification: Gamification) => {
    setEditingGamification(gamification);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteGamification.mutate(id);
  };

  const handleApprove = (id: string) => {
    approveGamification.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectGamification.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando gamificações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro ao carregar gamificações</div>
      </div>
    );
  }

  const approvedGamifications = gamifications.filter(g => g.status === 'approved');
  const pendingGamifications = gamifications.filter(g => g.status === 'pending');
  const rejectedGamifications = gamifications.filter(g => g.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamificações</h1>
          <p className="text-muted-foreground">
            Gerencie as missões e recompensas do aplicativo
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Gamificação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Missões</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedGamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <GamepadIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP Disponível</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gamifications.reduce((sum, g) => sum + g.xp_reward, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Gamificações</CardTitle>
          <CardDescription>
            Gerencie todas as missões e recompensas disponíveis no aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Recompensas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gamifications.map((gamification) => (
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
                    <div className="flex gap-1">
                      <Badge 
                        variant={
                          gamification.status === 'approved' ? 'default' : 
                          gamification.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {gamification.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {gamification.status === 'pending' && '⏳ '}
                        {gamification.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {gamification.status === 'approved' ? 'Aprovada' : 
                         gamification.status === 'pending' ? 'Pendente' : 'Rejeitada'}
                      </Badge>
                      {gamification.is_unique && (
                        <Badge variant="outline">Única</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{gamification.location_type}</div>
                      <div className="text-muted-foreground">{gamification.loteamento_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {gamification.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(gamification.id)}
                            disabled={approveGamification.isPending}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(gamification.id)}
                            disabled={rejectGamification.isPending}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(gamification)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a gamificação "{gamification.title}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(gamification.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GamificationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        gamification={editingGamification}
        onSubmit={() => setIsDialogOpen(false)}
        userRole="admin"
      />
    </div>
  );
}
