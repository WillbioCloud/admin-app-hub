import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAvailableMissions = () => {
  return useQuery({
    queryKey: ['available-missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('id, title, description')
        .eq('is_active', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUnlinkedMissions = () => {
  return useQuery({
    queryKey: ['unlinked-missions'],
    queryFn: async () => {
      // Busca missões que não têm recompensas associadas
      const { data, error } = await supabase
        .from('missions')
        .select(`
          id, 
          title, 
          description,
          rewards!inner(id)
        `)
        .eq('is_active', true)
        .eq('status', 'approved');

      if (error) throw error;
      
      // Filtra missões que não têm recompensas
      const unlinkedMissions = data?.filter(mission => !mission.rewards) || [];
      
      return unlinkedMissions.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description
      }));
    },
  });
};