
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

      // Subscrever todos os channels e verificar status
      const channels = [adminChannel, profilesChannel, comerciosChannel, missionsChannel, supportChannel];
      
      Promise.all(channels.map(channel => channel.subscribe())).then((results) => {
        // Verificar se todos os channels estão conectados através do status
        let connectedCount = 0;
        
        channels.forEach((channel, index) => {
          if (channel.state === 'joined') {
            connectedCount++;
          }
        });
        
        const allConnected = connectedCount === channels.length;
        setIsConnected(allConnected);
        console.log('Realtime subscriptions status:', allConnected ? 'Connected' : `${connectedCount}/${channels.length} connected`);
      });

      return () => {
        console.log('Cleaning up realtime subscriptions...');
        channels.forEach(channel => {
          supabase.removeChannel(channel);
        });
      };
    };

    const cleanup = setupRealtimeSubscriptions();

    return cleanup;
  }, [queryClient]);

  return { isConnected };
};
