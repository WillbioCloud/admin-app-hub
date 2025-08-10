
import React, { useState } from 'react';
import { Plus, Edit, Trash2, GamepadIcon, CheckCircle, XCircle, QrCode, Eye } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GamificationDialog } from '@/components/gamification/GamificationDialog';
import { QRCodeViewer } from '@/components/gamification/QRCodeViewer';
import { useGamifications, useDeleteGamification, useApproveGamification, useRejectGamification, Gamification } from '@/hooks/useGamifications';
import { useCreateNotification } from '@/hooks/useNotifications';

export default function GamificacoesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGamification, setEditingGamification] = useState<Gamification | null>(null);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedGamification, setSelectedGamification] = useState<Gamification | null>(null);

  const { data: gamifications = [], isLoading, error } = useGamifications();
  const deleteGamification = useDeleteGamification();
  const approveGamification = useApproveGamification();
  const rejectGamification = useRejectGamification();
  const createNotification = useCreateNotification();

  const handleCreate = () => {
    setEditingGamification(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (gamification: Gamification) => {
    setEditingGamification(gamification);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteGamification.mutate({ id });
  };

  const handleApprove = async (gamification: Gamification) => {
    try {
      // Aprovar a missão
      await approveGamification.mutateAsync({ id: gamification.id });
      
      // Criar notificação para o app
      await createNotification.mutateAsync({
        title: `Nova missão aprovada: ${gamification.title}`,
        message: `A missão "${gamification.title}" foi aprovada e está disponível no app!`,
        type: 'nova_missao',
        metadata: { mission_id: gamification.id },
        user_id: null // null = notificação global
      });
    } catch (error) {
      console.error('Erro ao aprovar gamificação:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectGamification.mutateAsync({ id });
    } catch (error) {
      console.error('Erro ao rejeitar gamificação:', error);
    }
  };

  const handleViewQRCode = (gamification: Gamification) => {
    setSelectedGamification(gamification);
    setQrCodeDialogOpen(true);
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gamificações</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie as missões e recompensas do aplicativo
          </p>
        </div>
        <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Gamificação
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Missões</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{gamifications.length}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <GamepadIcon className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Aprovadas</CardTitle>
              <div className="text-3xl font-bold text-green-600 mt-2">{approvedGamifications.length}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
              <div className="text-3xl font-bold text-yellow-600 mt-2">{pendingGamifications.length}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <GamepadIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total XP Disponível</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">
                {gamifications.reduce((sum, g) => sum + g.xp_reward, 0)}
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <GamepadIcon className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Gamificações</CardTitle>
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
                <TableHead>Criado por</TableHead>
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
                     <div className="text-sm">
                       <div className="font-medium">Carregando nome...</div>
                       <div className="text-muted-foreground">ID: {gamification.created_by || 'Sistema'}</div>
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
                            onClick={() => handleApprove(gamification)}
                            disabled={false}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReject(gamification.id)}
                            disabled={false}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {gamification.type === 'qr_code' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewQRCode(gamification)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
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

      <Dialog open={qrCodeDialogOpen} onOpenChange={setQrCodeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code da Missão
            </DialogTitle>
            <DialogDescription>
              QR Code para a missão: {selectedGamification?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center">
            {selectedGamification && (
              <QRCodeViewer
                data={selectedGamification.completion_data}
                title={selectedGamification.title}
                size={200}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
