import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Store, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useComercios, useApproveComercio, useRejectComercio, useDeleteComercio } from '@/hooks/useComercios';
import { useCreateNotification } from '@/hooks/useNotifications';

const ComerciosPage = () => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comércios</h2>
          <p className="text-muted-foreground">Gerencie os estabelecimentos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comercios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ativos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inativos}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Comércios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comercios.map((comercio) => (
                <TableRow key={comercio.id}>
                  <TableCell className="font-medium">{comercio.nome}</TableCell>
                  <TableCell>{comercio.categoria || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={comercio.ativo ? 'default' : 'destructive'}>
                      {comercio.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!comercio.ativo && (
                        <Button size="sm" onClick={() => handleApprove(comercio)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => rejectComercio.mutate(comercio.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteComercio.mutate(comercio.id)}>
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
    </div>
  );
};

export default ComerciosPage;