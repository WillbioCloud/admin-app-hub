
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

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

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  useEffect(() => {
    console.log('AuthProvider: Iniciando setup de autenticação...');
    
    // Configurar listener de mudanças de auth PRIMEIRO (evita deadlock)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state change:', event, session?.user?.email || 'No user');
        
        // Atualização síncrona do estado
        if (session?.user) {
          // Defer a chamada async para evitar deadlock
          setTimeout(() => {
            loadUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Verificar sessão atual DEPOIS do listener
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Sessão inicial:', session?.user?.email || 'Nenhuma sessão');
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Erro ao obter sessão:', error);
        setIsLoading(false);
      }
    };

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
        console.log('AuthProvider: Carregando perfil para:', supabaseUser.email);

        const [profileResult, adminResult] = await Promise.allSettled([
            supabase.from('profiles').select('*').eq('id', supabaseUser.id).single(),
            supabase.from('admin_profiles').select('*').eq('id', supabaseUser.id).single()
        ]);

        // Prioridade 1: Verificar se é um administrador.
        if (adminResult.status === 'fulfilled' && adminResult.value.data) {
            console.log('AuthProvider: Perfil de administrador encontrado.');
            const adminProfile = adminResult.value.data;
            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                role: 'admin', // Definido diretamente como 'admin'
                name: adminProfile.full_name || supabaseUser.email || 'Admin',
            });
            return; // Encerra a função aqui, pois a role de admin foi confirmada.
        }

        // Prioridade 2: Verificar se é um comerciante.
        if (profileResult.status === 'fulfilled' && profileResult.value.data) {
            console.log('AuthProvider: Perfil de comerciante encontrado.');
            const profile = profileResult.value.data;
            setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                role: 'comerciante', // Definido diretamente como 'comerciante'
                name: profile.full_name || supabaseUser.email || 'Usuário',
                // comercioId: profile.comercio_id, // Exemplo se você precisar do ID do comércio
            });
            return;
        }

        // Fallback: Se não encontrar perfil em nenhuma das tabelas.
        console.warn('AuthProvider: Nenhum perfil encontrado para o usuário, usando fallback.');
        setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            role: 'comerciante', // Ou outra role padrão que faça sentido
            name: supabaseUser.email || 'Usuário',
        });

    } catch (error) {
        console.error('AuthProvider: Erro ao carregar perfil:', error);
        setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            role: 'comerciante', // Fallback em caso de erro
            name: supabaseUser.email || 'Usuário',
        });
    }
};

  const authFunction = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthProvider: Tentando login para:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Erro de login:', error.message);
        return false;
      }

      console.log('AuthProvider: Login realizado com sucesso');
      return true;
    } catch (error) {
      console.error('AuthProvider: Exceção durante login:', error);
      return false;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Fazendo logout...');
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('AuthProvider: Erro no logout:', error);
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
