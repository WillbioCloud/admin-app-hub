// src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  title: string;
  description: string | null;
  coin_cost: number;
  stock: number | null;
  is_active: boolean;
  created_at: string;
  comercio_id?: string | null;
  created_by?: string | null;
  image_url?: string | null;
  mission_unlock_id?: string | null;
  mission_id_unlock?: string | null;
}

// Legacy interface name for backwards compatibility
export interface Recompensa extends Reward {}

// --- HOOKS PARA COMERCIANTES ---
export const useMinhasRecompensas = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-recompensas', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Reward[];
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
        .select('*, creator_info(full_name, user_type)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Reward[];
    },
  });
};

export const useCreateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaRecompensa: Omit<Reward, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('rewards').insert(novaRecompensa).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', data.comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa criada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useCreateReward = useCreateRecompensa;

export const useUpdateRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Reward> }) => {
      const { data: result, error } = await supabase.from('rewards').update(data).eq('id', id).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', data.comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa atualizada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateReward = useUpdateRecompensa;

export const useDeleteRecompensa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comercio_id }: { id: string, comercio_id?: string }) => {
      const { error } = await supabase.from('rewards').delete().eq('id', id);
      if (error) throw error;
      return { comercio_id };
    },
    onSuccess: ({ comercio_id }) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-recompensas', comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa excluída com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteReward = useDeleteRecompensa;