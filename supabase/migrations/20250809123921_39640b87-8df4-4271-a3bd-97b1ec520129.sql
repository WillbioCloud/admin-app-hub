-- Atualizar função para criar perfis nas tabelas corretas baseado no contexto
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Se for contexto admin_web ou OAuth, cria perfil admin
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