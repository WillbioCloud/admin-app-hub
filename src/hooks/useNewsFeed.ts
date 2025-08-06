import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url?: string | null;
  media_type?: 'IMAGE' | 'VIDEO';
  author_name?: string | null;
  author_avatar_url?: string | null;
  location?: string | null;
  likes: number | null;
  comments: number | null;
  views?: number | null;
  published_at: string;
}

// Hook para buscar notícias do feed
export const useNewsFeed = () => {
  return useQuery({
    queryKey: ['news_feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_feed')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar feed de notícias:', error);
        throw error;
      }
      
      return data as NewsItem[];
    },
  });
};

// Hook para criar notícia
export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (news: Omit<NewsItem, 'id' | 'published_at' | 'likes' | 'comments'>) => {
      const { data, error } = await supabase
        .from('news_feed')
        .insert([{
          ...news,
          likes: 0,
          comments: 0,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar notícia:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news_feed'] });
      toast.success('Notícia publicada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar notícia:', error);
      toast.error('Erro ao publicar notícia');
    },
  });
};

// Hook para atualizar notícia
export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<NewsItem, 'id'>> }) => {
      const { data: result, error } = await supabase
        .from('news_feed')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar notícia:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news_feed'] });
      toast.success('Notícia atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar notícia:', error);
      toast.error('Erro ao atualizar notícia');
    },
  });
};

// Hook para deletar notícia
export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('news_feed')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar notícia:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news_feed'] });
      toast.success('Notícia excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar notícia:', error);
      toast.error('Erro ao excluir notícia');
    },
  });
};