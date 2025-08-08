-- Primeiro, vamos criar uma tabela para rastrear o status de leitura das notificações por usuário
CREATE TABLE public.user_notification_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.user_notification_reads ENABLE ROW LEVEL SECURITY;

-- Política para usuários poderem ver apenas seus próprios registros de leitura
CREATE POLICY "Users can view their own notification reads" 
ON public.user_notification_reads 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política para usuários poderem inserir registros de leitura para si mesmos
CREATE POLICY "Users can insert their own notification reads" 
ON public.user_notification_reads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Criar uma função para marcar notificação como lida para o usuário atual
CREATE OR REPLACE FUNCTION public.mark_notification_as_read_for_user(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_notification_reads (user_id, notification_id)
  VALUES (auth.uid(), p_notification_id)
  ON CONFLICT (user_id, notification_id) DO NOTHING;
END;
$$;

-- Criar uma função para criar notificação de boas-vindas para novos usuários
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar se é um perfil mobile (não admin)
  IF NEW.user_type IS NULL OR NEW.user_type = 'cliente' OR NEW.user_type = 'comerciante' THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      metadata
    ) VALUES (
      NEW.id,
      'Bem-vindo(a) ao FBZ App! 🎉',
      'Seja bem-vindo(a) ao nosso aplicativo! Explore todas as funcionalidades disponíveis e descubra os benefícios exclusivos para você.',
      'app_update',
      jsonb_build_object(
        'welcome', true,
        'user_type', COALESCE(NEW.user_type, 'cliente')
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para notificação de boas-vindas na tabela profiles
CREATE TRIGGER trigger_welcome_notification_profiles
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_welcome_notification();

-- Criar trigger para notificação de boas-vindas na tabela admin_profiles  
CREATE TRIGGER trigger_welcome_notification_admin_profiles
  AFTER INSERT ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_welcome_notification();

-- Atualizar a política de notificações para incluir notificações específicas do usuário e globais
DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias notificações" ON public.notifications;

CREATE POLICY "Users can view global and their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id IS NULL OR user_id = auth.uid());

-- Criar uma view para facilitar a consulta de notificações com status de leitura
CREATE OR REPLACE VIEW public.notifications_with_read_status AS
SELECT 
  n.*,
  CASE 
    WHEN unr.read_at IS NOT NULL THEN true 
    ELSE false 
  END as is_read_by_user,
  unr.read_at as read_at_by_user
FROM public.notifications n
LEFT JOIN public.user_notification_reads unr 
  ON n.id = unr.notification_id 
  AND unr.user_id = auth.uid()
ORDER BY n.created_at DESC;