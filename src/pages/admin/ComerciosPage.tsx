import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, ExternalLink } from 'lucide-react';
import { useComercios, useUpdateComercioAtivoStatus } from '@/hooks/useComercios';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * ComerciosPage
 * Esta página é o painel principal para gerenciar TODOS os comércios da plataforma.
 * Ela utiliza o hook `useComercios` para buscar a lista completa.
 * A principal ação aqui é ativar ou inativar a visibilidade de um comércio usando o `Switch`,
 * que dispara a mutação dedicada `useUpdateComercioAtivoStatus`.
 */
export function ComerciosPage() {
  const navigate = useNavigate();
  const { data: comercios, isLoading, isError, error } = useComercios();
  const updateStatusMutation = useUpdateComercioAtivoStatus();

  /**
   * Lida com a mudança de status do Switch.
   * Dispara a mutação para atualizar a visibilidade (coluna 'ativo') do comércio.
   */
  const handleVisibilityToggle = (id: string, currentStatus: boolean | null) => {
    // Ação é prevenida se o status atual for nulo para evitar erros.
    if (currentStatus === null) return;
    updateStatusMutation.mutate({ id, newStatus: !currentStatus });
  };

  /**
   * Retorna a variante de cor para o Badge de status, melhorando a UI.
   */
  const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
          case 'approved': return 'default';
          case 'pending': return 'secondary';
          case 'rejected': return 'destructive';
          default: return 'outline';
      }
  }

  /**
   * Retorna classes de CSS para o Badge de status, aplicando cores distintas.
   */
   const getStatusClass = (status: string | null | undefined): string => {
      switch (status) {
          case 'approved': return 'bg-green-500 hover:bg-green-600';
          case 'pending': return 'bg-yellow-500 text-black hover:bg-yellow-600';
          case 'rejected': return 'bg-red-500 hover:bg-red-600';
          default: return '';
      }
  }

  // Feedback de carregamento
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // Feedback de erro
  if (isError) {
    return (
        <div className="text-center text-red-500 p-10">
            <p className="font-semibold">Erro ao carregar a lista de comércios.</p>
            <p className="text-xs mt-2">{error?.message}</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Comércios</CardTitle>
          <CardDescription>
            Visualize todos os comércios da plataforma e gerencie sua visibilidade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Comércio</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status de Aprovação</TableHead>
                <TableHead className="text-center">Visibilidade (Ativo/Inativo)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comercios?.map((comercio) => {
                  const isUpdating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === comercio.id;
                  return (
                    <TableRow key={comercio.id}>
                      <TableCell className="font-medium">{comercio.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{comercio.categoria}</TableCell>
                      <TableCell>
                        <Badge 
                            variant={getStatusVariant(comercio.status)}
                            className={getStatusClass(comercio.status)}>
                          {comercio.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          <Switch
                            checked={comercio.ativo ?? false}
                            onCheckedChange={() => handleVisibilityToggle(comercio.id, comercio.ativo)}
                            disabled={isUpdating}
                            aria-readonly={isUpdating}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => alert('Função de editar a ser implementada.')}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                );
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComerciosPage;