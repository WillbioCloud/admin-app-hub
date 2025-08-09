-- Corrigir função que está usando 'cliente' inválido no enum
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verificar se é um perfil mobile (não admin) 
  -- Removendo a referência a 'cliente' que não existe no enum
  IF NEW.user_type IS NULL OR NEW.user_type = 'comerciante' THEN
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
        'user_type', COALESCE(NEW.user_type, 'comerciante')
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;