import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: 'nova_missao' | 'novo_comercio' | 'novidade_feed' | 'lote_disponivel' | 'workshop' | 'app_update' | 'novidade_comercio';
  metadata: any;
  is_read: boolean;
  created_at: string;
  user_id: string | null;
}

// Hook para buscar notificações
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notificações:', error);
        throw error;
      }
      
      return data as Notification[];
    },
  });
};

// Hook para criar notificação
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar notificação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificação criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar notificação:', error);
      toast.error('Erro ao criar notificação');
    },
  });
};

// Hook para marcar notificação como lida
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Erro ao marcar como lida:', error);
      toast.error('Erro ao marcar como lida');
    },
  });
};

// Hook para deletar notificação
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificação excluída!');
    },
    onError: (error) => {
      console.error('Erro ao excluir notificação:', error);
      toast.error('Erro ao excluir notificação');
    },
  });
};

// Hook para marcar todas como lidas
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Todas as notificações marcadas como lidas!');
    },
    onError: (error) => {
      console.error('Erro ao marcar todas como lidas:', error);
      toast.error('Erro ao marcar todas como lidas');
    },
  });
};