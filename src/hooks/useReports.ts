
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReportsData = () => {
  // Buscar total de usuários
  const { data: totalUsers = 0 } = useQuery({
    queryKey: ['reports', 'total-users'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Buscar total de comércios
  const { data: totalComercios = 0 } = useQuery({
    queryKey: ['reports', 'total-comercios'],
    queryFn: async () => {
      const { count } = await supabase
        .from('comercios')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Buscar comércios ativos
  const { data: comerciosAtivos = 0 } = useQuery({
    queryKey: ['reports', 'comercios-ativos'],
    queryFn: async () => {
      const { count } = await supabase
        .from('comercios')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);
      return count || 0;
    }
  });

  // Buscar comércios por categoria
  const { data: comerciosPorCategoria = [] } = useQuery({
    queryKey: ['reports', 'comercios-por-categoria'],
    queryFn: async () => {
      const { data } = await supabase
        .from('comercios')
        .select('categoria');
      
      if (!data) return [];
      
      const categorias = data.reduce((acc: any, comercio) => {
        const categoria = comercio.categoria || 'Outros';
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categorias).map(([categoria, total]) => ({
        categoria,
        total: total as number,
        novos: Math.floor((total as number) * 0.2) // Simular novos como 20% do total
      }));
    }
  });

  // Buscar missões ativas
  const { data: totalMissoes = 0 } = useQuery({
    queryKey: ['reports', 'total-missoes'],
    queryFn: async () => {
      const { count } = await supabase
        .from('missions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      return count || 0;
    }
  });

  // Buscar crescimento mensal (simulado baseado nos dados atuais)
  const { data: crescimentoMensal = [] } = useQuery({
    queryKey: ['reports', 'crescimento-mensal'],
    queryFn: async () => {
      // Como não temos dados históricos, vamos simular baseado nos totais atuais
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      return meses.map((mes, index) => ({
        mes,
        usuarios: Math.floor(totalUsers * (index + 1) / 6),
        comercios: Math.floor(totalComercios * (index + 1) / 6)
      }));
    },
    enabled: totalUsers > 0 && totalComercios > 0
  });

  // Buscar dados de layouts mais usados
  const { data: layoutsPopulares = [] } = useQuery({
    queryKey: ['reports', 'layouts-populares'],
    queryFn: async () => {
      const { data } = await supabase
        .from('comercios')
        .select('layout_template');
      
      if (!data) return [];
      
      const layouts = data.reduce((acc: any, comercio) => {
        const layout = comercio.layout_template || 'moderno';
        acc[layout] = (acc[layout] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(layouts).reduce((sum: number, count: any) => sum + count, 0);
      
      return Object.entries(layouts).map(([layout, count]) => ({
        layout: layout.charAt(0).toUpperCase() + layout.slice(1),
        valor: Math.round(((count as number) / total) * 100),
        cor: layout === 'moderno' ? '#3B82F6' : '#10B981'
      }));
    }
  });

  return {
    totalUsers,
    totalComercios,
    comerciosAtivos,
    comerciosPorCategoria,
    totalMissoes,
    crescimentoMensal,
    layoutsPopulares,
    isLoading: false // Simplificado para este exemplo
  };
};
