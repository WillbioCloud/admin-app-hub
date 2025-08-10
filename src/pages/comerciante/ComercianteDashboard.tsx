import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Eye, Heart, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMeuComercio } from '@/hooks/useComercios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreateCommerceCard } from '@/components/comerciante/CreateCommerceCard';

const ComercianteDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: meuComercio, isLoading, isError } = useMeuComercio(user?.id);

  const renderStatusBadge = (status: string | undefined | null) => {
    if (!status) return <Badge variant="destructive">Não Cadastrado</Badge>;
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 text-black">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // Status alert for pending/rejected businesses
  const renderStatusAlert = () => {
    if (!meuComercio) return null;
    
    if (meuComercio.status === 'pending') {
      return (
        <Alert className="border-orange-200 bg-orange-50 mb-6">
          <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
          <AlertTitle className="text-orange-800">Aguardando Aprovação</AlertTitle>
          <AlertDescription className="text-orange-700">
            Seu comércio foi enviado para análise e está aguardando aprovação do administrador.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (meuComercio.status === 'rejected') {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Comércio Rejeitado</AlertTitle>
          <AlertDescription>
            Seu comércio foi rejeitado. Acesse o Perfil para fazer as alterações necessárias.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard do Comerciante</h2>
        <p className="text-muted-foreground">
          Gerencie seu comércio e personalize sua presença no app
        </p>
      </div>

      {renderStatusAlert()}

      {!meuComercio && !isLoading && (
        <CreateCommerceCard />
      )}

      {meuComercio && (
        <>
        <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Perfil</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{meuComercio?.status || 'N/A'}</div>
            {renderStatusBadge(meuComercio?.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(meuComercio as any)?.visualizacoes ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total de visualizações do seu perfil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curtidas</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(meuComercio as any)?.curtidas ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total de curtidas recebidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Comércio</CardTitle>
            <CardDescription>
              Informações básicas do seu estabelecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Nome:</span>
                <p className="text-sm text-muted-foreground">{meuComercio?.nome || 'Não definido'}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Categoria:</span>
                <p className="text-sm text-muted-foreground">{meuComercio?.categoria || 'Não definida'}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Status:</span>
                {renderStatusBadge(meuComercio?.status)}
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/dashboard/perfil')}
            >
              <Settings className="mr-2 h-4 w-4" />
              {meuComercio ? 'Editar Perfil' : 'Criar Perfil'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalização</CardTitle>
            <CardDescription>
              Configure a aparência da sua página
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Layout Atual:</span>
                <p className="text-sm text-muted-foreground capitalize">{meuComercio?.layout_template || 'Padrão'}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Cor Principal:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: meuComercio?.primary_color || '#cccccc' }}></div>
                  <span className="text-sm text-muted-foreground">{meuComercio?.primary_color || 'Não definida'}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/personalizacao')}
              disabled={!meuComercio}
            >
              Personalizar Página
            </Button>
          </CardContent>
        </Card>
        </div>
        </>
      )}
    </div>
  );
};

export default ComercianteDashboard;