
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: 'moderno' | 'classico';
  onLayoutChange: (layout: 'moderno' | 'classico') => void;
}

export const LayoutSelector = ({ selectedLayout, onLayoutChange }: LayoutSelectorProps) => {
  const layouts = [
    {
      id: 'moderno' as const,
      name: 'Layout Moderno',
      description: 'Design clean e minimalista com foco na experiência visual',
      features: ['Cards em grade', 'Galeria em carrossel', 'Botões arredondados', 'Sombras suaves'],
      preview: '/api/placeholder/300/200'
    },
    {
      id: 'classico' as const,
      name: 'Layout Clássico',
      description: 'Layout tradicional com informações organizadas verticalmente',
      features: ['Lista vertical', 'Galeria em grade', 'Botões tradicionais', 'Bordas definidas'],
      preview: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {layouts.map((layout) => (
        <Card
          key={layout.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedLayout === layout.id 
              ? 'ring-2 ring-primary border-primary' 
              : 'hover:border-primary/50'
          }`}
          onClick={() => onLayoutChange(layout.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{layout.name}</CardTitle>
              {selectedLayout === layout.id && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Preview do {layout.name}</div>
            </div>
            
            <p className="text-sm text-muted-foreground">{layout.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Características:</h4>
              <div className="flex flex-wrap gap-1">
                {layout.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
