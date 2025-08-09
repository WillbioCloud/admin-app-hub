import React, { useState } from 'react';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  ArrowLeft,
  ZoomIn,
  Download,
  ExternalLink
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumo">
            <User className="h-4 w-4 mr-2" />
            Resumo
          </TabsTrigger>
          <TabsTrigger value="imagens">
            <ImageIcon className="h-4 w-4 mr-2" />
            Imagens
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
                  Resumo de Mídia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Logo:</span>
                    <span className={comercio.logo_url ? "text-green-600" : "text-red-600"}>
                      {comercio.logo_url ? "✓ Disponível" : "✗ Não definido"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capa:</span>
                    <span className={comercio.capa_url ? "text-green-600" : "text-red-600"}>
                      {comercio.capa_url ? "✓ Disponível" : "✗ Não definido"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Galeria:</span>
                    <span className={comercio.galeria_urls?.length ? "text-green-600" : "text-red-600"}>
                      {comercio.galeria_urls?.length ? `✓ ${comercio.galeria_urls.length} imagens` : "✗ Sem imagens"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de imagens:</span>
                    <span className="font-semibold">
                      {(comercio.logo_url ? 1 : 0) + (comercio.capa_url ? 1 : 0) + (comercio.galeria_urls?.length || 0)}
                    </span>
                  </div>
                </div>
                
                {/* Preview rápido das imagens */}
                <div className="flex gap-2 mt-4">
                  {comercio.logo_url && (
                    <img src={comercio.logo_url} alt="Logo" className="w-12 h-12 object-cover rounded border" />
                  )}
                  {comercio.capa_url && (
                    <img src={comercio.capa_url} alt="Capa" className="w-12 h-12 object-cover rounded border" />
                  )}
                  {comercio.galeria_urls?.slice(0, 3).map((url, index) => (
                    <img key={index} src={url} alt={`Galeria ${index + 1}`} className="w-12 h-12 object-cover rounded border" />
                  ))}
                  {(comercio.galeria_urls?.length || 0) > 3 && (
                    <div className="w-12 h-12 rounded border bg-muted flex items-center justify-center text-xs">
                      +{(comercio.galeria_urls?.length || 0) - 3}
                    </div>
                  )}
                </div>
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

        {/* Tab Imagens Detalhada */}
        <TabsContent value="imagens" className="space-y-6">
          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo do Comércio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comercio.logo_url ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={comercio.logo_url} 
                      alt="Logo" 
                      className="w-24 h-24 object-cover rounded-lg border shadow-sm" 
                    />
                    <div className="space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ZoomIn className="h-4 w-4 mr-2" />
                            Visualizar Ampliado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <img 
                            src={comercio.logo_url} 
                            alt="Logo Ampliado" 
                            className="w-full h-auto rounded-lg" 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" asChild>
                        <a href={comercio.logo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Original
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>URL:</strong> {comercio.logo_url}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum logo definido para este comércio</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagem de Capa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comercio.capa_url ? (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <img 
                      src={comercio.capa_url} 
                      alt="Capa" 
                      className="w-full h-48 object-cover rounded-lg border shadow-sm" 
                    />
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ZoomIn className="h-4 w-4 mr-2" />
                            Visualizar Ampliado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img 
                            src={comercio.capa_url} 
                            alt="Capa Ampliada" 
                            className="w-full h-auto rounded-lg" 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" asChild>
                        <a href={comercio.capa_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Original
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>URL:</strong> {comercio.capa_url}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma imagem de capa definida para este comércio</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Galeria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Galeria de Imagens {comercio.galeria_urls?.length ? `(${comercio.galeria_urls.length} imagens)` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {comercio.galeria_urls && comercio.galeria_urls.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {comercio.galeria_urls.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative group">
                          <img 
                            src={url} 
                            alt={`Galeria ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="secondary" size="sm">
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <div className="space-y-4">
                                  <img 
                                    src={url} 
                                    alt={`Galeria ${index + 1} Ampliada`} 
                                    className="w-full h-auto rounded-lg" 
                                  />
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Imagem {index + 1} de {comercio.galeria_urls?.length}
                                    </span>
                                    <Button variant="outline" size="sm" asChild>
                                      <a href={url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Abrir Original
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          Imagem {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* URLs da galeria */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">URLs das imagens:</h4>
                    <div className="space-y-1 text-xs text-muted-foreground bg-muted p-3 rounded max-h-32 overflow-y-auto">
                      {comercio.galeria_urls.map((url, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{index + 1}. {url}</span>
                          <Button variant="ghost" size="sm" asChild className="h-6 px-2">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhuma imagem na galeria</p>
                  <p className="text-sm">Este comércio ainda não possui imagens na galeria</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo de todas as imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Geral de Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {comercio.logo_url ? 1 : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Logo</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {comercio.capa_url ? 1 : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Capa</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {comercio.galeria_urls?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Galeria</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {(comercio.logo_url ? 1 : 0) + (comercio.capa_url ? 1 : 0) + (comercio.galeria_urls?.length || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

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