
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Eye, Heart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComercianteDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard do Comerciante</h2>
        <p className="text-muted-foreground">
          Gerencie seu comércio e personalize sua presença no app
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Perfil</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <Badge variant="default" className="mt-2">Aprovado</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,849</div>
            <p className="text-xs text-muted-foreground">+15% esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curtidas</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% esta semana</p>
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
                <p className="text-sm text-muted-foreground">Loja do João</p>
              </div>
              <div>
                <span className="text-sm font-medium">Categoria:</span>
                <p className="text-sm text-muted-foreground">Restaurante</p>
              </div>
              <div>
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="default" className="ml-2">Ativo</Badge>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/dashboard/perfil')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Editar Perfil
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
                <p className="text-sm text-muted-foreground">Layout Moderno</p>
              </div>
              <div>
                <span className="text-sm font-medium">Cor Principal:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">#3B82F6</span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/customizacao')}
            >
              Personalizar Página
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Ações recomendadas para melhorar sua presença
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Adicione mais fotos ao seu comércio</p>
                <p className="text-sm text-muted-foreground">Comércios com mais fotos recebem 40% mais visualizações</p>
              </div>
              <Button size="sm">Adicionar</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Complete suas informações de contato</p>
                <p className="text-sm text-muted-foreground">Facilite para os clientes entrarem em contato</p>
              </div>
              <Button size="sm" variant="outline">Completar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComercianteDashboard;
