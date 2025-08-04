
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutSelector } from '@/components/comerciante/LayoutSelector';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { ColorSelector } from '@/components/comerciante/ColorSelector';
import { Clock, MapPin, Phone, Instagram, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMeuComercio, useUpdateComercio } from '@/hooks/useComercios';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PersonalizacaoPage = () => {
  const { user } = useAuth();
  const { data: meuComercio, isLoading, refetch } = useMeuComercio(user?.id);
  const updateComercio = useUpdateComercio();
  
  const [selectedLayout, setSelectedLayout] = useState<'moderno' | 'classico'>('moderno');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    if (meuComercio) {
      setSelectedLayout(meuComercio.layout_template as 'moderno' | 'classico' || 'moderno');
      setSelectedColor(meuComercio.primary_color || '#3B82F6');
    }
  }, [meuComercio]);

  const handleLayoutChange = (layout: 'moderno' | 'classico') => {
    setSelectedLayout(layout);
    setPendingChanges(true);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setPendingChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!meuComercio) return;
    
    try {
      await updateComercio.mutateAsync({
        id: meuComercio.id,
        layout_template: selectedLayout,
        primary_color: selectedColor
      });
      setPendingChanges(false);
      toast.success('Alterações enviadas para aprovação!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!meuComercio) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você precisa criar o perfil do seu comércio primeiro. Acesse a aba Perfil.
        </AlertDescription>
      </Alert>
    );
  }

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
              <Button 
                onClick={handleSaveChanges} 
                disabled={updateComercio.isPending}
              >
                {updateComercio.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                comercioData={meuComercio}
                onUpdateComercio={async (updates) => {
                  if (meuComercio?.id) {
                    try {
                      const { error } = await supabase
                        .from('comercios')
                        .update(updates)
                        .eq('id', meuComercio.id);
                      
                      if (error) throw error;
                      
                      // Revalidar dados
                      refetch();
                      toast.success('Dados atualizados com sucesso!');
                    } catch (error) {
                      console.error('Erro ao atualizar:', error);
                      toast.error('Erro ao atualizar dados');
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizacaoPage;
