import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useComercios, useUpdateComercioStatus } from '@/hooks/useComercios';

export function ComerciosPage() {
  const { data: comercios, isLoading, isError } = useComercios();
  const updateStatusMutation = useUpdateComercioStatus();

  const handleStatusToggle = (id: string, currentStatus: boolean | null) => {
    if (currentStatus === null) return; // Não faz nada se o status for nulo
    updateStatusMutation.mutate({ id, newStatus: !currentStatus });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 p-10">Erro ao carregar os comércios.</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Comércios</CardTitle>
          <CardDescription>Visualize e gerencie todos os comércios da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Comércio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comercios?.map((comercio) => (
                <TableRow key={comercio.id}>
                  <TableCell className="font-medium">{comercio.nome}</TableCell>
                  <TableCell>
                    <Badge variant={comercio.status === 'approved' ? 'default' : 'secondary'}
                           className={comercio.status === 'approved' ? 'bg-green-500' : 
                                      comercio.status === 'pending' ? 'bg-yellow-500 text-black' : 
                                      comercio.status === 'rejected' ? 'bg-red-500' : ''}>
                      {comercio.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={comercio.ativo ?? false}
                      onCheckedChange={() => handleStatusToggle(comercio.id, comercio.ativo)}
                      disabled={updateStatusMutation.isPending}
                      aria-readonly
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComerciosPage;