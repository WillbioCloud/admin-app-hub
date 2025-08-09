-- Solução para o problema do primeiro admin
-- Se não existir nenhum admin, o primeiro usuário admin criado será automaticamente ativo

-- Atualizar função para auto-aprovar o primeiro admin
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Se for contexto admin_web ou OAuth, cria perfil admin
  IF NEW.raw_user_meta_data->>'app_context' = 'admin_web' OR NEW.app_metadata->>'provider' IN ('google', 'facebook', 'apple') THEN
    
    -- Verificar se já existe algum admin
    SELECT COUNT(*) INTO admin_count 
    FROM public.admin_profiles 
    WHERE user_type = 'admin';
    
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
        NEW.email
      ),
      CASE 
        WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::admin_user_role
        WHEN NEW.raw_user_meta_data->>'user_type' = 'comerciante' THEN 'comerciante'::admin_user_role
        ELSE 'comerciante'::admin_user_role
      END,
      NEW.raw_user_meta_data->>'phone',
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    );
    
    -- Se for o primeiro admin sendo criado, criar notificação especial
    IF admin_count = 0 AND NEW.raw_user_meta_data->>'user_type' = 'admin' THEN
      INSERT INTO public.notifications (
        title,
        message,
        type,
        metadata
      ) VALUES (
        'Primeiro Admin Criado! 🎉',
        'O primeiro administrador do sistema foi criado com sucesso. Agora você pode gerenciar usuários e configurações.',
        'app_update',
        jsonb_build_object(
          'first_admin', true,
          'admin_id', NEW.id
        )
      );
    END IF;
    
  ELSE
    -- Se não for contexto admin_web, cria perfil mobile
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'avatar_url', 
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';