import React, { useState } from 'react';
import { ComercioWithLocation } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ComerciosListProps {
  comercios: ComercioWithLocation[];
  selectedComercio?: string;
  onSelectComercio: (id: string) => void;
  onAddLocation: (id: string, latitude: number, longitude: number) => void;
  onUpdateImage: (id: string, imageUrl: string) => void;
}

export function ComerciosList({ 
  comercios, 
  selectedComercio, 
  onSelectComercio, 
  onAddLocation,
  onUpdateImage 
}: ComerciosListProps) {
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleAddLocation = (comercioId: string) => {
    // Adicionar no centro do mapa (coordenadas da Cidade Inteligente)
    const centerLat = -15.8267;
    const centerLng = -48.2982;
    onAddLocation(comercioId, centerLat, centerLng);
    onSelectComercio(comercioId);
    toast.success('Comércio adicionado ao mapa! Arraste para a posição desejada.');
  };

  const handleImageUpload = async (comercioId: string, file: File) => {
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 5MB.');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida.');
      return;
    }

    setUploadingImage(comercioId);

    try {
      // Upload para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${comercioId}-${Date.now()}.${fileExt}`;
      const filePath = `comercios/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('app-media')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('app-media')
        .getPublicUrl(filePath);

      // Atualizar o comércio com a nova imagem
      onUpdateImage(comercioId, publicUrl);

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(null);
    }
  };

  const comerciosComLocalizacao = comercios.filter(c => c.latitude && c.longitude);
  const comerciosSemLocalizacao = comercios.filter(c => !c.latitude || !c.longitude);

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p><strong>Instruções:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Clique em "Adicionar Localização" para posicionar um comércio no mapa</li>
          <li>Arraste os marcadores verdes no mapa para reposicionar</li>
          <li>Use "Alterar Imagem" para atualizar a foto do comércio</li>
        </ul>
      </div>

      {/* Comércios sem localização */}
      {comerciosSemLocalizacao.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-600">
            Comércios sem localização ({comerciosSemLocalizacao.length})
          </h3>
          <div className="grid gap-3">
            {comerciosSemLocalizacao.map(comercio => (
              <Card 
                key={comercio.id} 
                className={`cursor-pointer transition-all ${
                  selectedComercio === comercio.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onSelectComercio(comercio.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{comercio.nome}</h4>
                      <p className="text-sm text-gray-600">{comercio.categoria || 'Sem categoria'}</p>
                      <Badge variant="destructive" className="mt-1">
                        Sem localização
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddLocation(comercio.id);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Adicionar Localização
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Comércios com localização */}
      {comerciosComLocalizacao.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-600">
            Comércios com localização ({comerciosComLocalizacao.length})
          </h3>
          <div className="grid gap-3">
            {comerciosComLocalizacao.map(comercio => (
              <Card 
                key={comercio.id} 
                className={`cursor-pointer transition-all ${
                  selectedComercio === comercio.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onSelectComercio(comercio.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Imagem */}
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                      {comercio.image_url ? (
                        <img 
                          src={comercio.image_url} 
                          alt={comercio.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          🏪
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <h4 className="font-medium">{comercio.nome}</h4>
                      <p className="text-sm text-gray-600">{comercio.categoria || 'Sem categoria'}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <MapPin className="h-3 w-3 mr-1" />
                          Localizado
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {comercio.latitude?.toFixed(6)}, {comercio.longitude?.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`image-${comercio.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(comercio.id, file);
                            }
                          }}
                          disabled={uploadingImage === comercio.id}
                        />
                        <Label
                          htmlFor={`image-${comercio.id}`}
                          className="cursor-pointer"
                        >
                          <Button 
                            size="sm" 
                            variant="outline"
                            asChild
                            disabled={uploadingImage === comercio.id}
                          >
                            <span>
                              {uploadingImage === comercio.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                              {uploadingImage === comercio.id ? 'Enviando...' : 'Alterar Imagem'}
                            </span>
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {comercios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum comércio encontrado</p>
        </div>
      )}
    </div>
  );
}