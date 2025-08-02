import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/admin/MapView';
import { ComerciosList } from '@/components/admin/ComerciosList';
import { usePointsOfInterest, useComerciasWithLocation, useUpdateItem } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Store } from 'lucide-react';

export default function MapaPage() {
  const [selectedComercio, setSelectedComercio] = useState<string | undefined>();

  const { data: pois = [], isLoading: loadingPOI, refetch: refetchPOI } = usePointsOfInterest();
  const { data: comercios = [], isLoading: loadingComercios, refetch: refetchComercios } = useComerciasWithLocation();
  
  // Usando o hook de mutação genérico para a tabela 'comercios'
  const updateComercioMutation = useUpdateItem({ tableName: 'comercios' });

  // Handler para atualizar localização (usado tanto para adicionar quanto para arrastar)
  const handleLocationUpdate = (id: string, latitude: number, longitude: number) => {
    updateComercioMutation.mutate({ id, updates: { latitude, longitude } });
  };

  // Handler para atualizar a imagem
  const handleImageUpdate = (id: string, imageUrl: string) => {
    updateComercioMutation.mutate({ id, updates: { image_url: imageUrl } });
  };

  const handleRefresh = () => {
    refetchPOI();
    refetchComercios();
  };
  
  const isLoading = loadingPOI || loadingComercios;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mapa dos Comércios</h1>
        <p className="text-muted-foreground">
          Gerencie as localizações e imagens dos comércios no loteamento.
        </p>
        <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 h-full">
            <MapView
              pointsOfInterest={pois}
              comercios={comercios}
              onComercioLocationUpdate={handleLocationUpdate}
              // Passando o ID do comércio selecionado para o MapView poder destacá-lo
              selectedComercio={selectedComercio}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5"/>
                    Comércios ({comercios.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-y-auto">
                <ComerciosList
                    comercios={comercios}
                    selectedComercio={selectedComercio}
                    onSelectComercio={setSelectedComercio}
                    onAddLocation={handleLocationUpdate}
                    onUpdateImage={handleImageUpdate}
                />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
