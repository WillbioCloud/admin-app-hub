-- Limpeza de dados para reduzir uso de egress do Supabase

-- 1. Limpar tabela health_info - manter apenas dicas favoritas e dica padrão
DELETE FROM public.health_info
WHERE 
  -- Condição 1: A dica foi criada há mais de 30 dias
  created_at < NOW() - INTERVAL '30 days'
  -- Condição 2: A dica NÃO é a nossa dica de nutrição automática (id 999)
  AND id != 999
  -- Condição 3: O ID da dica NÃO existe na tabela de favoritos de NENHUM usuário
  AND id NOT IN (SELECT health_info_id FROM public.user_favorites);

-- 2. Limpar notificações antigas (mais de 30 dias)
DELETE FROM public.user_notification_reads 
WHERE notification_id IN (
  SELECT id FROM public.notifications 
  WHERE created_at < NOW() - INTERVAL '30 days'
);

DELETE FROM public.notifications
WHERE created_at < NOW() - INTERVAL '30 days';

-- 3. Limpar nutrition_queries antigas (mais de 90 dias)
DELETE FROM public.nutrition_queries
WHERE created_at < NOW() - INTERVAL '90 days';

-- 4. Limpar views e likes de posts antigos (mais de 90 dias)
DELETE FROM public.post_views
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM public.comment_likes
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM public.post_likes
WHERE created_at < NOW() - INTERVAL '90 days';

-- 5. Limpar posts de comentários órfãos
DELETE FROM public.post_comments
WHERE post_id NOT IN (SELECT id FROM public.news_feed);

-- 6. Atualizar estatísticas do PostgreSQL para otimizar performance
ANALYZE;