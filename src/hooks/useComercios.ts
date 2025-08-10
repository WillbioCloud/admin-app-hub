import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface que representa a estrutura de um Comércio, baseada no seu projeto.
export interface Comercio {
  id: string;
  user_id: string;
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
  endereco: string | null;
  latitude: number | null;
  longitude: number | null;
}

// --- HOOKS PARA O PAINEL DO ADMIN ---

export const useComercios = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async (): Promise<Comercio[]> => {
      const { data, error } = await supabase.from('comercios').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const usePendingComercios = () => {
  return useQuery({
    queryKey: ['comercios-pending'],
    queryFn: async (): Promise<Comercio[]> => {
      const { data, error } = await supabase.from('comercios').select('*').eq('status', 'pending').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Hook para buscar comércios que aparecem no app (aprovados e ativos)
export const useComerciosAprovados = () => {
  return useQuery({
    queryKey: ['comercios-aprovados'],
    queryFn: async (): Promise<Comercio[]> => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('status', 'approved')
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

/**
 * Função auxiliar para verificar se é a primeira aprovação ou uma atualização.
 */
const checkIfFirstApproval = async (comercioId: string): Promise<boolean> => {
    try {
        // Verifica se já houve aprovação anterior consultando o histórico
        const { data: comercio } = await supabase
            .from('comercios')
            .select('created_at, updated_at')
            .eq('id', comercioId)
            .single();
            
        if (!comercio) return true;
        
        // Se created_at e updated_at são muito próximos (menos de 1 minuto de diferença),
        // provavelmente é a primeira aprovação
        const createdTime = new Date(comercio.created_at).getTime();
        const updatedTime = new Date(comercio.updated_at).getTime();
        const diffInMinutes = (updatedTime - createdTime) / (1000 * 60);
        
        return diffInMinutes < 1;
    } catch {
        return true; // Em caso de erro, assume primeira aprovação
    }
}

/**
 * Função auxiliar para criar notificação de novo comércio (primeira aprovação).
 */
const createNewCommerceNotification = async (userId: string, comercioNome: string) => {
    try {
        // Notificação específica para o comerciante
        const { error: userError } = await supabase.from('notifications').insert({
            user_id: userId,
            title: "Seu comércio foi aprovado!",
            message: `Parabéns! ${comercioNome} agora está ativo na plataforma.`,
            type: 'app_update'
        });
        
        // Notificação global para todos os usuários do app
        const { error: globalError } = await supabase.from('notifications').insert({
            user_id: null, // null = notificação global para todos
            title: "Novo comércio disponível!",
            message: `${comercioNome} foi adicionado à plataforma. Confira!`,
            type: 'novo_comercio'
        });
        
        if (userError || globalError) {
            console.error("Erro ao criar notificação de novo comércio:", userError?.message || globalError?.message);
            toast.warning("Ação realizada, mas falha ao enviar notificação.");
        }
    } catch (err: any) {
        console.error("Erro inesperado:", err.message);
    }
}

/**
 * Função auxiliar para criar notificação de atualização de comércio.
 */
const createUpdateCommerceNotification = async (userId: string, comercioNome: string) => {
    try {
        // Notificação apenas para o comerciante
        const { error: userError } = await supabase.from('notifications').insert({
            user_id: userId,
            title: "Alterações aprovadas!",
            message: `As alterações do ${comercioNome} foram aprovadas e já estão visíveis no aplicativo.`,
            type: 'app_update'
        });
        
        if (userError) {
            console.error("Erro ao criar notificação de atualização:", userError.message);
            toast.warning("Ação realizada, mas falha ao enviar notificação.");
        }
    } catch (err: any) {
        console.error("Erro inesperado:", err.message);
    }
}

export const useApproveComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { error } = await supabase.from('comercios').update({ ativo: true, status: 'approved' }).eq('id', comercio.id);
      if (error) throw new Error(`Falha ao aprovar: ${error.message}`);
      return comercio; 
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success("Comércio aprovado com sucesso!");
      
      // Verifica se é primeira aprovação ou atualização
      const isFirstApproval = await checkIfFirstApproval(data.id);
      
      if (isFirstApproval) {
        await createNewCommerceNotification(data.user_id, data.nome);
      } else {
        await createUpdateCommerceNotification(data.user_id, data.nome);
      }
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

export const useRejectComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { error } = await supabase.from('comercios').update({ ativo: false, status: 'rejected' }).eq('id', comercio.id);
      if (error) throw new Error(`Falha ao rejeitar: ${error.message}`);
      return comercio;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.info("Comércio rejeitado.");
      
      // Notifica o comerciante sobre a rejeição
      try {
        await supabase.from('notifications').insert({
          user_id: data.user_id,
          title: "Seu comércio precisa de ajustes",
          message: `O seu comércio ${data.nome} foi revisado e precisa de algumas correções. Verifique seu painel para mais detalhes.`,
          type: 'app_update'
        });
      } catch (error) {
        console.error('Erro ao enviar notificação de rejeição:', error);
      }
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

export const useUpdateComercioAtivoStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, newStatus }: { id: string, newStatus: boolean }) => {
            const { error } = await supabase.from('comercios').update({ ativo: newStatus }).eq('id', id);
            if (error) throw new Error(`Falha ao atualizar status: ${error.message}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comercios'] });
            toast.success("Visibilidade do comércio atualizada!");
        },
        onError: (error: Error) => toast.error(error.message)
    });
};

// --- HOOKS PARA O PAINEL DO COMERCIANTE (sem alterações) ---

export const useMeuComercio = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['meu-comercio', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from('comercios').select('*').eq('user_id', userId).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar meu comércio:', error);
        throw error;
      }
      return data as Comercio | null;
    },
    enabled: !!userId,
  });
};

export const useCreateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComercio: Partial<Comercio>) => {
      const comercioData = { ...newComercio, status: 'pending', ativo: false };
      const { data, error } = await supabase.from('comercios').insert(comercioData as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meu-comercio', data.user_id] });
      toast.success('Comércio enviado para aprovação!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar comércio: ${error.message}`);
    }
  });
};

export const useUpdateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Comercio> & { id: string }) => {
      const comercioData = { ...updateData, status: 'pending', ativo: false };
      const { data, error } = await supabase.from('comercios').update(comercioData as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meu-comercio', data.user_id] });
      toast.success('Alterações enviadas para aprovação!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    }
  });
};

// Hook específico para admin atualizar comércio (não muda status)
export const useAdminUpdateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Comercio> & { id: string }) => {
      const { data, error } = await supabase.from('comercios').update(updateData as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['meu-comercio', data.user_id] });
      toast.success('Comércio atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    }
  });
};