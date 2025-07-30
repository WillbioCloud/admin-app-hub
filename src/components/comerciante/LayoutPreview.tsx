
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Star, 
  Heart,
  Edit2,
  Upload
} from 'lucide-react';

interface LayoutPreviewProps {
  layout: 'moderno' | 'classico';
  primaryColor: string;
}

export const LayoutPreview = ({ layout, primaryColor }: LayoutPreviewProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [commerceData, setCommerceData] = useState({
    name: 'Loja do João',
    description: 'O melhor da culinária regional com ingredientes frescos e sabor autêntico.',
    category: 'Alimentação',
    whatsapp: '(11) 99999-9999',
    instagram: '@lojadojoao',
    address: 'Rua das Flores, 123 - Centro',
    hours: 'Seg-Sex: 8h-18h | Sáb: 8h-14h',
    services: ['Delivery', 'Balcão', 'Cartão']
  });

  const handleEdit = (field: string) => {
    setIsEditing(field);
  };

  const handleSave = (field: string, value: string) => {
    setCommerceData(prev => ({ ...prev, [field]: value }));
    setIsEditing(null);
  };

  const EditableField = ({ field, value, multiline = false }: { field: string; value: string; multiline?: boolean }) => {
    if (isEditing === field) {
      return (
        <div className="flex items-center space-x-2">
          {multiline ? (
            <Textarea
              defaultValue={value}
              onBlur={(e) => handleSave(field, e.target.value)}
              className="text-sm"
              autoFocus
            />
          ) : (
            <Input
              defaultValue={value}
              onBlur={(e) => handleSave(field, e.target.value)}
              className="text-sm"
              autoFocus
            />
          )}
        </div>
      );
    }

    return (
      <div className="group relative">
        <span>{value}</span>
        <Button
          size="sm"
          variant="ghost"
          className="absolute -right-8 top-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={() => handleEdit(field)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  if (layout === 'moderno') {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
          {/* Header do celular */}
          <div className="bg-gray-900 text-white text-center py-1 text-xs">
            iPhone Preview
          </div>
          
          {/* Conteúdo */}
          <div className="space-y-4 p-4">
            {/* Imagem de capa */}
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Imagem de Capa
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>

            {/* Informações principais */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">
                  <EditableField field="name" value={commerceData.name} />
                </h1>
                <Badge style={{ backgroundColor: primaryColor, color: 'white' }}>
                  {commerceData.category}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm">
                <EditableField field="description" value={commerceData.description} multiline />
              </p>

              {/* Cards de contato */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">
                      <EditableField field="whatsapp" value={commerceData.whatsapp} />
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">
                      <EditableField field="instagram" value={commerceData.instagram} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão principal */}
              <Button 
                className="w-full" 
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              >
                Entrar em Contato
              </Button>

              {/* Informações adicionais */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <EditableField field="address" value={commerceData.address} />
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <EditableField field="hours" value={commerceData.hours} />
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="font-semibold mb-2">Serviços</h3>
                <div className="flex flex-wrap gap-1">
                  {commerceData.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout Clássico
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
        {/* Header do celular */}
        <div className="bg-gray-900 text-white text-center py-1 text-xs">
          iPhone Preview
        </div>
        
        {/* Conteúdo */}
        <div className="p-4">
          {/* Header */}
          <div className="text-center mb-4 pb-4 border-b">
            <h1 className="text-2xl font-bold mb-2">
              <EditableField field="name" value={commerceData.name} />
            </h1>
            <Badge style={{ backgroundColor: primaryColor, color: 'white' }}>
              {commerceData.category}
            </Badge>
          </div>

          {/* Imagem */}
          <div className="relative mb-4 aspect-video bg-gray-200 rounded overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Imagem Principal
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          {/* Descrição */}
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-700">
              <EditableField field="description" value={commerceData.description} multiline />
            </p>
          </div>

          {/* Informações de contato */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3 p-2 border rounded">
              <Phone className="h-4 w-4 text-gray-600" />
              <EditableField field="whatsapp" value={commerceData.whatsapp} />
            </div>
            <div className="flex items-center space-x-3 p-2 border rounded">
              <Instagram className="h-4 w-4 text-gray-600" />
              <EditableField field="instagram" value={commerceData.instagram} />
            </div>
            <div className="flex items-center space-x-3 p-2 border rounded">
              <MapPin className="h-4 w-4 text-gray-600" />
              <EditableField field="address" value={commerceData.address} />
            </div>
            <div className="flex items-center space-x-3 p-2 border rounded">
              <Clock className="h-4 w-4 text-gray-600" />
              <EditableField field="hours" value={commerceData.hours} />
            </div>
          </div>

          {/* Botão de contato */}
          <Button 
            className="w-full mb-4" 
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          >
            Entrar em Contato
          </Button>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-2 text-center">Serviços Oferecidos</h3>
            <div className="grid grid-cols-3 gap-2">
              {commerceData.services.map((service, index) => (
                <div key={index} className="text-center p-2 border rounded">
                  <span className="text-xs">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
