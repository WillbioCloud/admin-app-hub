import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, Loader2, AlertCircle } from 'lucide-react';
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

const PerfilPage = () => {
  const { user } = useAuth();
  const { data: meuComercio, isLoading, refetch } = useMeuComercio(user?.id);
  const createComercio = useCreateComercio();
  const updateComercio = useUpdateComercio();

  const [servicos, setServicos] = useState<string[]>([]);
  const [novoServico, setNovoServico] = useState('');
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);

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
      form.reset({
        nome: meuComercio.nome || '',
        categoria: meuComercio.categoria || '',
        descricao: meuComercio.descricao || '',
        whatsapp: meuComercio.whatsapp || '',
        instagram: meuComercio.instagram || '',
        endereco: meuComercio.endereco || '',
        horario_func: meuComercio.horario_func || '',
      });
      setServicos(meuComercio.servicos || []);
      setLogoPreview(meuComercio.logo_url);
      setCapaPreview(meuComercio.capa_url);
    }
  }, [meuComercio, form]);
  
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}-${folder}-${Date.now()}.${fileExt}`;
    const filePath = `comercios-media/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('app-media').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('app-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Você precisa estar logado.');
      return;
    }

    const payload: Partial<Comercio> = { ...data, servicos };

    if (logoFile) payload.logo_url = await uploadImage(logoFile, 'logo');
    if (capaFile) payload.capa_url = await uploadImage(capaFile, 'capa');

    if (meuComercio) {
      // Atualizar
      await updateComercio.mutateAsync({ ...payload, id: meuComercio.id });
    } else {
      // Criar
      await createComercio.mutateAsync({ ...payload, user_id: user.id });
    }
    refetch();
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
  
  const renderStatusCard = () => {
    if (!meuComercio) return null;
    switch(meuComercio.status) {
      case 'pending':
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6 flex items-center space-x-2">
              <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-orange-800">Aguardando Aprovação</h3>
                <p className="text-sm text-orange-700">Suas alterações foram enviadas para análise.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'rejected':
         return (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Cadastro Rejeitado</h3>
                <p className="text-sm text-red-700">Seu cadastro foi rejeitado. Contate o suporte para mais detalhes.</p>
              </div>
            </CardContent>
          </Card>
         );
      default: return null;
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  const isSubmitting = createComercio.isPending || updateComercio.isPending;
  const isPendingApproval = meuComercio?.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Perfil do Comércio</h2>
          <p className="text-muted-foreground">Gerencie as informações do seu estabelecimento.</p>
        </div>
        {meuComercio?.status === 'approved' && <Badge variant="default" className="bg-green-500">Ativo</Badge>}
      </div>

      {renderStatusCard()}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ... (O restante do código do formulário com os campos, como no exemplo anterior) ... */}
          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isSubmitting || isPendingApproval}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPendingApproval ? 'Aguardando Aprovação' : (meuComercio ? 'Salvar e Enviar para Aprovação' : 'Criar e Enviar para Aprovação')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PerfilPage;