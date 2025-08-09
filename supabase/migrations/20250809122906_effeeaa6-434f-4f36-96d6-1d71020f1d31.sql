-- Corrigir função handle_new_admin_user para respeitar o user_type enviado no signup

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
        NEW.email
      ),
      -- CORREÇÃO: Usar user_type enviado ou comerciante como fallback
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
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log do erro mas não bloqueia o signup
  RAISE WARNING 'Erro ao criar perfil admin para usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';