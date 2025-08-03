// src/hooks/useGamificacao.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Updated interface to match missions table structure
export interface Gamification {
  id: string;
  title: string;
  description: string | null;
  type: 'qr_code' | 'code';
  completion_data: string;
  xp_reward: number;
  coin_reward: number;
  is_active: boolean;
  is_unique: boolean;
  created_at: string;
  updated_at: string;
  comercio_id?: string | null;
  created_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  loteamento_id?: string | null;
  location_type?: string | null;
  status?: string;
}

// Legacy interface name for backwards compatibility
export interface Gamificacao extends Gamification {}

// --- HOOKS PARA COMERCIANTES ---
export const useMinhasGamificacoes = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-gamificacoes', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('comercio_id', comercioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gamification[];
    },
    enabled: !!comercioId,
  });
};

export const useGamifications = () => {
  return useQuery({
    queryKey: ['gamifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*, creator_info(full_name, user_type)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Gamification[];
    },
  });
};

export const useCreateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaGamificacao: Omit<Gamification, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('missions').insert(novaGamificacao).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', data.comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) criada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useCreateGamification = useCreateGamificacao;

export const useUpdateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Gamification> & { id: string }) => {
      const { data, error } = await supabase.from('missions').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', data.comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) atualizada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateGamification = useUpdateGamificacao;

export const useDeleteGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, comercio_id }: { id: string, comercio_id?: string }) => {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (error) throw error;
      return { comercio_id };
    },
    onSuccess: ({ comercio_id }) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes', comercio_id] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) excluída com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteGamification = useDeleteGamificacao;

// Additional hooks for admin functions
export const useApproveGamification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('missions')
        .update({ status: 'approved', is_active: true })
        .eq('id', id)
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação aprovada com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};

export const useRejectGamification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('missions')
        .update({ status: 'rejected', is_active: false })
        .eq('id', id)
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação rejeitada');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`)
  });
};