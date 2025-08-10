import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Plus, Edit, Trash2, Crown, Star, Gem } from 'lucide-react';
import { useAchievements, useDeleteAchievement, Achievement } from '@/hooks/useAchievements';
import { AchievementDialog } from '@/components/admin/AchievementDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function ConquistasPage() {
  const { data: achievements = [], isLoading, isError, error, refetch } = useAchievements();
  const deleteAchievement = useDeleteAchievement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingAchievement(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
  };

  const confirmDelete = () => {
    if (achievementToDelete) {
      deleteAchievement.mutate({ id: achievementToDelete.id });
      setAchievementToDelete(null);
    }
  };

  const getRarityIcon = (rarity: string | null) => {
    switch (rarity?.toLowerCase()) {
      case 'épico':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'raro':
        return <Gem className="h-4 w-4 text-blue-600" />;
      case 'comum':
        return <Star className="h-4 w-4 text-gray-600" />;
      default:
        return <Trophy className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getRarityVariant = (rarity: string | null): "default" | "secondary" | "destructive" | "outline" => {
    switch (rarity?.toLowerCase()) {
      case 'épico':
        return 'default';
      case 'raro':
        return 'secondary';
      case 'comum':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getRarityColor = (rarity: string | null): string => {
    switch (rarity?.toLowerCase()) {
      case 'épico':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'raro':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'comum':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    }
  };

  // Estatísticas
  const totalAchievements = achievements.length;
  const epicAchievements = achievements.filter(a => a.rarity?.toLowerCase() === 'épico').length;
  const rareAchievements = achievements.filter(a => a.rarity?.toLowerCase() === 'raro').length;
  const commonAchievements = achievements.filter(a => a.rarity?.toLowerCase() === 'comum').length;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-10">
        <p className="font-semibold">Erro ao carregar conquistas.</p>
        <p className="text-xs mt-2">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Conquistas</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie as conquistas que os usuários podem desbloquear
          </p>
        </div>
        <Button onClick={handleCreate} className="hover:shadow-lg transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conquista
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{totalAchievements}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Épicas</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-2">{epicAchievements}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Raras</CardTitle>
              <div className="text-3xl font-bold text-blue-600 mt-2">{rareAchievements}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Gem className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Comuns</CardTitle>
              <div className="text-3xl font-bold text-gray-600 mt-2">{commonAchievements}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Star className="h-6 w-6 text-gray-600" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabela de Conquistas */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Conquistas</CardTitle>
          <CardDescription>
            Todas as conquistas disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ícone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Raridade</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.map((achievement) => (
                <TableRow key={achievement.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    {achievement.icon_url ? (
                      <img 
                        src={achievement.icon_url} 
                        alt={achievement.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getRarityIcon(achievement.rarity)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{achievement.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{achievement.description}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRarityVariant(achievement.rarity)} 
                      className={getRarityColor(achievement.rarity)}
                    >
                      {getRarityIcon(achievement.rarity)}
                      <span className="ml-1">{achievement.rarity || 'Comum'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(achievement.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(achievement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(achievement)}
                        className="hover:bg-red-100 hover:text-red-600"
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

      {/* Dialog de Criação/Edição */}
      <AchievementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        achievement={editingAchievement}
        onSuccess={refetch}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!achievementToDelete} onOpenChange={() => setAchievementToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir a conquista "{achievementToDelete?.name}"?
              Esta ação não pode ser desfeita.
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