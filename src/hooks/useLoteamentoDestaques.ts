import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoteamentoDestaque {
  id: string;
  loteamento_id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLoteamentoDestaqueData {
  loteamento_id: string;
  nome: string;
  ativo?: boolean;
}

export interface UpdateLoteamentoDestaqueData {
  nome?: string;
  ativo?: boolean;
}

export const useLoteamentoDestaques = () => {
  return useQuery({
    queryKey: ['loteamento-destaques'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loteamento_destaques')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LoteamentoDestaque[];
    },
  });
};

export const useCreateLoteamentoDestaque = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateLoteamentoDestaqueData) => {
      const { data: result, error } = await supabase
        .from('loteamento_destaques')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loteamento-destaques'] });
      toast({
        title: "Sucesso",
        description: "Loteamento adicionado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar loteamento",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLoteamentoDestaque = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLoteamentoDestaqueData }) => {
      const { data: result, error } = await supabase
        .from('loteamento_destaques')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loteamento-destaques'] });
      toast({
        title: "Sucesso",
        description: "Loteamento atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar loteamento",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLoteamentoDestaque = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loteamento_destaques')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loteamento-destaques'] });
      toast({
        title: "Sucesso",
        description: "Loteamento removido com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover loteamento",
        variant: "destructive",
      });
    },
  });
};

export const useToggleLoteamentoDestaque = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data: result, error } = await supabase
        .from('loteamento_destaques')
        .update({ ativo })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, { ativo }) => {
      queryClient.invalidateQueries({ queryKey: ['loteamento-destaques'] });
      toast({
        title: "Sucesso",
        description: `Destaque ${ativo ? 'ativado' : 'desativado'} com sucesso!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do destaque",
        variant: "destructive",
      });
    },
  });
};