-- Corrigir as questões de segurança da migração anterior

-- Habilitar RLS na view (recrear como função para evitar problema de security definer)
DROP VIEW IF EXISTS public.notifications_with_read_status;

CREATE OR REPLACE FUNCTION public.get_notifications_with_read_status()
RETURNS TABLE (
  id UUID,
  title TEXT,
  message TEXT,
  type public.notification_type,
  metadata JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  is_read_by_user BOOLEAN,
  read_at_by_user TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.metadata,
    n.user_id,
    n.created_at,
    CASE 
      WHEN unr.read_at IS NOT NULL THEN true 
      ELSE false 
    END as is_read_by_user,
    unr.read_at as read_at_by_user
  FROM public.notifications n
  LEFT JOIN public.user_notification_reads unr 
    ON n.id = unr.notification_id 
    AND unr.user_id = auth.uid()
  WHERE n.user_id IS NULL OR n.user_id = auth.uid()
  ORDER BY n.created_at DESC;
$$;

-- Garantir que a política para user_notification_reads permita também atualizações
CREATE POLICY "Users can update their own notification reads" 
ON public.user_notification_reads 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Remover coluna is_read da tabela notifications (não é mais necessária)
-- mas vamos manter por compatibilidade e apenas não usar

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_notification_reads_user_id ON public.user_notification_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_reads_notification_id ON public.user_notification_reads(notification_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);