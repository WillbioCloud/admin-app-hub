import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Palette, Camera, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CreateCommerceCard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Store className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Crie seu Comércio</h2>
          <p className="text-muted-foreground mt-2">
            Configure seu estabelecimento na plataforma e alcance mais clientes
          </p>
        </div>
      </div>

      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Store className="h-5 w-5" />
            Configurar Meu Comércio
          </CardTitle>
          <CardDescription>
            Comece criando o perfil do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Camera className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">Imagens</h3>
              <p className="text-xs text-muted-foreground">Logo, capa e galeria</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Palette className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">Personalização</h3>
              <p className="text-xs text-muted-foreground">Cores e layout</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">Configurações</h3>
              <p className="text-xs text-muted-foreground">Contato e serviços</p>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/dashboard/personalizacao')}
          >
            <Store className="h-4 w-4 mr-2" />
            Começar Agora
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Após a criação, seu comércio passará por uma análise antes de ficar ativo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}