import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Store, CheckCircle, XCircle, Plus, Eye, Trash2, User } from 'lucide-react';
import { useComercios, useUpdateComercioAtivoStatus, Comercio } from '@/hooks/useComercios';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComercioPreviewDialog } from '@/components/admin/ComercioPreviewDialog';
import { ComercioDialog } from '@/components/admin/ComercioDialog';

/**
 * ComerciosPage Unificada (Versão Final)
 * Este componente combina o layout rico do código antigo com a lógica funcional do novo.
 * - Exibe cards de resumo (Total, Visíveis, Não Visíveis).
 * - Lista TODOS os comércios usando o hook `useComercios`.
 * - Exibe o nome do usuário que criou o comércio.
 * - Permite ativar/inativar a visibilidade de cada comércio com um Switch funcional.
 * - Mostra o status de aprovação com badges coloridos e informativos.
 * - Adiciona tooltips (dicas de ferramenta) em todos os elementos interativos para melhor usabilidade.
 */
export function ComerciosPage() {
  const { data: comercios = [], isLoading, isError, error, refetch } = useComercios();
  const updateStatusMutation = useUpdateComercioAtivoStatus();
  const [selectedComercio, setSelectedComercio] = useState<Comercio | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Função para ativar/inativar a visibilidade do comércio.
  const handleVisibilityToggle = (id: string, currentStatus: boolean | null) => {
    if (currentStatus === null) return;
    updateStatusMutation.mutate({ id, newStatus: !currentStatus });
  };

  // Função para visualizar o comércio
  const handleViewComercio = (comercio: Comercio) => {
    setSelectedComercio(comercio);
    setPreviewDialogOpen(true);
  };

  // Função para lidar com o sucesso da criação do comércio
  const handleCreateSuccess = () => {
    refetch();
  };

  // Funções para estilizar o badge de status de aprovação.
  const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'approved': return 'default';
        case 'pending': return 'secondary';
        case 'rejected': return 'destructive';
        default: return 'outline';
    }
  }
  const getStatusClass = (status: string | null | undefined): string => {
    switch (status) {
        case 'approved': return 'bg-green-500 hover:bg-green-600';
        case 'pending': return 'bg-yellow-500 text-black hover:bg-yellow-600';
        case 'rejected': return 'bg-red-500 hover:bg-red-600';
        default: return '';
    }
  }

  // Cálculos para os cards de resumo.
  const ativos = comercios.filter(c => c.ativo).length;
  const inativos = comercios.length - ativos;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 p-10">
        <p className="font-semibold">Erro ao carregar a lista de comércios.</p>
        <p className="text-xs mt-2">{error?.message}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Comércios</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Gerencie todos os estabelecimentos cadastrados na plataforma.
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => setCreateDialogOpen(true)} className="hover:shadow-lg transition-shadow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Comércio
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar um novo estabelecimento manualmente.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                <div className="text-3xl font-bold text-foreground mt-2">{comercios.length}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg"><Store className="h-6 w-6 text-foreground" /></div>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Visíveis (Ativos)</CardTitle>
                <div className="text-3xl font-bold text-green-600 mt-2">{ativos}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg"><CheckCircle className="h-6 w-6 text-green-600" /></div>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Não Visíveis (Inativos)</CardTitle>
                <div className="text-3xl font-bold text-red-600 mt-2">{inativos}</div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg"><XCircle className="h-6 w-6 text-red-600" /></div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabela de Comércios */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl">Lista de Comércios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Comércio</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status Aprovação</TableHead>
                  <TableHead className="text-center">Visibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comercios.map((comercio: any) => { // Usando 'any' temporariamente para acomodar o perfil
                  const isUpdating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === comercio.id;
                  return (
                    <TableRow key={comercio.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{comercio.nome}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {/* Mostrando o nome do criador do comércio */}
                          {comercio.profiles?.full_name || comercio.admin_profiles?.full_name || 'Não disponível'}
                        </div>
                      </TableCell>
                      <TableCell>{comercio.categoria || 'N/A'}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant={getStatusVariant(comercio.status)} className={getStatusClass(comercio.status)}>
                              {comercio.status || 'N/A'}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Status do cadastro: {comercio.status}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center">
                              {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                              <Switch
                                checked={comercio.ativo ?? false}
                                onCheckedChange={() => handleVisibilityToggle(comercio.id, comercio.ativo)}
                                disabled={isUpdating}
                                aria-readonly={isUpdating}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{comercio.ativo ? 'Clique para inativar (não será visível no app)' : 'Clique para ativar (será visível no app)'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <Button size="sm" variant="outline" onClick={() => handleViewComercio(comercio)}>
                                 <Eye className="h-4 w-4" />
                               </Button>
                             </TooltipTrigger>
                             <TooltipContent><p>Visualizar perfil</p></TooltipContent>
                           </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => alert(`Excluir comércio: ${comercio.nome}`)} className="hover:bg-red-100 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Excluir comércio (ação irreversível)</p></TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Preview do Comércio */}
        <ComercioPreviewDialog 
          comercio={selectedComercio}
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
        />

        {/* Dialog de Criação de Comércio */}
        <ComercioDialog 
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </TooltipProvider>
  );
};

export default ComerciosPage;