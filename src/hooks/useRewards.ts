// src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface atualizada para coincidir com a estrutura da tabela rewards
export interface Reward {
  id: string;
  title: string;
  description: string;
  coin_cost: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  mission_unlock_id: string | null;
  mission_id_unlock: string | null;
  created_at: string;
  created_by: string | null;
  comercio_id?: string;
}

// Alias para manter compatibilidade
export type Recompensa = Reward;

export const useMinhasRecompensas = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-recompensas', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('created_by', comercioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!comercioId,
  });
};

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaRecompensa: any) => {
      const { data, error } = await supabase.from('rewards').insert(novaRecompensa).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa criada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useCreateReward = useCreateRecompensa;

export const useUpdateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase.from('rewards').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa atualizada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateReward = useUpdateRecompensa;

export const useDeleteRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('rewards').delete().eq('id', id);
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas'] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa excluída com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteReward = useDeleteRecompensa;