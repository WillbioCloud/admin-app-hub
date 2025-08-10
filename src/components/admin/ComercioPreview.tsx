import React, { useState, useEffect } from 'react';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ExternalLink,
  Upload,
  X,
  Save,
  Plus
} from 'lucide-react';
import { Comercio, useAdminUpdateComercio } from '@/hooks/useComercios';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComercioPreviewProps {
  comercio: Comercio;
  isEditing?: boolean;
  onSaveSuccess?: () => void;
}

export const ComercioPreview = ({ comercio, isEditing = false, onSaveSuccess }: ComercioPreviewProps) => {
  const [activeTab, setActiveTab] = useState("resumo");
  
  // Estados para edição
  const [editData, setEditData] = useState(comercio);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(comercio.logo_url);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(comercio.capa_url);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>(comercio.galeria_urls || []);
  const [loading, setSaving] = useState(false);
  
  const updateComercio = useAdminUpdateComercio();

  // Resetar dados quando o comércio mudar
  useEffect(() => {
    setEditData(comercio);
    setLogoPreview(comercio.logo_url);
    setCapaPreview(comercio.capa_url);
    setGaleriaPreviews(comercio.galeria_urls || []);
    setLogoFile(null);
    setCapaFile(null);
    setGaleriaFiles([]);
  }, [comercio]);

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${comercio.user_id}-${folder}-${Date.now()}.${fileExt}`;
    const filePath = `comercios-media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('app-media')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('app-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'capa' | 'galeria') => {
    const files = event.target.files;
    if (!files) return;

    if (type === 'logo' && files[0]) {
      setLogoFile(files[0]);
      setLogoPreview(URL.createObjectURL(files[0]));
    } else if (type === 'capa' && files[0]) {
      setCapaFile(files[0]);
      setCapaPreview(URL.createObjectURL(files[0]));
    } else if (type === 'galeria') {
      const newFiles = Array.from(files);
      setGaleriaFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setGaleriaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removerImagemGaleria = (index: number) => {
    const isNewFile = index >= (comercio.galeria_urls?.length || 0);
    
    if (isNewFile) {
      // Remove arquivo novo
      const fileIndex = index - (comercio.galeria_urls?.length || 0);
      setGaleriaFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    
    setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = { ...editData };

      // Upload das imagens
      if (logoFile) payload.logo_url = await uploadImage(logoFile, 'logo');
      if (capaFile) payload.capa_url = await uploadImage(capaFile, 'capa');
      
      // Upload da galeria (apenas novos arquivos)
      if (galeriaFiles.length > 0) {
        const galeriaUrls = await Promise.all(
          galeriaFiles.map((file, index) => uploadImage(file, `galeria-${index}`))
        );
        
        // Combinar URLs existentes com novas
        const existingUrls = comercio.galeria_urls || [];
        const newGaleriaUrls = galeriaPreviews.slice(0, existingUrls.length);
        payload.galeria_urls = [...newGaleriaUrls, ...galeriaUrls];
      } else {
        // Manter apenas as URLs que ainda estão nos previews
        payload.galeria_urls = galeriaPreviews.filter(url => url.startsWith('http'));
      }

      await updateComercio.mutateAsync({ id: comercio.id, ...payload });
      onSaveSuccess?.();
      
    } catch (error: any) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const currentData = isEditing ? editData : comercio;
  const layout = currentData.layout_template as 'moderno' | 'classico' || 'moderno';
  const primaryColor = currentData.primary_color || '#3B82F6';
  
  return (
    <div className="space-y-6">
      {/* Botão Salvar quando em modo edição */}
      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading || updateComercio.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {loading || updateComercio.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      )}
      {/* Header com informações básicas e status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {isEditing ? (
                  <Input 
                    value={editData.nome} 
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    className="text-2xl font-bold border-dashed"
                  />
                ) : (
                  currentData.nome
                )}
                {currentData.status === 'pending' && !isEditing && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 animate-pulse">
                    NEW
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {isEditing ? (
                  <Input 
                    value={editData.categoria || ''} 
                    onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                    placeholder="Categoria"
                    className="w-32 border-dashed"
                  />
                ) : (
                  currentData.categoria && (
                    <Badge variant="outline">{currentData.categoria}</Badge>
                  )
                )}
                <Badge 
                  variant={currentData.status === 'approved' ? 'default' : 
                           currentData.status === 'pending' ? 'secondary' : 'destructive'}
                >
                  {currentData.status === 'approved' ? 'Aprovado' : 
                   currentData.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                </Badge>
                <Badge variant={currentData.ativo ? 'default' : 'destructive'}>
                  {currentData.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-4 w-4" />
                Criado: {new Date(currentData.created_at).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Atualizado: {new Date(currentData.updated_at).toLocaleDateString('pt-BR')}
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
                 {isEditing ? (
                   <div className="space-y-3">
                     <div>
                       <Label className="text-sm">WhatsApp</Label>
                       <Input 
                         value={editData.whatsapp || ''} 
                         onChange={(e) => setEditData({...editData, whatsapp: e.target.value})}
                         placeholder="(11) 99999-9999"
                       />
                     </div>
                     <div>
                       <Label className="text-sm">Instagram</Label>
                       <Input 
                         value={editData.instagram || ''} 
                         onChange={(e) => setEditData({...editData, instagram: e.target.value})}
                         placeholder="@usuario"
                       />
                     </div>
                     <div>
                       <Label className="text-sm">Endereço</Label>
                       <Input 
                         value={editData.endereco || ''} 
                         onChange={(e) => setEditData({...editData, endereco: e.target.value})}
                         placeholder="Rua, número, bairro"
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <Label className="text-sm">Latitude</Label>
                         <Input 
                           type="number"
                           step="any"
                           value={editData.latitude || ''} 
                           onChange={(e) => setEditData({...editData, latitude: parseFloat(e.target.value) || null})}
                           placeholder="-23.550520"
                         />
                       </div>
                       <div>
                         <Label className="text-sm">Longitude</Label>
                         <Input 
                           type="number"
                           step="any"
                           value={editData.longitude || ''} 
                           onChange={(e) => setEditData({...editData, longitude: parseFloat(e.target.value) || null})}
                           placeholder="-46.633308"
                         />
                       </div>
                     </div>
                   </div>
                 ) : (
                   <>
                     {currentData.whatsapp && (
                       <div className="flex items-center gap-2">
                         <Phone className="h-4 w-4 text-muted-foreground" />
                         <span>{currentData.whatsapp}</span>
                       </div>
                     )}
                     {currentData.instagram && (
                       <div className="flex items-center gap-2">
                         <Instagram className="h-4 w-4 text-muted-foreground" />
                         <span>{currentData.instagram}</span>
                       </div>
                     )}
                     {currentData.endereco && (
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4 text-muted-foreground" />
                         <span>{currentData.endereco}</span>
                       </div>
                     )}
                     {(currentData.latitude && currentData.longitude) && (
                       <div className="flex items-center gap-2">
                         <MapPin className="h-4 w-4 text-muted-foreground" />
                         <span className="text-xs">
                           {currentData.latitude.toFixed(6)}, {currentData.longitude.toFixed(6)}
                         </span>
                       </div>
                     )}
                   </>
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
                 {isEditing ? (
                   <div>
                     <Label className="text-sm">Descrição</Label>
                     <Textarea 
                       value={editData.descricao || ''} 
                       onChange={(e) => setEditData({...editData, descricao: e.target.value})}
                       placeholder="Descreva o comércio..."
                       className="min-h-[100px]"
                     />
                   </div>
                 ) : (
                   <p className="text-sm text-muted-foreground">
                     {currentData.descricao || 'Nenhuma descrição fornecida'}
                   </p>
                 )}
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
                {isEditing && (
                  <Badge variant="outline" className="text-xs">
                    Editável
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logoPreview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="w-24 h-24 object-cover rounded-lg border shadow-sm" 
                    />
                    <div className="space-y-2">
                      {isEditing && (
                        <div className="space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo')}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Label htmlFor="logo-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {logoFile ? 'Trocar Logo' : 'Atualizar Logo'}
                              </span>
                            </Button>
                          </Label>
                          {logoFile && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Novo arquivo selecionado
                            </Badge>
                          )}
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ZoomIn className="h-4 w-4 mr-2" />
                            Visualizar Ampliado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <img 
                            src={logoPreview} 
                            alt="Logo Ampliado" 
                            className="w-full h-auto rounded-lg" 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" asChild>
                        <a href={logoPreview} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Original
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>URL:</strong> {logoPreview}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum logo definido para este comércio</p>
                  {isEditing && (
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="hidden"
                        id="logo-upload-empty"
                      />
                      <Label htmlFor="logo-upload-empty" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Logo
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
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
                {isEditing && (
                  <Badge variant="outline" className="text-xs">
                    Editável
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {capaPreview ? (
                <div className="space-y-4">
                  <div className="space-y-4">
                    <img 
                      src={capaPreview} 
                      alt="Capa" 
                      className="w-full h-48 object-cover rounded-lg border shadow-sm" 
                    />
                    <div className="flex gap-2">
                      {isEditing && (
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'capa')}
                            className="hidden"
                            id="capa-upload"
                          />
                          <Label htmlFor="capa-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {capaFile ? 'Trocar Capa' : 'Atualizar Capa'}
                              </span>
                            </Button>
                          </Label>
                          {capaFile && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Novo arquivo selecionado
                            </Badge>
                          )}
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ZoomIn className="h-4 w-4 mr-2" />
                            Visualizar Ampliado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img 
                            src={capaPreview} 
                            alt="Capa Ampliada" 
                            className="w-full h-auto rounded-lg" 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" asChild>
                        <a href={capaPreview} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Original
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>URL:</strong> {capaPreview}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma imagem de capa definida para este comércio</p>
                  {isEditing && (
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'capa')}
                        className="hidden"
                        id="capa-upload-empty"
                      />
                      <Label htmlFor="capa-upload-empty" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Capa
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Galeria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Galeria de Imagens {galeriaPreviews?.length ? `(${galeriaPreviews.length} imagens)` : ''}
                {isEditing && (
                  <Badge variant="outline" className="text-xs">
                    Editável
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {galeriaPreviews && galeriaPreviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galeriaPreviews.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative group">
                          <img 
                            src={url} 
                            alt={`Galeria ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105" 
                          />
                          {isEditing && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removerImagemGaleria(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            {!isEditing && (
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
                                        Imagem {index + 1} de {galeriaPreviews?.length}
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
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          Imagem {index + 1}
                          {index >= (comercio.galeria_urls?.length || 0) && (
                            <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800">
                              NOVA
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botão para adicionar mais imagens */}
                  {isEditing && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'galeria')}
                        className="hidden"
                        id="galeria-upload"
                      />
                      <Label htmlFor="galeria-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500">Adicionar mais imagens à galeria</p>
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Plus className="h-4 w-4 mr-2" />
                              Selecionar Imagens
                            </span>
                          </Button>
                        </div>
                      </Label>
                    </div>
                  )}
                  
                  {/* URLs da galeria */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">URLs das imagens:</h4>
                    <div className="space-y-1 text-xs text-muted-foreground bg-muted p-3 rounded max-h-32 overflow-y-auto">
                      {galeriaPreviews.map((url, index) => (
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
                  {isEditing && (
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'galeria')}
                        className="hidden"
                        id="galeria-upload-empty"
                      />
                      <Label htmlFor="galeria-upload-empty" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Imagens
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
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