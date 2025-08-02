import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapView } from '@/components/admin/MapView';
import { ItemsList } from '@/components/admin/ItemsList'; // Importando a nova lista genérica
import { usePointsOfInterest, useComerciasWithLocation, useUpdateItem } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { RefreshCw, MapPin, Store } from 'lucide-react';

// Tipo para identificar unicamente um item selecionado
type SelectedItem = { id: string; type: 'comercio' | 'poi' };

export default function MapaPage() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const { data: pois = [], isLoading: loadingPOI, refetch: refetchPOI } = usePointsOfInterest();
  const { data: comercios = [], isLoading: loadingComercios, refetch: refetchComercios } = useComerciasWithLocation();
  
  // Instâncias do hook de mutação para cada tabela
  const updateComercioMutation = useUpdateItem({ tableName: 'comercios' });
  const updatePoiMutation = useUpdateItem({ tableName: 'points_of_interest' });

  // Handler genérico para atualizar localização
  const handleLocationUpdate = (id: string, type: 'comercio' | 'poi', latitude: number, longitude: number) => {
    const mutation = type === 'comercio' ? updateComercioMutation : updatePoiMutation;
    mutation.mutate({ id, updates: { latitude, longitude } });
  };

  // Handler genérico para atualizar imagem
  const handleImageUpdate = (id: string, type: 'comercio' | 'poi', imageUrl: string) => {
    const mutation = type === 'comercio' ? updateComercioMutation : updatePoiMutation;
    mutation.mutate({ id, updates: { image_url: imageUrl } });
  };

  const handleRefresh = () => {
    refetchPOI();
    refetchComercios();
  };
  
  const isLoading = loadingPOI || loadingComercios;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mapa Interativo</h1>
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
              onComercioLocationUpdate={(id, lat, lng) => handleLocationUpdate(id, 'comercio', lat, lng)}
              onPoiLocationUpdate={(id, lat, lng) => handleLocationUpdate(id, 'poi', lat, lng)}
              selectedItem={selectedItem}
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <Tabs defaultValue="comercios" className="h-full flex flex-col">
            <CardHeader className="pt-4 px-4 pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comercios"><Store className="h-4 w-4 mr-2"/>Comércios ({comercios.length})</TabsTrigger>
                <TabsTrigger value="pois"><MapPin className="h-4 w-4 mr-2"/>POIs ({pois.length})</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-y-auto">
              <TabsContent value="comercios" className="m-0">
                <ItemsList
                  items={comercios}
                  itemType="comercio"
                  selectedItemId={selectedItem?.type === 'comercio' ? selectedItem.id : undefined}
                  onSelectItem={(id) => setSelectedItem({ id, type: 'comercio' })}
                  onUpdateLocation={(id, lat, lng) => handleLocationUpdate(id, 'comercio', lat, lng)}
                  onUpdateImage={(id, url) => handleImageUpdate(id, 'comercio', url)}
                  icon={<Store />}
                />
              </TabsContent>
              <TabsContent value="pois" className="m-0">
                <ItemsList
                  items={pois}
                  itemType="poi"
                  selectedItemId={selectedItem?.type === 'poi' ? selectedItem.id : undefined}
                  onSelectItem={(id) => setSelectedItem({ id, type: 'poi' })}
                  onUpdateLocation={(id, lat, lng) => handleLocationUpdate(id, 'poi', lat, lng)}
                  onUpdateImage={(id, url) => handleImageUpdate(id, 'poi', url)}
                  icon={<MapPin />}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
