
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeReports = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Configurar subscriptions para atualizações em tempo real
    const setupRealtimeSubscriptions = () => {
      console.log('Setting up realtime subscriptions...');
      
      // Channel para usuários admin
      const adminChannel = supabase
        .channel('admin_profiles_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'admin_profiles'
          },
          (payload) => {
            console.log('Admin profiles change:', payload);
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        );

      // Channel para usuários mobile
      const profilesChannel = supabase
        .channel('profiles_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles'
          },
          (payload) => {
            console.log('Profiles change:', payload);
            queryClient.invalidateQueries({ queryKey: ['mobile-users'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        );

      // Channel para comércios
      const comerciosChannel = supabase
        .channel('comercios_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'comercios'
          },
          (payload) => {
            console.log('Comercios change:', payload);
            queryClient.invalidateQueries({ queryKey: ['comercios'] });
            queryClient.invalidateQueries({ queryKey: ['comercios-usuarios'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        );

      // Channel para missões
      const missionsChannel = supabase
        .channel('missions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'missions'
          },
          (payload) => {
            console.log('Missions change:', payload);
            queryClient.invalidateQueries({ queryKey: ['gamifications'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        );

      // Channel para tickets de suporte
      const supportChannel = supabase
        .channel('support_tickets_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_tickets'
          },
          (payload) => {
            console.log('Support tickets change:', payload);
            queryClient.invalidateQueries({ queryKey: ['reports'] });
          }
        );

      // Subscrever todos os channels
      Promise.all([
        adminChannel.subscribe(),
        profilesChannel.subscribe(),
        comerciosChannel.subscribe(),
        missionsChannel.subscribe(),
        supportChannel.subscribe()
      ]).then((results) => {
        const allConnected = results.every(result => result === 'SUBSCRIBED');
        setIsConnected(allConnected);
        console.log('Realtime subscriptions status:', allConnected ? 'Connected' : 'Failed');
      });

      return () => {
        console.log('Cleaning up realtime subscriptions...');
        supabase.removeChannel(adminChannel);
        supabase.removeChannel(profilesChannel);
        supabase.removeChannel(comerciosChannel);
        supabase.removeChannel(missionsChannel);
        supabase.removeChannel(supportChannel);
      };
    };

    const cleanup = setupRealtimeSubscriptions();

    return cleanup;
  }, [queryClient]);

  return { isConnected };
};
