import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { usePendingComercios, useApproveComercio, useRejectComercio } from '@/hooks/useComercios';

/**
 * AprovacoesPage
 * Esta página é dedicada exclusivamente a gerenciar comércios com o status 'pending'.
 * Ela utiliza o hook `usePendingComercios` para buscar apenas os itens relevantes.
 * Os botões de ação disparam as mutações `useApproveComercio` e `useRejectComercio`.
 */
export function AprovacoesPage() {
  const { data: pendingComercios, isLoading, isError, error } = usePendingComercios();
  const approveMutation = useApproveComercio();
  const rejectMutation = useRejectComercio();

  // Exibe um feedback de carregamento enquanto os dados são buscados.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Exibe uma mensagem de erro se a busca falhar.
  if (isError) {
    return (
      <div className="text-center text-red-500 p-10">
        <p className="font-semibold">Erro ao carregar as aprovações pendentes.</p>
        <p className="text-xs mt-2">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Aprovações Pendentes</CardTitle>
          <CardDescription>
            Revise e aprove ou rejeite os novos comércios e as atualizações enviadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingComercios && pendingComercios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Comércio</TableHead>
                  <TableHead>Proprietário (User ID)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingComercios.map((comercio) => {
                  // Verifica se a mutação atual está processando este comércio específico.
                  const isApproving = approveMutation.isPending && approveMutation.variables?.id === comercio.id;
                  const isRejecting = rejectMutation.isPending && rejectMutation.variables?.id === comercio.id;
                  const isProcessing = isApproving || isRejecting;

                  return (
                    <TableRow key={comercio.id}>
                      <TableCell className="font-medium">{comercio.nome}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{comercio.user_id}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* Botão de Rejeitar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectMutation.mutate(comercio)}
                          disabled={isProcessing}
                        >
                          {isRejecting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Rejeitar
                        </Button>
                        
                        {/* Botão de Aprovar */}
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(comercio)}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isApproving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Aprovar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-4 text-lg font-medium">Tudo em ordem!</h3>
              <p className="mt-1 text-sm">Nenhum comércio pendente de aprovação no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AprovacoesPage;