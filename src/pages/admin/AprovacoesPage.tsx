import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ComercioPreview } from '@/components/admin/ComercioPreview';
import { Loader2, CheckCircle, XCircle, Eye, Store, AlertCircle, Clock, User, Check, X } from 'lucide-react';
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
  const [selectedComercio, setSelectedComercio] = useState(null);

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

  const handleApprove = (comercio) => {
    approveMutation.mutate(comercio);
    setSelectedComercio(null);
  };

  const handleReject = (comercio) => {
    rejectMutation.mutate(comercio);
    setSelectedComercio(null);
  };

  const isFirstSubmission = (comercio) => {
    const createdTime = new Date(comercio.created_at).getTime();
    const updatedTime = new Date(comercio.updated_at).getTime();
    const diffInMinutes = (updatedTime - createdTime) / (1000 * 60);
    return diffInMinutes < 1;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pendente</p>
                <p className="text-2xl font-bold">{pendingComercios?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Novos Comércios</p>
                <p className="text-2xl font-bold">
                  {pendingComercios?.filter(c => isFirstSubmission(c)).length || 0}
                </p>
              </div>
              <Store className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Atualizações</p>
                <p className="text-2xl font-bold">
                  {pendingComercios?.filter(c => !isFirstSubmission(c)).length || 0}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Aprovações Pendentes
          </CardTitle>
          <CardDescription>
            Gerencie as solicitações de novos comércios e atualizações. Clique em "Visualizar" para ver todos os detalhes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingComercios && pendingComercios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comércio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Ações</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {comercio.logo_url ? (
                            <img 
                              src={comercio.logo_url} 
                              alt="Logo" 
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                              <Store className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{comercio.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {comercio.categoria || 'Sem categoria'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isFirstSubmission(comercio) ? "default" : "secondary"}>
                          {isFirstSubmission(comercio) ? "Novo" : "Atualização"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(comercio.created_at).toLocaleDateString('pt-BR')}</div>
                          {!isFirstSubmission(comercio) && (
                            <div className="text-xs text-muted-foreground">
                              Atualizado: {new Date(comercio.updated_at).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{comercio.user_id.slice(0, 8)}...</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedComercio(comercio)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Visualizar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Store className="h-5 w-5" />
                                  {comercio.nome}
                                  <Badge variant={isFirstSubmission(comercio) ? "default" : "secondary"}>
                                    {isFirstSubmission(comercio) ? "Novo Comércio" : "Atualização"}
                                  </Badge>
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedComercio && (
                                <div className="space-y-4">
                                  <ComercioPreview comercio={selectedComercio} />
                                  
                                  {/* Action buttons inside modal */}
                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleReject(selectedComercio)}
                                      disabled={rejectMutation.isPending}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      {rejectMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
                                    </Button>
                                    <Button
                                      onClick={() => handleApprove(selectedComercio)}
                                      disabled={approveMutation.isPending}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      {approveMutation.isPending ? 'Aprovando...' : 'Aprovar'}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            size="sm"
                            onClick={() => handleApprove(comercio)}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isApproving ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-1" />
                            )}
                            Aprovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(comercio)}
                            disabled={isProcessing}
                          >
                            {isRejecting ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            Rejeitar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Nenhuma aprovação pendente</p>
              <p className="text-sm text-muted-foreground">
                Todos os comércios estão aprovados ou não há solicitações no momento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AprovacoesPage;