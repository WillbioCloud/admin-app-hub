import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Comercio } from './useComercios';

export interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  phone?: string;
  operating_hours?: string;
  loteamento_id: string;
  x_coord?: number;
  y_coord?: number;
}

export interface ComercioWithLocation {
  id: string;
  nome: string;
  categoria: string | null;
  descricao: string | null;
  logo_url: string | null;
  capa_url: string | null;
  galeria_urls: string[] | null;
  whatsapp: string | null;
  instagram: string | null;
  servicos: string[] | null;
  layout_template: string | null;
  primary_color: string | null;
  horario_func: any;
  ativo: boolean | null;
  status?: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  loteamento_id?: string | null;
}

// Hook para buscar pontos de interesse
export const usePointsOfInterest = () => {
  return useQuery({
    queryKey: ['points-of-interest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar pontos de interesse:', error);
        throw error;
      }
      
      return data as PointOfInterest[];
    },
  });
};

// Hook para buscar comércios com localização
export const useComerciasWithLocation = () => {
  return useQuery({
    queryKey: ['comercios-location'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar comércios:', error);
        throw error;
      }
      
      return data;
    },
  });
};

// Hook para atualizar localização do comércio
export const useUpdateComercioLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      latitude, 
      longitude, 
      image_url 
    }: { 
      id: string; 
      latitude: number; 
      longitude: number; 
      image_url?: string;
    }) => {
      const updateData: any = { latitude, longitude };
      if (image_url !== undefined) {
        updateData.image_url = image_url;
      }

      const { data, error } = await supabase
        .from('comercios')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro ao atualizar localização do comércio:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios-location'] });
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      toast.success('Localização atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar localização:', error);
      toast.error('Erro ao atualizar localização');
    },
  });
};

// Hook para atualizar ponto de interesse
export const useUpdatePointOfInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      image_url 
    }: { 
      id: string; 
      image_url: string;
    }) => {
      const { data, error } = await supabase
        .from('points_of_interest')
        .update({ image_url })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro ao atualizar ponto de interesse:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points-of-interest'] });
      toast.success('Ponto de interesse atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar ponto de interesse:', error);
      toast.error('Erro ao atualizar ponto de interesse');
    },
  });
};

// Hook para atualizar imagem do comércio
export const useUpdateComercioImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      image_url 
    }: { 
      id: string; 
      image_url: string;
    }) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ image_url })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Erro ao atualizar imagem do comércio:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios-location'] });
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      toast.success('Imagem do comércio atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar imagem do comércio:', error);
      toast.error('Erro ao atualizar imagem do comércio');
    },
  });
};