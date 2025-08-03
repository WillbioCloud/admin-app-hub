import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Reward {
  id: string;
  title: string;
  description: string | null;
  coin_cost: number;
  image_url: string | null;
  is_active: boolean;
  stock: number | null;
  mission_id_unlock: string | null;
  mission_unlock_id: string | null;
  created_at: string;
  created_by?: string | null;
  creator_info?: {
    full_name: string;
    user_type: string;
  } | null;
}

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rewards:', error);
        throw error;
      }
      
      return data as Reward[];
    },
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Reward, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: result, error } = await supabase
        .from('rewards')
        .insert([{
          ...data,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating reward:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating reward:', error);
      toast.error('Erro ao criar recompensa');
    },
  });
};

export const useUpdateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Reward> }) => {
      const { data: result, error } = await supabase
        .from('rewards')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating reward:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating reward:', error);
      toast.error('Erro ao atualizar recompensa');
    },
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting reward:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      toast.success('Recompensa excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting reward:', error);
      toast.error('Erro ao excluir recompensa');
    },
  });
};