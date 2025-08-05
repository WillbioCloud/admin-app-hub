import React, { useState } from 'react';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Instagram,
  Calendar,
  Star,
  User,
  Eye,
  Image as ImageIcon,
  Palette,
  Heart,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { Comercio } from '@/hooks/useComercios';

interface ComercioPreviewProps {
  comercio: Comercio;
}

export const ComercioPreview = ({ comercio }: ComercioPreviewProps) => {
  const [activeTab, setActiveTab] = useState("resumo");
  const layout = comercio.layout_template as 'moderno' | 'classico' || 'moderno';
  const primaryColor = comercio.primary_color || '#3B82F6';
  
  return (
    <div className="space-y-6">
      {/* Header com informações básicas e status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{comercio.nome}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {comercio.categoria && (
                  <Badge variant="outline">{comercio.categoria}</Badge>
                )}
                <Badge 
                  variant={comercio.status === 'approved' ? 'default' : 
                           comercio.status === 'pending' ? 'secondary' : 'destructive'}
                >
                  {comercio.status === 'approved' ? 'Aprovado' : 
                   comercio.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                </Badge>
                <Badge variant={comercio.ativo ? 'default' : 'destructive'}>
                  {comercio.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-4 w-4" />
                Criado: {new Date(comercio.created_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Atualizado: {new Date(comercio.updated_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs com diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo">
            <User className="h-4 w-4 mr-2" />
            Resumo
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Eye className="h-4 w-4 mr-2" />
            Layout Clássico
          </TabsTrigger>
          <TabsTrigger value="moderno">
            <Star className="h-4 w-4 mr-2" />
            Layout Moderno
          </TabsTrigger>
          <TabsTrigger value="card">
            <ImageIcon className="h-4 w-4 mr-2" />
            Card do App
          </TabsTrigger>
        </TabsList>

        {/* Tab Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                {comercio.endereco && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{comercio.endereco}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personalização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Template:</span>
                  <Badge variant="secondary">{layout}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Cor principal:</span>
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="text-sm text-muted-foreground">{primaryColor}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {comercio.descricao || 'Nenhuma descrição fornecida'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Mídia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {comercio.logo_url && (
                  <div>
                    <span className="text-sm font-medium">Logo:</span>
                    <img src={comercio.logo_url} alt="Logo" className="w-16 h-16 object-cover rounded mt-1" />
                  </div>
                )}
                {comercio.capa_url && (
                  <div>
                    <span className="text-sm font-medium">Capa:</span>
                    <img src={comercio.capa_url} alt="Capa" className="w-full h-24 object-cover rounded mt-1" />
                  </div>
                )}
                {comercio.galeria_urls && comercio.galeria_urls.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Galeria ({comercio.galeria_urls.length} imagens):</span>
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {comercio.galeria_urls.map((url, index) => (
                        <img key={index} src={url} alt={`Galeria ${index + 1}`} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Serviços e Horários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comercio.servicos && comercio.servicos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Serviços ({comercio.servicos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {comercio.servicos.map((servico, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {servico}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {comercio.horario_func && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-sm">
                    {typeof comercio.horario_func === 'string' 
                      ? comercio.horario_func 
                      : JSON.stringify(comercio.horario_func)
                    }
                  </span>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab Layout Clássico */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview do Layout Clássico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <LayoutPreview 
                  layout="classico"
                  primaryColor={primaryColor}
                  comercioData={{
                    nome: comercio.nome,
                    descricao: comercio.descricao,
                    categoria: comercio.categoria,
                    whatsapp: comercio.whatsapp,
                    instagram: comercio.instagram,
                    endereco: comercio.endereco,
                    horario_func: comercio.horario_func,
                    servicos: comercio.servicos,
                    logo_url: comercio.logo_url,
                    galeria_urls: comercio.galeria_urls
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Layout Moderno */}
        <TabsContent value="moderno">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview do Layout Moderno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <LayoutPreview 
                  layout="moderno"
                  primaryColor={primaryColor}
                  comercioData={{
                    nome: comercio.nome,
                    descricao: comercio.descricao,
                    categoria: comercio.categoria,
                    whatsapp: comercio.whatsapp,
                    instagram: comercio.instagram,
                    endereco: comercio.endereco,
                    horario_func: comercio.horario_func,
                    servicos: comercio.servicos,
                    logo_url: comercio.logo_url,
                    galeria_urls: comercio.galeria_urls
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Card do App */}
        <TabsContent value="card">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como aparece na lista do App</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  {/* Simulação do CommerceCard do React Native */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    {/* Imagem de capa */}
                    <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600">
                      {comercio.capa_url ? (
                        <img src={comercio.capa_url} alt="Capa" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                      
                      {/* Tags */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/50 text-white text-xs">
                          {comercio.categoria}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-400 text-black text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{comercio.nome}</h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-bold">4.8</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Cidade Inteligente</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {comercio.descricao || 'Descrição do comércio aparecerá aqui.'}
                      </p>
                      
                      {/* Botões de ação */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 text-sm" 
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm">
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};