
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  status: string | null;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  creator_info?: {
    full_name: string;
    user_type: string;
  } | null;
}

export const useGamifications = () => {
  return useQuery({
    queryKey: ['gamifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gamifications:', error);
        throw error;
      }
      
      return data as Gamification[];
    },
  });
};

export const useCreateGamification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Gamification, 'id' | 'created_at' | 'created_by' | 'approved_by' | 'approved_at'>) => {
      const { data: result, error } = await supabase
        .from('missions')
        .insert([{
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating gamification:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating gamification:', error);
      toast.error('Erro ao criar gamificação');
    },
  });
};

export const useUpdateGamification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Gamification> }) => {
      const { data: result, error } = await supabase
        .from('missions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating gamification:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating gamification:', error);
      toast.error('Erro ao atualizar gamificação');
    },
  });
};

export const useDeleteGamification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting gamification:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting gamification:', error);
      toast.error('Erro ao excluir gamificação');
    },
  });
};

export const useApproveGamification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase
        .from('missions')
        .update({
          status: 'approved',
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error approving gamification:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação aprovada com sucesso!');
    },
    onError: (error) => {
      console.error('Error approving gamification:', error);
      toast.error('Erro ao aprovar gamificação');
    },
  });
};

export const useRejectGamification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase
        .from('missions')
        .update({
          status: 'rejected',
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting gamification:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamifications'] });
      toast.success('Gamificação rejeitada');
    },
    onError: (error) => {
      console.error('Error rejecting gamification:', error);
      toast.error('Erro ao rejeitar gamificação');
    },
  });
};
