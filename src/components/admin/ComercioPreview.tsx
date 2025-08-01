import React from 'react';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Instagram,
  Calendar
} from 'lucide-react';
import { Comercio } from '@/hooks/useComercios';

interface ComercioPreviewProps {
  comercio: Comercio;
}

export const ComercioPreview = ({ comercio }: ComercioPreviewProps) => {
  const layout = comercio.layout_template as 'moderno' | 'classico' || 'moderno';
  const primaryColor = comercio.primary_color || '#3B82F6';
  
  return (
    <div className="space-y-6">
      {/* Header com informações do comércio */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{comercio.nome}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {comercio.categoria && (
                  <Badge variant="outline">{comercio.categoria}</Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  Template: {layout}
                </Badge>
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: primaryColor }}
                  title={`Cor principal: ${primaryColor}`}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(comercio.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informações de contato */}
            <div className="space-y-3">
              <h4 className="font-semibold">Informações de Contato</h4>
              <div className="space-y-2 text-sm">
                {comercio.whatsapp && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{comercio.whatsapp}</span>
                  </div>
                )}
                {comercio.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <span>{comercio.instagram}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <h4 className="font-semibold">Descrição</h4>
              <p className="text-sm text-muted-foreground">
                {comercio.descricao || 'Nenhuma descrição fornecida'}
              </p>
            </div>

            {/* Serviços */}
            {comercio.servicos && comercio.servicos.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Serviços</h4>
                <div className="flex flex-wrap gap-2">
                  {comercio.servicos.map((servico, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {servico}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Horário de funcionamento */}
            {comercio.horario_func && (
              <div className="space-y-3">
                <h4 className="font-semibold">Horário de Funcionamento</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {typeof comercio.horario_func === 'string' 
                      ? comercio.horario_func 
                      : JSON.stringify(comercio.horario_func)
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview do layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview do Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <LayoutPreview 
              layout={layout}
              primaryColor={primaryColor}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};