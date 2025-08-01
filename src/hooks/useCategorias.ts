import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategoriaComComercio {
  categoria: string;
  total: number;
}

// Hook para buscar categorias dos comércios
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }

      // Contar comércios por categoria
      const categoriasCount = data.reduce((acc: Record<string, number>, comercio) => {
        const categoria = comercio.categoria || 'Sem categoria';
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {});

      // Converter para array de objetos
      const categorias = Object.entries(categoriasCount).map(([categoria, total]) => ({
        categoria,
        total
      }));

      return categorias as CategoriaComComercio[];
    },
  });
};

// Hook para buscar estatísticas das categorias
export const useCategoriaStats = () => {
  return useQuery({
    queryKey: ['categoria-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('categoria, ativo');

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }

      const totalComercios = data.length;
      const categorias = new Set(data.map(c => c.categoria).filter(Boolean));
      const comerciosAtivos = data.filter(c => c.ativo).length;

      return {
        totalCategorias: categorias.size,
        totalComercios,
        comerciosAtivos
      };
    },
  });
};