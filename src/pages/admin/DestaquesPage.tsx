import React, { useState } from 'react';
import { Plus, Sparkles, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoteamentoDestaqueDialog } from '@/components/admin/LoteamentoDestaqueDialog';
import { 
  useLoteamentoDestaques, 
  useDeleteLoteamentoDestaque, 
  useToggleLoteamentoDestaque,
  type LoteamentoDestaque 
} from '@/hooks/useLoteamentoDestaques';

export default function DestaquesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLoteamento, setSelectedLoteamento] = useState<LoteamentoDestaque | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loteamentoToDelete, setLoteamentoToDelete] = useState<LoteamentoDestaque | null>(null);

  const { data: loteamentos = [], isLoading } = useLoteamentoDestaques();
  const deleteMutation = useDeleteLoteamentoDestaque();
  const toggleMutation = useToggleLoteamentoDestaque();

  const handleEdit = (loteamento: LoteamentoDestaque) => {
    setSelectedLoteamento(loteamento);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedLoteamento(null);
    setDialogOpen(true);
  };

  const handleDelete = (loteamento: LoteamentoDestaque) => {
    setLoteamentoToDelete(loteamento);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (loteamentoToDelete) {
      await deleteMutation.mutateAsync(loteamentoToDelete.id);
      setDeleteDialogOpen(false);
      setLoteamentoToDelete(null);
    }
  };

  const handleToggleActive = async (loteamento: LoteamentoDestaque) => {
    await toggleMutation.mutateAsync({
      id: loteamento.id,
      ativo: !loteamento.ativo,
    });
  };

  const activeLoteamentos = loteamentos.filter(l => l.ativo);
  const inactiveLoteamentos = loteamentos.filter(l => !l.ativo);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destaques dos Loteamentos</h1>
          <p className="text-muted-foreground">
            Gerencie quais loteamentos aparecerão com destaque animado no aplicativo
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Loteamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Loteamentos</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Destaque Ativo</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeLoteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Destaque</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveLoteamentos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Loteamentos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lista de Loteamentos</h2>
        
        {loteamentos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum loteamento cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro loteamento para gerenciar os destaques
              </p>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Loteamento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {loteamentos.map((loteamento) => (
              <Card key={loteamento.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {loteamento.nome}
                        {loteamento.ativo && (
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Destaque Ativo
                          </Badge>
                        )}
                        {!loteamento.ativo && (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Sem Destaque
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {loteamento.loteamento_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={loteamento.ativo ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(loteamento)}
                        disabled={toggleMutation.isPending}
                        className="gap-2"
                      >
                        {loteamento.ativo ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(loteamento)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(loteamento)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Criado em: {new Date(loteamento.created_at).toLocaleDateString('pt-BR')}</span>
                    <span>Atualizado em: {new Date(loteamento.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog para criar/editar */}
      <LoteamentoDestaqueDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        loteamento={selectedLoteamento}
      />

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o loteamento "{loteamentoToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}