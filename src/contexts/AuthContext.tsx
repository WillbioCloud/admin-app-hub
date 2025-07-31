
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'comerciante';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  comercioId?: string;
  isAdmin?: boolean; // Flag adicional para facilitar verificações
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean; // Helper function centralizada
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    if (profileLoading) return;
    
    setProfileLoading(true);
    try {
      console.log('Loading profile for user:', supabaseUser.email);
      
      // Primeiro tenta buscar perfil admin
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (adminProfile) {
        console.log('Admin profile found:', adminProfile.user_type);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: adminProfile.user_type as UserRole,
          name: adminProfile.full_name || supabaseUser.email || 'Usuário',
          isAdmin: adminProfile.user_type === 'admin'
        });
        return;
      }

      // Se não encontrou perfil admin, verifica usuário mobile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profile) {
        console.log('Mobile profile found:', profile.user_type);
        const role = profile.user_type === 'admin' ? 'admin' : 'comerciante';
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: role,
          name: profile.full_name || supabaseUser.email || 'Usuário',
          isAdmin: profile.user_type === 'admin'
        });
      } else {
        console.warn('Nenhum perfil encontrado para o usuário. Pode ser um novo usuário ou o trigger do DB falhou.');
        // Não deslogar automaticamente - pode ser um usuário recém criado
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.isAdmin === true || user?.role === 'admin';
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const authFunction = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      console.log('Login successful for:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: authFunction, 
      signIn: authFunction,
      logout, 
      isLoading: isLoading || profileLoading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
