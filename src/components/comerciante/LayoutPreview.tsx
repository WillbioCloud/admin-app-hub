
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
  Upload,
  ArrowLeft,
  Share2,
  Info
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
    services: ['Delivery', 'Balcão', 'Cartão'],
    rating: '4.8'
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
            iPhone Preview - Layout Moderno
          </div>
          
          {/* Header com imagem de capa */}
          <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 group">
            <div className="absolute inset-0 bg-black/30"></div>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 z-10"
            >
              <Upload className="h-4 w-4" />
            </Button>
            
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <ArrowLeft className="h-6 w-6 text-white" />
              <div className="flex space-x-2">
                <Heart className="h-6 w-6 text-white" />
                <Share2 className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Title Box */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 p-3 rounded-lg">
              <h1 className="text-white text-xl font-bold">
                <EditableField field="name" value={commerceData.name} />
              </h1>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white text-sm font-bold">{commerceData.rating}</span>
                <Badge className="ml-2 bg-white/20 text-white text-xs">
                  {commerceData.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 flex space-x-3 border-b">
            <Button 
              className="flex-1 flex items-center justify-center space-x-2" 
              style={{ backgroundColor: primaryColor }}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm">Ligar Agora</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Instagram className="h-4 w-4" />
              <span className="text-sm">Instagram</span>
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
            {/* Galeria */}
            <div>
              <h3 className="font-bold text-lg mb-3">Galeria</h3>
              <div className="flex space-x-3 overflow-x-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                      Img {i}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-bold text-lg mb-3" style={{ color: primaryColor }}>Informações</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                  <EditableField field="address" value={commerceData.address} />
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4" style={{ color: primaryColor }} />
                  <EditableField field="hours" value={commerceData.hours} />
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" style={{ color: primaryColor }} />
                  <EditableField field="whatsapp" value={commerceData.whatsapp} />
                </div>
              </div>
            </div>

            {/* Serviços */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-bold text-lg mb-3" style={{ color: primaryColor }}>Serviços</h3>
              <div className="flex flex-wrap gap-2">
                {commerceData.services.map((service, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-700 text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sobre */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-bold text-lg mb-3" style={{ color: primaryColor }}>Sobre</h3>
              <p className="text-sm text-gray-600">
                <EditableField field="description" value={commerceData.description} multiline />
              </p>
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
          iPhone Preview - Layout Clássico
        </div>
        
        {/* Header com botão voltar */}
        <div className="relative bg-gray-100 p-4">
          <ArrowLeft className="absolute top-4 left-4 h-6 w-6 text-gray-700" />
        </div>
        
        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Header centralizado */}
          <div className="text-center p-6 bg-white border-b">
            <div className="relative inline-block group">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo</span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <Upload className="h-3 w-3" />
              </Button>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              <EditableField field="name" value={commerceData.name} />
            </h1>
            <Badge style={{ backgroundColor: primaryColor, color: 'white' }}>
              {commerceData.category}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-around p-4 bg-white border-b">
            <div className="text-center">
              <div className="p-2">
                <Phone className="h-5 w-5 mx-auto" style={{ color: primaryColor }} />
              </div>
              <span className="text-xs text-gray-600">Ligar</span>
            </div>
            <div className="text-center">
              <div className="p-2">
                <Instagram className="h-5 w-5 mx-auto text-pink-500" />
              </div>
              <span className="text-xs text-gray-600">Instagram</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-4">
            {/* Descrição */}
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex items-start space-x-3">
                <Info className="h-4 w-4 text-gray-600 mt-0.5" />
                <p className="text-sm text-gray-700 flex-1">
                  <EditableField field="description" value={commerceData.description} multiline />
                </p>
              </div>
            </div>

            {/* Informações de contato */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded">
                <Phone className="h-4 w-4 text-gray-600" />
                <EditableField field="whatsapp" value={commerceData.whatsapp} />
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded">
                <Instagram className="h-4 w-4 text-gray-600" />
                <EditableField field="instagram" value={commerceData.instagram} />
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded">
                <MapPin className="h-4 w-4 text-gray-600" />
                <EditableField field="address" value={commerceData.address} />
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded">
                <Clock className="h-4 w-4 text-gray-600" />
                <EditableField field="hours" value={commerceData.hours} />
              </div>
            </div>

            {/* Botão de contato principal */}
            <Button 
              className="w-full mb-4" 
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              Entrar em Contato
            </Button>

            {/* Serviços */}
            <div>
              <h3 className="font-semibold mb-3 text-center">Serviços Oferecidos</h3>
              <div className="grid grid-cols-3 gap-2">
                {commerceData.services.map((service, index) => (
                  <div key={index} className="text-center p-3 border rounded">
                    <span className="text-xs">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Galeria */}
            <div>
              <h3 className="font-semibold mb-3">Galeria</h3>
              <div className="flex space-x-2 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                      Imagem {i}
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
