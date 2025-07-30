
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CreateAdminData {
  email: string;
  password: string;
  full_name: string;
  user_type?: 'admin' | 'comerciante';
}

export function useCreateAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdmin = async (adminData: CreateAdminData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-admin', {
        body: {
          email: adminData.email,
          password: adminData.password,
          full_name: adminData.full_name,
          user_type: adminData.user_type || 'comerciante'
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar administrador';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { createAdmin, isLoading, error };
}
