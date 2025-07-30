
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  user_type?: 'admin' | 'comerciante';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, userData: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          app_context: 'admin_web'
        }
      }
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getUserRole = async (): Promise<'admin' | 'comerciante' | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase.rpc('get_admin_user_role');
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      return data as 'admin' | 'comerciante';
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getUserRole,
  };
};
