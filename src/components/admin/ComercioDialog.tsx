import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Plus } from 'lucide-react';
import { LayoutSelector } from '@/components/comerciante/LayoutSelector';
import { ColorSelector } from '@/components/comerciante/ColorSelector';

const CATEGORIAS = ['Alimentação', 'Saúde', 'Fitness', 'Serviços', 'Varejo', 'Supermercado'];

const comercioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  descricao: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  endereco: z.string().optional(),
  horario_func: z.string().optional(),
});

type ComercioFormData = z.infer<typeof comercioSchema>;

interface ComercioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ComercioDialog({ open, onOpenChange, onSuccess }: ComercioDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'moderno' | 'classico'>('moderno');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [servicos, setServicos] = useState<string[]>([]);
  const [novoServico, setNovoServico] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>([]);

  const form = useForm<ComercioFormData>({
    resolver: zodResolver(comercioSchema),
    defaultValues: {
      nome: '',
      categoria: '',
      descricao: '',
      whatsapp: '',
      instagram: '',
      endereco: '',
      horario_func: '',
    },
  });

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${folder}-${Date.now()}.${fileExt}`;
    const filePath = `comercios-media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('app-media')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('app-media').getPublicUrl(filePath);
    return data.publicUrl;
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
    setGaleriaFiles(prev => prev.filter((_, i) => i !== index));
    setGaleriaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: ComercioFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Formatar horário_func como objeto para compatibilidade
      const horarioFormatado = data.horario_func ? {
        display_text: data.horario_func
      } : null;

      const payload: any = {
        ...data,
        servicos,
        layout_template: selectedLayout,
        primary_color: selectedColor,
        horario_func: horarioFormatado,
        user_id: user.id,
        status: 'approved', // Admin cria já aprovado
        ativo: true, // Admin cria já ativo
      };

      // Upload das imagens
      if (logoFile) payload.logo_url = await uploadImage(logoFile, 'logo');
      if (capaFile) payload.capa_url = await uploadImage(capaFile, 'capa');
      
      // Upload da galeria
      if (galeriaFiles.length > 0) {
        const galeriaUrls = await Promise.all(
          galeriaFiles.map((file, index) => uploadImage(file, `galeria-${index}`))
        );
        payload.galeria_urls = galeriaUrls;
      }

      const { error } = await supabase.from('comercios').insert(payload);
      if (error) throw error;

      toast.success('Comércio criado com sucesso!');
      onSuccess();
      onOpenChange(false);
      
      // Reset form and states
      form.reset();
      setServicos([]);
      setSelectedLayout('moderno');
      setSelectedColor('#3B82F6');
      setLogoFile(null);
      setLogoPreview(null);
      setCapaFile(null);
      setCapaPreview(null);
      setGaleriaFiles([]);
      setGaleriaPreviews([]);
      
    } catch (error: any) {
      console.error('Erro ao criar comércio:', error);
      toast.error(`Erro ao criar comércio: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Comércio</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Comércio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Restaurante do João" {...field} />
                      </FormControl>
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
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIAS.map(categoria => (
                            <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva seu negócio, produtos e serviços..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="Ex: Seg-Sex 9h-18h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contatos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contatos</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Serviços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Serviços Oferecidos</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar serviço"
                  value={novoServico}
                  onChange={(e) => setNovoServico(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarServico())}
                />
                <Button type="button" onClick={adicionarServico} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {servicos.map((servico, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {servico}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removerServico(servico)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Imagens */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Imagens</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Logo */}
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-32 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Clique para fazer upload do logo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                          <Button type="button" size="sm" className="mt-2">Selecionar Logo</Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capa */}
                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {capaPreview ? (
                      <div className="relative">
                        <img src={capaPreview} alt="Capa preview" className="w-full h-32 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setCapaFile(null);
                            setCapaPreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Clique para fazer upload da capa</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'capa')}
                          className="hidden"
                          id="capa-upload"
                        />
                        <Label htmlFor="capa-upload" className="cursor-pointer">
                          <Button type="button" size="sm" className="mt-2">Selecionar Capa</Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Galeria */}
              <div className="space-y-2">
                <Label>Galeria de Imagens</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {galeriaPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Galeria ${index}`} className="w-full h-20 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 w-6 h-6 p-0"
                          onClick={() => removerImagemGaleria(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Adicione imagens à galeria</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, 'galeria')}
                      className="hidden"
                      id="galeria-upload"
                    />
                    <Label htmlFor="galeria-upload" className="cursor-pointer">
                      <Button type="button" size="sm" className="mt-2">Adicionar Imagens</Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout e Cores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personalização Visual</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Template de Layout</Label>
                  <LayoutSelector 
                    selectedLayout={selectedLayout} 
                    onLayoutChange={setSelectedLayout} 
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cor Principal</Label>
                  <ColorSelector 
                    selectedColor={selectedColor} 
                    onColorChange={setSelectedColor} 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Comércio'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}