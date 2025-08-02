import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Comercio } from './useComercios';

// Tipos de dados
export interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  image_url?: string;
  phone?: string;
  operating_hours?: string;
  loteamento_id: string;
  x_coord?: number;
  y_coord?: number;
}

export interface ComercioWithLocation extends Comercio {
  latitude?: number | null;
  longitude?: number | null;
  image_url?: string;
}

// Hook para buscar Pontos de Interesse
export const usePointsOfInterest = () => {
  return useQuery({
    queryKey: ['points_of_interest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as PointOfInterest[];
    },
  });
};

// Hook para buscar Comércios
export const useComerciasWithLocation = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data as ComercioWithLocation[];
    },
  });
};

// Hook de mutação genérico para atualizar qualquer item
type ItemUpdatePayload = {
  id: string;
  updates: Partial<{ latitude: number; longitude: number; image_url: string }>;
};

type UseUpdateItemParams = {
  tableName: 'comercios' | 'points_of_interest';
};

export function useUpdateItem({ tableName }: UseUpdateItemParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: ItemUpdatePayload) => {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Falha ao atualizar ${tableName}: ${error.message}`);
      }
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [tableName] });
      const message = variables.updates.image_url 
        ? 'Imagem atualizada com sucesso!' 
        : 'Localização atualizada com sucesso!';
      toast.success(message);
    },
    onError: (error) => {
      toast.error(`Erro na atualização: ${error.message}`);
    },
  });
}
