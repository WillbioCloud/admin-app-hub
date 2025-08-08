-- Limpar dados de teste e preparar para autenticação com confirmação de email

-- 1. Limpar usuários de teste das tabelas de perfil
DELETE FROM public.admin_profiles WHERE user_type = 'comerciante' OR created_at < NOW() - INTERVAL '1 day';
DELETE FROM public.profiles WHERE created_at < NOW() - INTERVAL '1 day';

-- 2. Limpar comercios de teste
DELETE FROM public.comercios WHERE status = 'pending' OR created_at < NOW() - INTERVAL '1 day';

-- 3. Limpar notificações antigas
DELETE FROM public.user_notification_reads;
DELETE FROM public.notifications WHERE created_at < NOW() - INTERVAL '1 day';

-- 4. Limpar dados de gamificação de teste
DELETE FROM public.user_completed_missions WHERE completed_at < NOW() - INTERVAL '1 day';
DELETE FROM public.user_rewards WHERE created_at < NOW() - INTERVAL '1 day';
DELETE FROM public.missions WHERE status = 'pending';
DELETE FROM public.rewards WHERE created_at < NOW() - INTERVAL '1 day';

-- 5. Atualizar função de criação de perfil admin para suportar OAuth
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Só cria perfil admin se o contexto for admin_web ou se for OAuth
  IF NEW.raw_user_meta_data->>'app_context' = 'admin_web' OR NEW.app_metadata->>'provider' IN ('google', 'facebook', 'apple') THEN
    INSERT INTO public.admin_profiles (
      id,
      full_name,
      user_type,
      phone,
      avatar_url
    ) VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        NEW.email_confirmed_at::text,
        NEW.email
      ),
      COALESCE((NEW.raw_user_meta_data->>'user_type')::admin_user_role, 'comerciante'::admin_user_role),
      NEW.raw_user_meta_data->>'phone',
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas não bloqueia o signup
  RAISE WARNING 'Erro ao criar perfil admin para usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';