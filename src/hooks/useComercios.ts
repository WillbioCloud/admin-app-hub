import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Interface Comercio permanece a mesma
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
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  loteamento_id?: string | null;
  visualizacoes?: number;
  curtidas?: number;
  endereco?: string | null;
}

// --- HOOKS PARA O PAINEL DO ADMIN ---

// Busca todos os comércios (para a lista principal do admin)
export const useComercios = () => {
  return useQuery({
    queryKey: ['comercios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comercio[];
    },
  });
};

// Busca apenas comércios pendentes (para a aba de aprovações)
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
      return data as Comercio[];
    },
  });
};

// Função auxiliar para criar notificação de forma segura
const createNotification = async (userId: string, title: string, message: string) => {
    const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type: 'novo_comercio' // tipo válido conforme o schema
    });
    if (error) {
        // Loga o erro mas não impede o fluxo principal
        console.error("Falha ao criar notificação:", error.message);
        toast.warning("Comércio aprovado, mas falha ao enviar notificação.");
    }
}

// Hook para APROVAR um comércio
export const useApproveComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comercio: Comercio) => {
      const { data, error } = await supabase
        .from('comercios')
        .update({ status: 'approved', ativo: true })
        .eq('id', comercio.id)
        .select() // Retorna o dado para pegar o user_id
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      // Invalida as listas para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.success("Comércio aprovado com sucesso!");
      
      // Tenta criar a notificação após o sucesso da aprovação
      createNotification(data.user_id, "Seu comércio foi aprovado!", `Parabéns, ${data.nome} agora está ativo na plataforma.`);
    },
    onError: (error: Error) => toast.error(`Erro ao aprovar: ${error.message}`)
  });
};

// Hook para REJEITAR um comércio
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
        
      if (error) throw new Error(error.message);
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comercios'] });
      queryClient.invalidateQueries({ queryKey: ['comercios-pending'] });
      toast.error("Comércio rejeitado.");
       // Tenta criar a notificação de rejeição
      createNotification(data.user_id, "Atualização sobre seu comércio", `O seu comércio, ${data.nome}, foi revisado e necessita de ajustes.`);
    },
     onError: (error: Error) => toast.error(`Erro ao rejeitar: ${error.message}`)
  });
};

// NOVO HOOK: Apenas para ATIVAR/INATIVAR um comércio
export const useUpdateComercioStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, newStatus }: { id: string, newStatus: boolean }) => {
            const { error } = await supabase
                .from('comercios')
                .update({ ativo: newStatus })
                .eq('id', id);

            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comercios'] });
            toast.success("Status do comércio atualizado!");
        },
        onError: (error: Error) => toast.error(`Erro ao atualizar status: ${error.message}`)
    });
};

// --- NOVOS HOOKS PARA O PAINEL DO COMERCIANTE ---

// Hook para buscar o comércio do usuário logado
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
      
      return data;
    },
    enabled: !!userId,
  });
};

// Hook para criar um novo comércio
export const useCreateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComercio: Partial<Comercio>) => {
      const { data, error } = await supabase
        .from('comercios')
        .insert(newComercio as any)
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

// Hook para atualizar um comércio existente
export const useUpdateComercio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Comercio> & { id: string }) => {
      const { data, error } = await supabase
        .from('comercios')
        .update(updateData)
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