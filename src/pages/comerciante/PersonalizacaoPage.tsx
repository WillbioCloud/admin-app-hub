
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutSelector } from '@/components/comerciante/LayoutSelector';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { ColorSelector } from '@/components/comerciante/ColorSelector';
import { Clock, MapPin, Phone, Instagram } from 'lucide-react';

const PersonalizacaoPage = () => {
  const [selectedLayout, setSelectedLayout] = useState<'moderno' | 'classico'>('moderno');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [pendingChanges, setPendingChanges] = useState(false);

  const handleLayoutChange = (layout: 'moderno' | 'classico') => {
    setSelectedLayout(layout);
    setPendingChanges(true);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setPendingChanges(true);
  };

  const handleSaveChanges = () => {
    // Aqui será implementada a lógica de envio para aprovação
    console.log('Salvando mudanças para aprovação:', { selectedLayout, selectedColor });
    setPendingChanges(false);
    // Simular notificação
    alert('Alterações enviadas para aprovação do administrador!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Personalização</h2>
        <p className="text-muted-foreground">
          Configure a aparência da sua página no aplicativo
        </p>
      </div>

      {pendingChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Alterações Pendentes</h3>
                <p className="text-sm text-orange-700">Você tem alterações não salvas</p>
              </div>
              <Button onClick={handleSaveChanges}>
                Enviar para Aprovação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="layout" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha do Layout</CardTitle>
              <CardDescription>
                Selecione o layout que melhor representa seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutSelector 
                selectedLayout={selectedLayout}
                onLayoutChange={handleLayoutChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
              <CardDescription>
                Defina a cor principal da sua página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorSelector 
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Página</CardTitle>
              <CardDescription>
                Veja como sua página aparecerá no aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutPreview 
                layout={selectedLayout}
                primaryColor={selectedColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizacaoPage;
