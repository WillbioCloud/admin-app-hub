
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // Verifica se o ID do usuário existe na tabela 'admin_profiles'
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, user_type')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAdmin, isLoading, checkAdminStatus };
}
