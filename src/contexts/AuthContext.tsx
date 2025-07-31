
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'comerciante';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  comercioId?: string; // Para comerciantes
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>; // Adicionar alias
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading profile for user:', supabaseUser.email);
      
      // Tentar buscar perfil admin primeiro
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
        });
        return;
      }

      // Se não encontrou perfil admin, verificar se é um usuário mobile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profile) {
        console.log('Mobile profile found:', profile.user_type);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: profile.user_type === 'admin' ? 'admin' : 'comerciante',
          name: profile.full_name || supabaseUser.email || 'Usuário',
        });
      } else {
        console.log('No profile found for user');
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      setUser(null);
    }
  };

  const authFunction = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      console.log('Login successful for:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logging out user');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: authFunction, 
      signIn: authFunction, // Alias para compatibilidade
      logout, 
      isLoading 
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
