
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReports = () => {
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
        total: Number(total),
        novos: Math.floor(Number(total) * 0.2) // Simular novos como 20% do total
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

  // Buscar total de tickets de suporte
  const { data: totalTickets = 0 } = useQuery({
    queryKey: ['reports', 'total-tickets'],
    queryFn: async () => {
      const { count } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Buscar crescimento mensal (simulado baseado nos dados atuais)
  const { data: crescimentoMensal = [] } = useQuery({
    queryKey: ['reports', 'crescimento-mensal'],
    queryFn: async () => {
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const totalUsersNum = Number(totalUsers) || 0;
      const totalComerciosNum = Number(totalComercios) || 0;
      
      return meses.map((mes, index) => ({
        mes,
        usuarios: Math.floor(totalUsersNum * (index + 1) / 6),
        comercios: Math.floor(totalComerciosNum * (index + 1) / 6)
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

      const totalLayouts = data.length;
      
      return Object.entries(layouts).map(([layout, count]) => ({
        layout: layout.charAt(0).toUpperCase() + layout.slice(1),
        valor: totalLayouts > 0 ? Math.round((Number(count) / totalLayouts) * 100) : 0,
        cor: layout === 'moderno' ? '#3B82F6' : '#10B981'
      }));
    }
  });

  // Buscar estatísticas de usuários por tipo
  const { data: usuariosPorTipo = [] } = useQuery({
    queryKey: ['reports', 'usuarios-por-tipo'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_type');
      
      if (!data) return [];
      
      const tipos = data.reduce((acc: any, usuario) => {
        const tipo = usuario.user_type || 'cliente';
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(tipos).map(([tipo, total]) => ({
        tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        total: Number(total)
      }));
    }
  });

  // Buscar missões por status
  const { data: missoesPorStatus = [] } = useQuery({
    queryKey: ['reports', 'missoes-por-status'],
    queryFn: async () => {
      const { data } = await supabase
        .from('missions')
        .select('status');
      
      if (!data) return [];
      
      const status = data.reduce((acc: any, missao) => {
        const statusMissao = missao.status || 'pending';
        acc[statusMissao] = (acc[statusMissao] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(status).map(([status, total]) => ({
        status: status === 'pending' ? 'Pendente' : 
               status === 'approved' ? 'Aprovada' : 
               status === 'rejected' ? 'Rejeitada' : status,
        total: Number(total),
        cor: status === 'approved' ? '#10B981' : 
             status === 'pending' ? '#F59E0B' : '#EF4444'
      }));
    }
  });

  return {
    totalUsers,
    totalComercios,
    comerciosAtivos,
    comerciosPorCategoria,
    totalMissoes,
    totalTickets,
    crescimentoMensal,
    layoutsPopulares,
    usuariosPorTipo,
    missoesPorStatus,
    isLoading: false
  };
};
