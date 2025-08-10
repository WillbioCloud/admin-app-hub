import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MissionStep {
  id: string;
  mission_id: string;
  step_number: number;
  title: string;
  description?: string;
  completion_type: string;
  completion_data: string;
  step_xp_reward: number;
}

export const useMissionSteps = (missionId: string | undefined) => {
  return useQuery({
    queryKey: ['mission-steps', missionId],
    queryFn: async () => {
      if (!missionId) return [];
      
      const { data, error } = await supabase
        .from('mission_steps')
        .select('*')
        .eq('mission_id', missionId)
        .order('step_number', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!missionId,
  });
};

export const useCreateMissionStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stepData: Omit<MissionStep, 'id'>) => {
      const { data, error } = await supabase
        .from('mission_steps')
        .insert(stepData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mission-steps', data.mission_id] });
      toast.success('Passo da missão criado com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateMissionStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<MissionStep> & { id: string }) => {
      const { data, error } = await supabase
        .from('mission_steps')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mission-steps', data.mission_id] });
      toast.success('Passo da missão atualizado com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteMissionStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, missionId }: { id: string; missionId: string }) => {
      const { error } = await supabase
        .from('mission_steps')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, missionId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mission-steps', data.missionId] });
      toast.success('Passo da missão excluído com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};