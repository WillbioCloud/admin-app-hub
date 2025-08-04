import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LayoutSelector } from '@/components/comerciante/LayoutSelector';
import { LayoutPreview } from '@/components/comerciante/LayoutPreview';
import { ColorSelector } from '@/components/comerciante/ColorSelector';
import { Clock, MapPin, Phone, Instagram, Loader2, AlertCircle, Upload, X, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMeuComercio, useCreateComercio, useUpdateComercio, Comercio } from '@/hooks/useComercios';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CATEGORIAS = ['Alimentação', 'Saúde', 'Fitness', 'Serviços', 'Varejo', 'Supermercado'];

const comercioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  categoria: z.string().min(1, 'Selecione uma categoria.'),
  descricao: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  endereco: z.string().optional(),
  horario_func: z.string().optional(),
});

type FormData = z.infer<typeof comercioSchema>;

const PersonalizacaoPage = () => {
  const { user } = useAuth();
  const { data: meuComercio, isLoading, refetch } = useMeuComercio(user?.id);
  const createComercio = useCreateComercio();
  const updateComercio = useUpdateComercio();
  
  const [selectedLayout, setSelectedLayout] = useState<'moderno' | 'classico'>('moderno');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [pendingChanges, setPendingChanges] = useState(false);

  // Estados para edição do comércio
  const [servicos, setServicos] = useState<string[]>([]);
  const [novoServico, setNovoServico] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(comercioSchema),
    defaultValues: {
      nome: '',
      categoria: '',
      descricao: '',
      whatsapp: '',
      instagram: '',
      endereco: '',
      horario_func: '',
    }
  });

  useEffect(() => {
    if (meuComercio) {
      setSelectedLayout(meuComercio.layout_template as 'moderno' | 'classico' || 'moderno');
      setSelectedColor(meuComercio.primary_color || '#3B82F6');
      
      // Carregar dados do formulário de comércio
      form.reset({
        nome: meuComercio.nome || '',
        categoria: meuComercio.categoria || '',
        descricao: meuComercio.descricao || '',
        whatsapp: meuComercio.whatsapp || '',
        instagram: meuComercio.instagram || '',
        endereco: (meuComercio as any).endereco || '',
        horario_func: typeof meuComercio.horario_func === 'object' 
          ? (meuComercio.horario_func as any).display_text || '' 
          : String(meuComercio.horario_func || ''),
      });
      setServicos(meuComercio.servicos || []);
      setLogoPreview(meuComercio.logo_url);
      setCapaPreview(meuComercio.capa_url);
      
      // Carregar galeria existente
      if (meuComercio.galeria_urls && meuComercio.galeria_urls.length > 0) {
        setGaleriaPreviews(meuComercio.galeria_urls);
      }
    }
  }, [meuComercio, form]);

  const handleLayoutChange = (layout: 'moderno' | 'classico') => {
    setSelectedLayout(layout);
    setPendingChanges(true);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setPendingChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!meuComercio) return;
    
    try {
      await updateComercio.mutateAsync({
        id: meuComercio.id,
        layout_template: selectedLayout,
        primary_color: selectedColor
      });
      setPendingChanges(false);
      toast.success('Alterações enviadas para aprovação!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    }
  };

  // Funções para edição do comércio
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}-${folder}-${Date.now()}.${fileExt}`;
    const filePath = `comercios-media/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('app-media').upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('app-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmitComercio = async (data: FormData) => {
    if (!user) {
      toast.error('Você precisa estar logado.');
      return;
    }

    try {
      // Formatar horário_func como objeto para compatibilidade com React Native
      const horarioFormatado = data.horario_func ? {
        display_text: data.horario_func
      } : null;

      const payload: Partial<Comercio> = { 
        ...data, 
        servicos,
        horario_func: horarioFormatado as any
      };

      // Upload das imagens
      if (logoFile) payload.logo_url = await uploadImage(logoFile, 'logo');
      if (capaFile) payload.capa_url = await uploadImage(capaFile, 'capa');
      
      // Upload da galeria
      if (galeriaFiles.length > 0) {
        const galeriaUrls = await Promise.all(
          galeriaFiles.map((file, index) => uploadImage(file, `galeria-${index}`))
        );
        payload.galeria_urls = [...galeriaPreviews.filter(url => url.startsWith('http')), ...galeriaUrls];
      }

      if (meuComercio) {
        await updateComercio.mutateAsync({ ...payload, id: meuComercio.id });
        toast.success('Comércio atualizado e enviado para aprovação!');
      } else {
        await createComercio.mutateAsync({ ...payload, user_id: user.id });
        toast.success('Comércio criado e enviado para aprovação!');
      }
      refetch();

    } catch(error: any) {
       toast.error(`Falha no processo: ${error.message}`);
    }
  };

  const adicionarServico = () => {
    if (novoServico.trim() && !servicos.includes(novoServico.trim())) {
      setServicos([...servicos, novoServico.trim()]);
      setNovoServico('');
    }
  };

  const removerServico = (servico: string) => {
    setServicos(servicos.filter(s => s !== servico));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: Function, setPreview: Function) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGaleriaFiles([...galeriaFiles, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGaleriaPreviews([...galeriaPreviews, ...newPreviews]);
    }
  };

  const removerImagemGaleria = (index: number) => {
    const newFiles = galeriaFiles.filter((_, i) => i !== index);
    const newPreviews = galeriaPreviews.filter((_, i) => i !== index);
    setGaleriaFiles(newFiles);
    setGaleriaPreviews(newPreviews);
  };
  
  const renderStatusCard = () => {
    if (!meuComercio || meuComercio.status === 'approved') return null;

    switch(meuComercio.status) {
      case 'pending':
        return (
          <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="pt-6 flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-orange-800">Aguardando Aprovação</h3>
                <p className="text-sm text-orange-700">Suas alterações foram enviadas para análise e estão bloqueadas para edição.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'rejected':
         return (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Cadastro Rejeitado</h3>
                <p className="text-sm text-red-700">Seu cadastro foi rejeitado. Faça as alterações necessárias e envie novamente.</p>
              </div>
            </CardContent>
          </Card>
         );
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isSubmitting = createComercio.isPending || updateComercio.isPending;
  const isPendingApproval = meuComercio?.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personalização</h2>
          <p className="text-muted-foreground">
            Configure as informações e aparência da sua página no aplicativo
          </p>
        </div>
        {meuComercio?.status === 'approved' && <Badge variant="default" className="bg-green-500">Aprovado e Ativo</Badge>}
      </div>

      {renderStatusCard()}

      {pendingChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Alterações Pendentes</h3>
                <p className="text-sm text-orange-700">Você tem alterações não salvas</p>
              </div>
              <Button 
                onClick={handleSaveChanges} 
                disabled={updateComercio.isPending}
              >
                {updateComercio.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar para Aprovação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={!meuComercio ? "comercio" : "layout"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comercio">Comércio</TabsTrigger>
          <TabsTrigger value="layout" disabled={!meuComercio}>Layout</TabsTrigger>
          <TabsTrigger value="cores" disabled={!meuComercio}>Cores</TabsTrigger>
          <TabsTrigger value="preview" disabled={!meuComercio}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="comercio" className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitComercio)} className="space-y-8">
              
              {/* SEÇÃO DE DADOS PRINCIPAIS */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Principais</CardTitle>
                  <CardDescription>Estes são os dados que os clientes verão primeiro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Comércio</FormLabel>
                        <FormControl><Input placeholder="Ex: Barbearia do Zé" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIAS.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Curta</FormLabel>
                        <FormControl><Textarea placeholder="Fale um pouco sobre seu negócio..." {...field} /></FormControl>
                         <FormDescription>Máximo 300 caracteres.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* SEÇÃO DE IMAGENS */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagens e Identidade Visual</CardTitle>
                  <CardDescription>Faça upload da logo e uma imagem de capa.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormItem>
                        <FormLabel>Logo (1:1)</FormLabel>
                        <FormControl>
                           <Input type="file" onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)} className="hidden" id="logo-upload" />
                        </FormControl>
                        <label htmlFor="logo-upload" className="cursor-pointer border-2 border-dashed rounded-md w-full h-48 flex items-center justify-center">
                            {logoPreview ? <img src={logoPreview} alt="Preview" className="h-full w-full object-cover"/> : <Upload className="h-8 w-8 text-muted-foreground" />}
                        </label>
                    </FormItem>
                     <FormItem>
                        <FormLabel>Imagem de Capa (16:9)</FormLabel>
                        <FormControl>
                           <Input type="file" onChange={(e) => handleFileChange(e, setCapaFile, setCapaPreview)} className="hidden" id="capa-upload" />
                        </FormControl>
                        <label htmlFor="capa-upload" className="cursor-pointer border-2 border-dashed rounded-md w-full h-48 flex items-center justify-center">
                            {capaPreview ? <img src={capaPreview} alt="Preview" className="h-full w-full object-cover"/> : <Upload className="h-8 w-8 text-muted-foreground" />}
                        </label>
                    </FormItem>
                 </CardContent>
               </Card>

               {/* SEÇÃO DE GALERIA */}
               <Card>
                 <CardHeader>
                   <CardTitle>Galeria de Imagens</CardTitle>
                   <CardDescription>Adicione até 10 imagens para mostrar seu negócio (aparece no app)</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <FormItem>
                     <FormLabel>Adicionar Imagens à Galeria</FormLabel>
                     <FormControl>
                       <Input 
                         type="file" 
                         multiple 
                         accept="image/*"
                         onChange={handleGaleriaChange} 
                         className="hidden" 
                         id="galeria-upload" 
                       />
                     </FormControl>
                     <label htmlFor="galeria-upload" className="cursor-pointer border-2 border-dashed rounded-md w-full h-32 flex items-center justify-center">
                       <div className="text-center">
                         <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                         <p className="text-sm text-muted-foreground">Clique para adicionar imagens</p>
                       </div>
                     </label>
                   </FormItem>
                   
                   {/* Preview da Galeria */}
                   {galeriaPreviews.length > 0 && (
                     <div className="mt-4">
                       <h4 className="text-sm font-medium mb-2">Imagens na Galeria ({galeriaPreviews.length})</h4>
                       <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                         {galeriaPreviews.map((preview, index) => (
                           <div key={index} className="relative group">
                             <img 
                               src={preview} 
                               alt={`Galeria ${index + 1}`} 
                               className="w-full h-24 object-cover rounded border"
                             />
                             <button
                               type="button"
                               onClick={() => removerImagemGaleria(index)}
                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <X className="h-3 w-3" />
                             </button>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </CardContent>
               </Card>

               {/* SEÇÃO DE CONTATO E LOCAL */}
              <Card>
                <CardHeader>
                  <CardTitle>Contato e Localização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl><Input placeholder="@seuusuario" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl><Input placeholder="Rua, Número, Bairro, Cidade" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="horario_func"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Funcionamento</FormLabel>
                        <FormControl><Input placeholder="Seg à Sex, 09h às 18h" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* SEÇÃO DE SERVIÇOS */}
               <Card>
                <CardHeader>
                  <CardTitle>Serviços / Palavras-chave</CardTitle>
                  <CardDescription>Adicione tags que descrevem seus serviços para ajudar os clientes a te encontrarem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input value={novoServico} onChange={(e) => setNovoServico(e.target.value)} placeholder="Ex: Corte de cabelo" />
                        <Button type="button" onClick={adicionarServico}><Plus className="h-4 w-4"/></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {servicos.map(s => (
                            <Badge key={s} variant="secondary" className="text-base py-1">
                                {s}
                                <button type="button" onClick={() => removerServico(s)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
               </Card>

              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isSubmitting || isPendingApproval} size="lg">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPendingApproval ? 'Aguardando Aprovação' : (meuComercio ? 'Salvar e Enviar para Aprovação' : 'Criar e Enviar para Aprovação')}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha do Layout</CardTitle>
              <CardDescription>
                Selecione o layout que melhor representa seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutSelector 
                selectedLayout={selectedLayout}
                onLayoutChange={handleLayoutChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
              <CardDescription>
                Defina a cor principal da sua página
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorSelector 
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Página</CardTitle>
              <CardDescription>
                Veja como sua página aparecerá no aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LayoutPreview 
                layout={selectedLayout}
                primaryColor={selectedColor}
                comercioData={meuComercio}
                onUpdateComercio={async (updates) => {
                  if (meuComercio?.id) {
                    try {
                      const { error } = await supabase
                        .from('comercios')
                        .update(updates)
                        .eq('id', meuComercio.id);
                      
                      if (error) throw error;
                      
                      // Revalidar dados
                      refetch();
                      toast.success('Dados atualizados com sucesso!');
                    } catch (error) {
                      console.error('Erro ao atualizar:', error);
                      toast.error('Erro ao atualizar dados');
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalizacaoPage;