import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: 'nova_missao' | 'novo_comercio' | 'novidade_feed' | 'lote_disponivel' | 'workshop' | 'app_update' | 'novidade_comercio';
  metadata: any;
  is_read_by_user: boolean;
  read_at_by_user: string | null;
  created_at: string;
  user_id: string | null;
}

// Hook para buscar notificações com status de leitura por usuário
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_notifications_with_read_status');

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
    mutationFn: async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read_by_user' | 'read_at_by_user'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
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

// Hook para marcar notificação como lida para o usuário atual
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('mark_notification_as_read_for_user', {
        p_notification_id: id
      });

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

// Hook para marcar todas como lidas para o usuário atual
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Buscar todas as notificações não lidas para o usuário
      const { data: notifications } = await supabase.rpc('get_notifications_with_read_status');
      
      if (!notifications) return;
      
      const unreadNotifications = notifications.filter(n => !n.is_read_by_user);
      
      // Marcar cada uma como lida
      for (const notification of unreadNotifications) {
        await supabase.rpc('mark_notification_as_read_for_user', {
          p_notification_id: notification.id
        });
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