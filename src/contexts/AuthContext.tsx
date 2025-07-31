
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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
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
          role: 'admin',
          name: adminProfile.full_name || supabaseUser.email || 'Usuário',
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
        });
      } else {
        console.warn('Nenhum perfil encontrado para o usuário. Pode ser um novo usuário.');
        // Criar usuário básico sem deslogar
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: 'comerciante',
          name: supabaseUser.email || 'Usuário',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      // Em caso de erro, criar usuário básico
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: 'comerciante',
        name: supabaseUser.email || 'Usuário',
      });
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Verificar sessão inicial
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        console.log('Initial session check:', session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          await loadUserProfile(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão inicial:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

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
      isLoading,
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
