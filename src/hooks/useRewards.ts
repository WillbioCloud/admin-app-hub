// src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Recompensa {
  id: string;
  nome: string;
  descricao: string;
  pontos_necessarios: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  comercio_id?: string;
}

// --- HOOKS PARA COMERCIANTES ---
export const useMinhasRecompensas = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-recompensas', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      // APONTANDO PARA A TABELA 'rewards'
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recompensa[];
    },
    enabled: !!comercioId,
  });
};

export const useCreateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaRecompensa: Omit<Recompensa, 'id' | 'created_at' | 'updated_at'>) => {
      // APONTANDO PARA A TABELA 'rewards'
      const { data, error } = await supabase.from('rewards').insert(novaRecompensa).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', data.comercio_id] });
      toast.success('Recompensa criada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Recompensa> & { id: string }) => {
       // APONTANDO PARA A TABELA 'rewards'
      const { data, error } = await supabase.from('rewards').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', data.comercio_id] });
      toast.success('Recompensa atualizada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comercio_id }: { id: string, comercio_id?: string }) => {
       // APONTANDO PARA A TABELA 'rewards'
      const { error } = await supabase.from('rewards').delete().eq('id', id);
      if (error) throw error;
      return { comercio_id };
    },
    onSuccess: ({ comercio_id }) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', comercio_id] });
      toast.success('Recompensa excluída com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};