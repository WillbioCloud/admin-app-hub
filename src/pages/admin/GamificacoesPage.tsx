
import React, { useState } from 'react';
import { Plus, Edit, Trash2, GamepadIcon } from 'lucide-react';
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
import { toast } from 'sonner';

// Mock data para demonstração
const mockGamifications = [
  {
    id: '1',
    title: 'Primeira Compra',
    description: 'Complete sua primeira compra no supermercado',
    type: 'qr_code' as const,
    completion_data: 'SUPER001',
    xp_reward: 100,
    coin_reward: 50,
    is_active: true,
    is_unique: true,
    loteamento_id: 'lote_001',
    location_type: 'supermercado'
  },
  {
    id: '2',
    title: 'Cliente Fiel',
    description: 'Visite o mesmo comércio 5 vezes',
    type: 'code' as const,
    completion_data: 'FIEL123',
    xp_reward: 200,
    coin_reward: 100,
    is_active: true,
    is_unique: false,
    loteamento_id: 'lote_001',
    location_type: 'farmacia'
  }
];

export default function GamificacoesPage() {
  const [gamifications, setGamifications] = useState(mockGamifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGamification, setEditingGamification] = useState<any>(null);

  const handleCreate = () => {
    setEditingGamification(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (gamification: any) => {
    setEditingGamification(gamification);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingGamification) {
      // Atualizar gamificação existente
      setGamifications(prev =>
        prev.map(g =>
          g.id === editingGamification.id
            ? { ...g, ...data }
            : g
        )
      );
      toast.success('Gamificação atualizada com sucesso!');
    } else {
      // Criar nova gamificação
      const newGamification = {
        id: Date.now().toString(),
        ...data
      };
      setGamifications(prev => [...prev, newGamification]);
      toast.success('Gamificação criada com sucesso!');
    }
  };

  const handleDelete = (id: string) => {
    setGamifications(prev => prev.filter(g => g.id !== id));
    toast.success('Gamificação excluída com sucesso!');
  };

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
            <CardTitle className="text-sm font-medium">Missões Ativas</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gamifications.filter(g => g.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missões Únicas</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gamifications.filter(g => g.is_unique).length}
            </div>
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
                      <Badge variant={gamification.is_active ? 'default' : 'secondary'}>
                        {gamification.is_active ? 'Ativa' : 'Inativa'}
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
        onSubmit={handleSubmit}
        userRole="admin"
      />
    </div>
  );
}
