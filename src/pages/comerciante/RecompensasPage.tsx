import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Gift, Coins, Package } from 'lucide-react';
import { useRewards, useDeleteReward, Reward } from '@/hooks/useRewards';
import { RewardDialog } from '@/components/rewards/RewardDialog';

export default function RecompensasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);

  const { data: rewards, isLoading, error } = useRewards();
  const deleteReward = useDeleteReward();

  const handleCreate = () => {
    setEditingReward(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRewardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (rewardToDelete) {
      await deleteReward.mutateAsync(rewardToDelete);
      setDeleteDialogOpen(false);
      setRewardToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Carregando recompensas...</div>;
  }

  if (error) {
    return <div>Erro ao carregar recompensas: {error.message}</div>;
  }

  const activeRewards = rewards?.filter(r => r.is_active) || [];
  const inactiveRewards = rewards?.filter(r => !r.is_active) || [];
  const totalValue = rewards?.reduce((sum, r) => sum + r.coin_cost, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Minhas Recompensas</h1>
          <p className="text-muted-foreground">
            Gerencie as recompensas do seu estabelecimento
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Recompensa
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recompensas</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewards?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeRewards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{inactiveRewards.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue} moedas</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de recompensas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Recompensas</CardTitle>
          <CardDescription>
            Todas as recompensas do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards?.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    {reward.image_url ? (
                      <img 
                        src={reward.image_url} 
                        alt={reward.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Gift className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{reward.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {reward.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                      {reward.coin_cost}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reward.stock ? reward.stock : 'Ilimitado'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{reward.created_by ? 'Usuário logado' : 'Sistema'}</div>
                      <div className="text-muted-foreground">ID: {reward.created_by || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reward.is_active ? 'default' : 'secondary'}>
                      {reward.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(reward.id)}
                      >
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

      {/* Dialog para criar/editar recompensa */}
      <RewardDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingReward={editingReward}
      />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta recompensa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}