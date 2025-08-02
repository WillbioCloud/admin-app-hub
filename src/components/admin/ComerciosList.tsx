import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Upload, Loader2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Tipo genérico para unificar POIs e Comércios
type ListItem = {
  id: string;
  nome?: string; // Para Comércios
  name?: string; // Para POIs
  categoria?: string;
  category?: string;
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string | null;
};

interface ItemsListProps {
  items: ListItem[];
  itemType: 'comercio' | 'poi';
  selectedItemId?: string;
  onSelectItem: (id: string) => void;
  onUpdateLocation: (id: string, latitude: number, longitude: number) => void;
  onUpdateImage: (id: string, imageUrl: string) => void;
  icon: React.ReactNode;
}

export function ItemsList({ 
  items,
  selectedItemId,
  onSelectItem,
  onUpdateLocation,
  onUpdateImage,
  icon
}: ItemsListProps) {
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleAddLocation = (itemId: string) => {
    // Adiciona o item no centro do mapa para o usuário poder arrastar
    onUpdateLocation(itemId, -15.944808, -48.318956);
    onSelectItem(itemId);
    toast.info('Item adicionado ao mapa! Arraste o marcador para a posição exata.');
  };

  const handleImageUpload = async (itemId: string, file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida.');
      return;
    }

    setUploadingImage(itemId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`; // Caminho simplificado

      const { error: uploadError } = await supabase.storage.from('app-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('app-media').getPublicUrl(filePath);
      onUpdateImage(itemId, publicUrl);

    } catch (error: any) {
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingImage(null);
    }
  };

  const itemsComLocalizacao = items.filter(item => item.latitude && item.longitude);
  const itemsSemLocalizacao = items.filter(item => !item.latitude || !item.longitude);

  return (
    <div className="space-y-4 p-4">
      {itemsSemLocalizacao.map(item => {
        const itemName = item.nome || item.name || 'Item sem nome';
        return (
          <Card key={item.id} className="bg-red-50 border-red-200">
            <CardContent className="p-3 flex justify-between items-center">
              <h4 className="font-semibold">{itemName}</h4>
              <Button size="sm" onClick={() => handleAddLocation(item.id)}>
                <MapPin className="h-4 w-4 mr-2" />
                Adicionar Local
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {itemsComLocalizacao.map(item => {
        const itemName = item.nome || item.name || 'Item sem nome';
        const itemCategory = item.categoria || item.category || 'Sem categoria';
        return (
          <Card 
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            className={`cursor-pointer transition-shadow ${selectedItemId === item.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'}`}
          >
            <CardContent className="p-3 flex gap-4 items-center">
              <div className="w-20 h-20 bg-muted rounded-md flex-shrink-0 overflow-hidden relative group">
                {item.image_url ? <img src={item.image_url} alt={itemName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">{icon}</div>}
                <Label htmlFor={`upload-${item.id}`} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploadingImage === item.id ? <Loader2 className="h-5 w-5 animate-spin"/> : <Edit className="h-5 w-5"/>}
                </Label>
                <Input id={`upload-${item.id}`} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(item.id, e.target.files[0])} disabled={!!uploadingImage} />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold">{itemName}</h4>
                <p className="text-sm text-muted-foreground">{itemCategory}</p>
                <Badge variant="secondary" className="mt-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  Localizado
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
