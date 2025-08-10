import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Image as ImageIcon } from 'lucide-react';

interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  phone?: string;
  operating_hours?: string;
  latitude?: number;
  longitude?: number;
}

interface PointsOfInterestListProps {
  pointsOfInterest: PointOfInterest[];
  selectedPOI?: string;
  onSelectPOI: (id: string) => void;
}

export function PointsOfInterestList({ pointsOfInterest, selectedPOI, onSelectPOI }: PointsOfInterestListProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'supermercado': 'bg-green-100 text-green-800',
      'farmacia': 'bg-blue-100 text-blue-800',
      'padaria': 'bg-orange-100 text-orange-800',
      'restaurante': 'bg-red-100 text-red-800',
      'loja': 'bg-purple-100 text-purple-800',
      'posto': 'bg-yellow-100 text-yellow-800',
      'banco': 'bg-gray-100 text-gray-800',
      'loteamento': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-3">
      {pointsOfInterest.map((poi) => (
        <Card 
          key={poi.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedPOI === poi.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectPOI(poi.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium truncate">
                {poi.name}
              </CardTitle>
              <Badge className={`text-xs ${getCategoryColor(poi.category)}`}>
                {poi.category}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-2">
              {poi.image_url && (
                <div className="flex items-center gap-2">
                  <img 
                    src={poi.image_url} 
                    alt={poi.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <ImageIcon className="h-3 w-3 text-green-600" />
                </div>
              )}
              
              {poi.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{poi.phone}</span>
                </div>
              )}
              
              {poi.operating_hours && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{poi.operating_hours}</span>
                </div>
              )}
              
              {poi.latitude && poi.longitude && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {pointsOfInterest.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhum ponto de interesse encontrado</p>
        </div>
      )}
    </div>
  );
}