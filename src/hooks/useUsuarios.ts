
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UsuarioSupabase {
  id: string;
  full_name: string;
  user_type: 'admin' | 'comerciante' | 'cliente';
  created_at: string;
  phone?: string;
  avatar_url?: string;
  is_approved: boolean;
  email?: string; // Email real do usuário
}

export const useUsuarios = () => {
  // Buscar usuários do admin_profiles (web app) com emails reais
  const { data: adminUsers = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Buscando usuários admin...');
      
      // Primeiro busca os perfis admin
      const { data: profiles, error: profileError } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profileError) {
        console.error('Erro ao buscar perfis admin:', profileError);
        throw profileError;
      }

      // Buscar emails reais através de edge function
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails', {
          body: { userIds: profiles?.map(p => p.id) || [] }
        });

        if (emailError) {
          console.warn('Erro ao buscar emails reais, usando dados sem email:', emailError);
          return profiles?.map(user => ({
            ...user,
            email: 'Email não disponível'
          })) || [];
        }

        // Juntar dados dos perfis com emails reais
        const usersWithEmails = profiles?.map(user => ({
          ...user,
          email: emailData?.find((e: any) => e.id === user.id)?.email || 'Email não disponível'
        })) || [];

        return usersWithEmails;
      } catch (error) {
        console.warn('Edge function não disponível, retornando dados sem email:', error);
        return profiles?.map(user => ({
          ...user,
          email: 'Email não disponível'
        })) || [];
      }
    }
  });

  // Buscar usuários do profiles (mobile app) com emails reais
  const { data: mobileUsers = [] } = useQuery({
    queryKey: ['mobile-users'],
    queryFn: async () => {
      console.log('Buscando usuários mobile...');
      
      // Primeiro busca os perfis mobile
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profileError) {
        console.error('Erro ao buscar perfis mobile:', profileError);
        throw profileError;
      }

      // Usar edge function para buscar emails reais para usuários mobile também
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails', {
          body: { userIds: profiles?.map(p => p.id) || [] }
        });

        if (emailError) {
          console.warn('Erro ao buscar emails reais para mobile, usando dados sem email:', emailError);
          return profiles?.map(user => ({
            ...user,
            email: 'Email não disponível'
          })) || [];
        }

        // Juntar dados dos perfis mobile com emails reais
        const usersWithEmails = profiles?.map(user => ({
          ...user,
          email: emailData?.find((e: any) => e.id === user.id)?.email || 'Email não disponível'
        })) || [];

        return usersWithEmails;
      } catch (error) {
        console.warn('Edge function não disponível para mobile, retornando dados sem email:', error);
        return profiles?.map(user => ({
          ...user,
          email: 'Email não disponível'
        })) || [];
      }
    }
  });

  // Buscar comércios para relacionar com usuários
  const { data: comercios = [] } = useQuery({
    queryKey: ['comercios-usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('id, nome, user_id, ativo');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Combinar dados e formatar para a interface
  const usuarios = [
    ...adminUsers.map(user => ({
      id: user.id,
      nome: user.full_name || 'Nome não informado',
      email: user.email || 'Email não disponível',
      telefone: user.phone || 'Não informado',
      comercio: comercios.find(c => c.user_id === user.id)?.nome || 'Sem comércio',
      status: 'ativo' as const,
      dataCadastro: user.created_at,
      categoria: user.user_type === 'admin' ? 'Admin' : 'Comerciante',
      tipo: 'web_app',
      userType: user.user_type
    })),
    ...mobileUsers.map(user => ({
      id: user.id,
      nome: user.full_name || 'Nome não informado',
      email: user.email || 'Email não disponível',
      telefone: user.phone || 'Não informado',
      comercio: comercios.find(c => c.user_id === user.id)?.nome || 'Sem comércio',
      status: user.is_approved ? 'ativo' as const : 'pendente' as const,
      dataCadastro: user.created_at,
      categoria: user.user_type === 'cliente' ? 'Cliente' : 'Comerciante',
      tipo: 'mobile_app',
      userType: user.user_type
    }))
  ];

  // Estatísticas
  const totalUsers = usuarios.length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;
  const usuariosPendentes = usuarios.filter(u => u.status === 'pendente').length;
  const usuariosWebApp = usuarios.filter(u => u.tipo === 'web_app').length;
  const usuariosMobileApp = usuarios.filter(u => u.tipo === 'mobile_app').length;

  return {
    usuarios,
    totalUsers,
    usuariosAtivos,
    usuariosPendentes,
    usuariosWebApp,
    usuariosMobileApp,
    isLoading: false
  };
};

// Hook para criar novo usuário
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      fullName: string;
      userType: 'admin' | 'comerciante' | 'cliente';
      appContext: 'admin_web' | 'mobile_app';
      phone?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            user_type: userData.userType,
            app_context: userData.appContext,
            phone: userData.phone
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['mobile-users'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });
};
