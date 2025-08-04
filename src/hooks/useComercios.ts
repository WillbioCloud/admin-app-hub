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

/**
 * Função auxiliar que agora chama a função segura do banco de dados (RPC).
 */
const createNotificationRpc = async (userId: string, title: string, message: string) => {
    try {
        const { error } = await supabase.rpc('create_notification_for_user', {
            target_user_id: userId,
            notification_title: title,
            notification_message: message
        });
        if (error) throw error; // Lança o erro para o catch
    } catch (err: any) {
        console.error("RPC Error:", err.message);
        toast.error("Falha ao enviar notificação: Permissão negada ou função não encontrada no DB.");
    }
}

export const useApproveComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { error } = await supabase.from('comercios').update({ status: 'approved', ativo: true }).eq('id', comercio.id);
      if (error) throw new Error(`Falha ao aprovar: ${error.message}`);
      return comercio; 
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success("Comércio aprovado com sucesso!");
      createNotificationRpc(data.user_id, "Seu comércio foi aprovado!", `Parabéns, ${data.nome} agora está ativo na plataforma.`);
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

export const useRejectComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { error } = await supabase.from('comercios').update({ status: 'rejected', ativo: false }).eq('id', comercio.id);
      if (error) throw new Error(`Falha ao rejeitar: ${error.message}`);
      return comercio;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.info("Comércio rejeitado.");
      createNotificationRpc(data.user_id, "Seu comércio precisa de ajustes", `O seu comércio ${data.nome} foi revisado. Por favor, verifique-o no seu painel.`);
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
      const { data, error } = await supabase.from('comercios').insert({ ...newComercio, status: 'pending', ativo: false }).select().single();
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
      const { data, error } = await supabase.from('comercios').update({ ...updateData, status: 'pending', ativo: false }).eq('id', id).select().single();
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