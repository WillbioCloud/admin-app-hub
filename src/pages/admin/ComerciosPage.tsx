import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Store, CheckCircle, XCircle, Trash2, Plus, Eye } from 'lucide-react';
import { useComercios, useApproveComercio, useRejectComercio, useDeleteComercio } from '@/hooks/useComercios';
import { useCreateNotification } from '@/hooks/useNotifications';
import { ComercioDialog } from '@/components/admin/ComercioDialog';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ComerciosPage = () => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState<any>(null);

  const { data: comercios = [], isLoading, error } = useComercios();
  const approveComercio = useApproveComercio();
  const rejectComercio = useRejectComercio();
  const deleteComercio = useDeleteComercio();
  const createNotification = useCreateNotification();

  const handleApprove = async (comercio: any) => {
    try {
      await approveComercio.mutateAsync(comercio.id);
      await createNotification.mutateAsync({
        title: `Novo comércio: ${comercio.nome}`,
        message: `O comércio "${comercio.nome}" foi aprovado!`,
        type: 'novo_comercio',
        metadata: { comercio_id: comercio.id },
        user_id: null
      });
    } catch (error) {
      console.error('Erro ao aprovar comércio:', error);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar</div>;

  const ativos = comercios.filter(c => c.ativo).length;
  const inativos = comercios.filter(c => !c.ativo).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Comércios</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie todos os estabelecimentos cadastrados
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="hover:shadow-lg transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Comércio
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{comercios.length}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Store className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
              <div className="text-3xl font-bold text-green-600 mt-2">{ativos}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
              <div className="text-3xl font-bold text-red-600 mt-2">{inativos}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Comércios</CardTitle>
          <CardDescription>
            Gerencie o status de todos os estabelecimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comercios.map((comercio) => (
                <TableRow key={comercio.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{comercio.nome}</TableCell>
                  <TableCell>{comercio.categoria || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {comercio.layout_template === 'moderno' ? 'Moderno' : 'Clássico'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={comercio.ativo ? 'default' : 'destructive'}>
                      {comercio.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedComercio(comercio);
                          setPreviewDialogOpen(true);
                        }}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      {!comercio.ativo && (
                        <Button size="sm" onClick={() => handleApprove(comercio)} className="hover:shadow-lg transition-shadow">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant={comercio.ativo ? "destructive" : "default"} 
                        onClick={() => {
                          if (comercio.ativo) {
                            // Inativar comercio
                            rejectComercio.mutate(comercio.id);
                          } else {
                            // Ativar comercio
                            handleApprove(comercio);
                          }
                        }} 
                        className="hover:shadow-lg transition-shadow"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {comercio.ativo ? 'Inativar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteComercio.mutate(comercio.id)} className="hover:bg-red-100 hover:text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ComercioDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização do Layout - {selectedComercio?.nome}</DialogTitle>
          </DialogHeader>
          {selectedComercio && (
            <LayoutPreview
              layout={selectedComercio.layout_template || 'moderno'}
              primaryColor={selectedComercio.primary_color || '#3B82F6'}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComerciosPage;