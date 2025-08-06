-- Adicionar novos campos à tabela news_feed para suportar a interface móvel
ALTER TABLE public.news_feed 
ADD COLUMN video_url text,
ADD COLUMN media_type text DEFAULT 'IMAGE' CHECK (media_type IN ('IMAGE', 'VIDEO')),
ADD COLUMN author_name text DEFAULT 'FBZ Empreendimentos',
ADD COLUMN author_avatar_url text,
ADD COLUMN location text DEFAULT 'Cidade Inteligente';

-- Atualizar views existente para garantir que novos campos tenham valores padrão
UPDATE public.news_feed 
SET views = COALESCE(views, 0) 
WHERE views IS NULL;