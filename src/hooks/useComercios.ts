import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// A interface representa a estrutura de um Comércio, baseada no seu projeto.
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
}

// --- HOOKS PARA O PAINEL DO ADMIN ---

/**
 * Hook para buscar TODOS os comércios.
 * Usado na página principal de gerenciamento de comércios do admin.
 */
export const useComercios = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async (): Promise<Comercio[]> => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

/**
 * Hook para buscar apenas comércios PENDENTES.
 * Usado exclusivamente na página de aprovações do admin.
 */
export const usePendingComercios = () => {
  return useQuery({
    queryKey: ['comercios-pending'],
    queryFn: async (): Promise<Comercio[]> => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

/**
 * Função auxiliar para criar notificação de forma segura.
 * Se falhar, avisa no console e com um toast, mas NÃO impede a aprovação.
 */
const createNotification = async (userId: string, title: string, message: string) => {
    try {
        const { error } = await supabase.from('notifications').insert({
            user_id: userId,
            title,
            message,
            type: 'approval'
        });
        if (error) throw error;
    } catch (err: any) {
        console.error("Falha ao criar notificação:", err.message);
        toast.warning("Ação principal concluída, mas falha ao enviar notificação ao usuário.");
    }
}

/**
 * Hook para APROVAR um comércio.
 * Atualiza o status para 'approved' e 'ativo' como true.
 */
export const useApproveComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ status: 'approved', ativo: true })
        .eq('id', comercio.id)
        .select()
        .single();
      if (error) throw new Error(`Falha ao aprovar: ${error.message}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success("Comércio aprovado com sucesso!");
      createNotification(data.user_id, "Seu comércio foi aprovado!", `Parabéns, ${data.nome} agora está ativo na plataforma.`);
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

/**
 * Hook para REJEITAR um comércio.
 * Atualiza o status para 'rejected' e 'ativo' como false.
 */
export const useRejectComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ status: 'rejected', ativo: false })
        .eq('id', comercio.id)
        .select()
        .single();
      if (error) throw new Error(`Falha ao rejeitar: ${error.message}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.info("Comércio rejeitado.");
      createNotification(data.user_id, "Seu comércio precisa de ajustes", `O seu comércio ${data.nome} foi revisado. Por favor, verifique-o no seu painel.`);
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

/**
 * Hook DEDICADO para ativar ou inativar a visibilidade de um comércio.
 * Altera apenas a coluna 'ativo'.
 */
export const useUpdateComercioAtivoStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, newStatus }: { id: string, newStatus: boolean }) => {
            const { error } = await supabase
                .from('comercios')
                .update({ ativo: newStatus })
                .eq('id', id);
            if (error) throw new Error(`Falha ao atualizar status: ${error.message}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comercios'] });
            toast.success("Visibilidade do comércio atualizada!");
        },
        onError: (error: Error) => toast.error(error.message)
    });
};


// --- HOOKS PARA O PAINEL DO COMERCIANTE ---

/**
 * Hook para buscar os dados do comércio do usuário logado.
 */
export const useMeuComercio = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['meu-comercio', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Erro ao buscar meu comércio:', error);
        throw error;
      }
      
      return data as Comercio | null;
    },
    enabled: !!userId,
  });
};

/**
 * Hook para o comerciante criar um novo comércio.
 */
export const useCreateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComercio: Partial<Comercio>) => {
      const { data, error } = await supabase
        .from('comercios')
        .insert({ ...newComercio, status: 'pending', ativo: false })
        .select()
        .single();

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

/**
 * Hook para o comerciante atualizar seu comércio.
 */
export const useUpdateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Comercio> & { id: string }) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ ...updateData, status: 'pending', ativo: false })
        .eq('id', id)
        .select()
        .single();

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