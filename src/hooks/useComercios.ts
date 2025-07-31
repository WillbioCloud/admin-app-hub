import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Comercio {
  id: string;
  user_id: string;
  nome: string;
  categoria: string | null;
  descricao: string | null;
  logo_url: string | null;
  capa_url: string | null;
  galeria_urls: string[] | null;
  whatsapp: string | null;
  instagram: string | null;
  servicos: string[] | null;
  layout_template: string | null;
  primary_color: string | null;
  horario_func: any;
  ativo: boolean | null;
  created_at: string;
  updated_at: string;
}

// Hook para buscar comércios
export const useComercios = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar comércios:', error);
        throw error;
      }
      
      return data as Comercio[];
    },
  });
};

// Hook para aprovar comércio
export const useApproveComercio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ ativo: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao aprovar comércio:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      toast.success('Comércio aprovado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao aprovar comércio:', error);
      toast.error('Erro ao aprovar comércio');
    },
  });
};

// Hook para rejeitar comércio
export const useRejectComercio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ ativo: false })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao rejeitar comércio:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      toast.success('Comércio rejeitado');
    },
    onError: (error) => {
      console.error('Erro ao rejeitar comércio:', error);
      toast.error('Erro ao rejeitar comércio');
    },
  });
};

// Hook para deletar comércio
export const useDeleteComercio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('comercios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar comércio:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      toast.success('Comércio excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar comércio:', error);
      toast.error('Erro ao excluir comércio');
    },
  });
};