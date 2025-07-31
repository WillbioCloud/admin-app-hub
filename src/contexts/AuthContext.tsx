
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
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading profile for user:', supabaseUser.email);
      
      // Primeiro tenta buscar perfil admin
      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (adminProfile && !adminError) {
        console.log('Admin profile found');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: 'admin',
          name: adminProfile.full_name || supabaseUser.email || 'Admin',
        });
        return;
      }

      // Se não encontrou perfil admin, verifica usuário mobile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profile && !profileError) {
        console.log('Mobile profile found');
        const role = profile.user_type === 'admin' ? 'admin' : 'comerciante';
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: role,
          name: profile.full_name || supabaseUser.email || 'Usuário',
        });
      } else {
        console.log('No profile found, creating basic user');
        // Criar usuário básico sem deslogar
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: 'comerciante',
          name: supabaseUser.email || 'Usuário',
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
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
    console.log('Setting up auth listener...');
    
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.email || 'No user');
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const authFunction = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      console.log('Login successful');
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
    } catch (error) {
      console.error('Logout error:', error);
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
