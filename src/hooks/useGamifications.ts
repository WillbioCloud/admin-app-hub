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
  achievement_id?: string;
  reward_id?: string;
  // Dados aninhados para exibição
  achievement?: {
    id: string;
    name: string;
    icon_url: string | null;
  } | null;
  reward?: {
    id: string;
    title: string;
    coin_cost: number;
  } | null;
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
      // Buscar missões primeiro
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (missionsError) throw missionsError;

      // Para cada missão, buscar achievement e reward se existirem
      const gamificationsWithRelations = await Promise.all(
        (missions || []).map(async (mission) => {
          let achievement = null;
          let reward = null;

          // Buscar achievement se existe
          if (mission.achievement_id) {
            const { data: achievementData } = await supabase
              .from('achievements')
              .select('id, name, icon_url')
              .eq('id', mission.achievement_id)
              .single();
            achievement = achievementData;
          }

          // Buscar reward se existe
          if (mission.reward_id) {
            const { data: rewardData } = await supabase
              .from('rewards')
              .select('id, title, coin_cost')
              .eq('id', mission.reward_id)
              .single();
            reward = rewardData;
          }

          return {
            ...mission,
            achievement,
            reward
          };
        })
      );

      return gamificationsWithRelations;
    },
  });
};

export const useCreateGamificacao = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gamificationData, rewardId, achievementId }: { 
      gamificationData: any, 
      rewardId?: string,
      achievementId?: string 
    }) => {
      // Preparar dados da missão com achievement_id e reward_id
      const missionData = {
        ...gamificationData,
        achievement_id: achievementId || null,
        reward_id: rewardId || null
      };

      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .insert(missionData)
        .select()
        .single();
      
      if (missionError) throw missionError;

      // Se uma recompensa foi criada junto, associa ela à missão
      if (rewardId && mission) {
        const { error: updateError } = await supabase
          .from('rewards')
          .update({ mission_unlock_id: mission.id })
          .eq('id', rewardId);
        
        if (updateError) {
          console.error('Erro ao associar recompensa à missão:', updateError);
          // Não falha completamente, apenas registra o erro
        }
      }

      return mission;
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
      console.log('Updating mission with data:', updateData, 'achievement_id:', updateData.achievement_id);
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

export const useMissionReward = (missionId: string | undefined) => {
  return useQuery({
    queryKey: ['mission-reward', missionId],
    queryFn: async () => {
      if (!missionId) return null;
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('mission_unlock_id', missionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data || null;
    },
    enabled: !!missionId,
  });
};