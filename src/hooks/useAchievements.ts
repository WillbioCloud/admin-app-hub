import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  rarity: string | null;
  created_at: string;
}

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (achievementData: Omit<Achievement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('achievements')
        .insert(achievementData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Conquista criada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Achievement> & { id: string }) => {
      const { data, error } = await supabase
        .from('achievements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Conquista atualizada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success('Conquista excluída com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro: ${err.message}`)
  });
};