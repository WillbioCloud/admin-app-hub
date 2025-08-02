import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/admin/MapView';
import { ComerciosList } from '@/components/admin/ComerciosList';
import { usePointsOfInterest, useComerciasWithLocation, useUpdateComercioLocation } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { RefreshCw, Map } from 'lucide-react';

export default function MapaPage() {
  const [selectedComercio, setSelectedComercio] = useState<string>();
  
  const { 
    data: pointsOfInterest = [], 
    isLoading: loadingPOI, 
    refetch: refetchPOI 
  } = usePointsOfInterest();
  
  const { 
    data: comercios = [], 
    isLoading: loadingComercios, 
    refetch: refetchComercios 
  } = useComerciasWithLocation();
  
  const updateLocationMutation = useUpdateComercioLocation();

  const handleLocationUpdate = (id: string, latitude: number, longitude: number) => {
    updateLocationMutation.mutate({ id, latitude, longitude });
  };

  const handleImageUpdate = (id: string, imageUrl: string) => {
    updateLocationMutation.mutate({ id, latitude: 0, longitude: 0, image_url: imageUrl });
  };

  const handleRefresh = () => {
    refetchPOI();
    refetchComercios();
  };

  if (loadingPOI || loadingComercios) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando dados do mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mapa dos Comércios</h1>
          <p className="text-muted-foreground">
            Gerencie as localizações dos comércios no loteamento Cidade Inteligente
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Mapa */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Loteamento Cidade Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-4rem)]">
            <MapView
              pointsOfInterest={pointsOfInterest}
              comercios={comercios}
              onComercioLocationUpdate={handleLocationUpdate}
              selectedComercio={selectedComercio}
            />
          </CardContent>
        </Card>

        {/* Lista de Comércios */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Comércios ({comercios.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-4rem)] overflow-y-auto">
            <div className="p-4">
              <ComerciosList
                comercios={comercios}
                selectedComercio={selectedComercio}
                onSelectComercio={setSelectedComercio}
                onAddLocation={handleLocationUpdate}
                onUpdateImage={handleImageUpdate}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}