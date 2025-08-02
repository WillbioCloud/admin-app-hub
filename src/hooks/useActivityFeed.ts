import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  type: 'user_registration' | 'merchant_approval' | 'reward_created' | 'mission_created' | 'notification_sent';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

export function useActivityFeed() {
  return useQuery({
    queryKey: ['activity-feed'],
    queryFn: async (): Promise<ActivityItem[]> => {
      const activities: ActivityItem[] = [];

      // Buscar registros de usuários recentes
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            id: `user-${user.id}`,
            type: 'user_registration',
            title: 'Novo usuário registrado',
            description: 'Um novo usuário se cadastrou na plataforma',
            timestamp: user.created_at,
            icon: 'UserPlus',
            color: 'blue'
          });
        });
      }

      // Buscar aprovações de comércios recentes
      const { data: recentMerchants } = await supabase
        .from('comercios')
        .select('id, nome, created_at, status')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentMerchants) {
        recentMerchants.forEach(merchant => {
          activities.push({
            id: `merchant-${merchant.id}`,
            type: 'merchant_approval',
            title: `Comércio "${merchant.nome}" aprovado`,
            description: 'Novo parceiro adicionado à plataforma',
            timestamp: merchant.created_at,
            icon: 'Store',
            color: 'green'
          });
        });
      }

      // Buscar recompensas criadas recentemente
      const { data: recentRewards } = await supabase
        .from('rewards')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentRewards) {
        recentRewards.forEach(reward => {
          activities.push({
            id: `reward-${reward.id}`,
            type: 'reward_created',
            title: `Recompensa "${reward.title}" criada`,
            description: 'Nova recompensa disponível para usuários',
            timestamp: reward.created_at,
            icon: 'Gift',
            color: 'purple'
          });
        });
      }

      // Buscar missões criadas recentemente
      const { data: recentMissions } = await supabase
        .from('missions')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentMissions) {
        recentMissions.forEach(mission => {
          activities.push({
            id: `mission-${mission.id}`,
            type: 'mission_created',
            title: `Missão "${mission.title}" criada`,
            description: 'Nova gamificação disponível',
            timestamp: mission.created_at,
            icon: 'Target',
            color: 'orange'
          });
        });
      }

      // Buscar notificações enviadas recentemente
      const { data: recentNotifications } = await supabase
        .from('notifications')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentNotifications) {
        recentNotifications.forEach(notification => {
          activities.push({
            id: `notification-${notification.id}`,
            type: 'notification_sent',
            title: `Notificação "${notification.title}" enviada`,
            description: 'Nova comunicação para usuários',
            timestamp: notification.created_at,
            icon: 'Bell',
            color: 'teal'
          });
        });
      }

      // Ordenar por timestamp (mais recente primeiro)
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50); // Limitar a 50 atividades mais recentes
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 10000, // Considerar dados obsoletos após 10 segundos
  });
}