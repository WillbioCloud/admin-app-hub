import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// A interface foi mantida para consistência com o restante do projeto.
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
 * Se falhar, loga o erro e avisa o usuário, mas não quebra a operação principal.
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
        toast.warning("Ação concluída, mas falha ao enviar notificação ao usuário.");
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
      // Invalida as queries para que as listas sejam atualizadas na tela.
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success("Comércio aprovado com sucesso!");
      // Envia notificação após o sucesso.
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
      toast.error("Comércio rejeitado.");
      createNotification(data.user_id, "Seu comércio precisa de ajustes", `O seu comércio ${data.nome} foi revisado. Por favor, verifique-o no seu painel.`);
    },
    onError: (error: Error) => toast.error(error.message)
  });
};

/**
 * Hook DEDICADO para ativar ou inativar a visibilidade de um comércio.
 * Altera apenas a coluna 'ativo'.
 */
export const useUpdateComercioStatus = () => {
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


// --- HOOKS EXISTENTES PARA O PAINEL ADMIN ---

// Hook para buscar todos os comércios (para admin)
export const useComercios = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para buscar comércios pendentes (para admin)
export const usePendingComercios = () => {
  return useQuery({
    queryKey: ['comercios-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Hook para APROVAR um comércio (CORRIGIDO)
export const useApproveComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("comercios")
        .update({ ativo: true, status: "approved" })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comercios-pending"] });
      toast.success("Comércio aprovado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao aprovar: ${error.message}`);
    },
  });
};

// Hook para REJEITAR um comércio (CORRIGIDO)
export const useRejectComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("comercios")
        .update({ ativo: false, status: "rejected" })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comercios-pending"] });
      toast.success("Comércio rejeitado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao rejeitar: ${error.message}`);
    },
  });
};

// Hook para deletar comércio (para admin)
export const useDeleteComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('comercios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success('Comércio excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });
};