// src/hooks/useGamificacao.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// A interface continua se chamando Gamificacao para consistência no app
export interface Gamificacao {
  id: string;
  nome: string;
  descricao: string;
  tipo_meta: 'checkin' | 'compra';
  meta: number;
  pontos: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  comercio_id?: string;
}

// --- HOOKS PARA COMERCIANTES ---
export const useMinhasGamificacoes = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-gamificacoes', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      // APONTANDO PARA A TABELA 'missions'
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gamificacao[];
    },
    enabled: !!comercioId,
  });
};

export const useCreateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaGamificacao: Omit<Gamificacao, 'id' | 'created_at' | 'updated_at'>) => {
      // APONTANDO PARA A TABELA 'missions'
      const { data, error } = await supabase.from('missions').insert(novaGamificacao).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', data.comercio_id] });
      toast.success('Gamificação (Missão) criada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Gamificacao> & { id: string }) => {
      // APONTANDO PARA A TABELA 'missions'
      const { data, error } = await supabase.from('missions').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', data.comercio_id] });
      toast.success('Gamificação (Missão) atualizada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comercio_id }: { id: string, comercio_id?: string }) => {
       // APONTANDO PARA A TABELA 'missions'
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (error) throw error;
      return { comercio_id };
    },
    onSuccess: ({ comercio_id }) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', comercio_id] });
      toast.success('Gamificação (Missão) excluída com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};