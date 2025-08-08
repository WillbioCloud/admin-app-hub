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

export const useMinhasGamificacoes = (comercioId: string | undefined) => {
  return useQuery({
    queryKey: ['minhas-gamificacoes', comercioId],
    queryFn: async () => {
      if (!comercioId) return [];
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('created_by', comercioId)
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
    mutationFn: async (novaGamificacao: any) => {
      const { data, error } = await supabase.from('missions').insert(novaGamificacao).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
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
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase.from('missions').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
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
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('missions').delete().eq('id', id);
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação (Missão) excluída com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteGamification = useDeleteGamificacao;

export const useApproveGamification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from('missions')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Missão aprovada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useRejectGamification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data, error } = await supabase
        .from('missions')
        .update({ 
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas-gamificacoes'] });
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Missão rejeitada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};