// src/hooks/useGamificacao.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface atualizada para coincidir com a estrutura da tabela missions
export interface Gamification {
  id: string;
  title: string;
  description: string | null;
  type: string;
  completion_data: string;
  xp_reward: number;
  coin_reward: number;
  is_active: boolean;
  is_unique: boolean;
  loteamento_id: string | null;
  location_type: string | null;
  created_at: string;
  created_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
  status: string;
  comercio_id?: string;
}

// Alias para manter compatibilidade
export type Gamificacao = Gamification;

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
      return data || [];
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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (novaGamificacao: Omit<Gamification, 'id' | 'created_at' | 'approved_at' | 'approved_by'>) => {
      const { data, error } = await supabase.from('missions').insert(novaGamificacao).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) criada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) atualizada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
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
    onSuccess: ({ comercio_id }: any) => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) excluída com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteGamification = useDeleteGamificacao;