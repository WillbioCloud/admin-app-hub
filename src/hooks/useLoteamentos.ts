import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoteamentoCompleto {
  id: string;
  name: string;
  city: string;
  description: string;
  image_url: string;
  logo_url: string;
  features: string[];
  total_lots: number;
  available_lots: number;
  is_selling: boolean;
  has_transport: boolean;
  stages: any;
  main_video_url: string;
  logo: string;
  ativo_destaque: boolean; // Se tem destaque ativo
}

export interface UpdateLoteamentoData {
  name?: string;
  city?: string;
  description?: string;
  image_url?: string;
  logo_url?: string;
  features?: string[];
  total_lots?: number;
  available_lots?: number;
  is_selling?: boolean;
  has_transport?: boolean;
  main_video_url?: string;
}

export const useLoteamentos = () => {
  return useQuery({
    queryKey: ['loteamentos-completos'],
    queryFn: async () => {
      // Buscar todos os loteamentos
      const { data: loteamentos, error: loteamentosError } = await supabase
        .from('loteamentos')
        .select('*')
        .order('name');

      if (loteamentosError) throw loteamentosError;

      // Buscar quais têm destaque ativo
      const { data: destaques, error: destaquesError } = await supabase
        .from('loteamento_destaques')
        .select('loteamento_id, ativo')
        .eq('ativo', true);

      if (destaquesError) throw destaquesError;

      // Combinar dados
      const loteamentosCompletos = loteamentos?.map(loteamento => ({
        ...loteamento,
        ativo_destaque: destaques?.some(d => d.loteamento_id === loteamento.id) || false
      })) || [];

      return loteamentosCompletos as LoteamentoCompleto[];
    },
  });
};

export const useUpdateLoteamento = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLoteamentoData }) => {
      const { data: result, error } = await supabase
        .from('loteamentos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loteamentos-completos'] });
      toast({
        title: "Sucesso",
        description: "Loteamento atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar loteamento",
        variant: "destructive",
      });
    },
  });
};

export const useToggleLoteamentoDestaque = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ loteamento_id, ativo }: { loteamento_id: string; ativo: boolean }) => {
      if (ativo) {
        // Ativar destaque - inserir ou atualizar
        const { data, error } = await supabase
          .from('loteamento_destaques')
          .upsert({ 
            loteamento_id, 
            nome: loteamento_id, // Temporário, pode ajustar depois
            ativo: true 
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Desativar destaque
        const { error } = await supabase
          .from('loteamento_destaques')
          .update({ ativo: false })
          .eq('loteamento_id', loteamento_id);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { ativo }) => {
      queryClient.invalidateQueries({ queryKey: ['loteamentos-completos'] });
      toast({
        title: "Sucesso",
        description: `Destaque ${ativo ? 'ativado' : 'desativado'} com sucesso!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do destaque",
        variant: "destructive",
      });
    },
  });
};