
-- Criar o tipo admin_user_role se não existir
DO $$ BEGIN
    CREATE TYPE admin_user_role AS ENUM ('admin', 'comerciante');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recriar a função handle_new_admin_user com o tipo correto
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Só criar perfil admin se o usuário foi registrado com contexto 'admin_web'
  IF new.raw_user_meta_data ->> 'app_context' = 'admin_web' THEN
    INSERT INTO public.admin_profiles (id, full_name, user_type, phone)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
      COALESCE((new.raw_user_meta_data ->> 'user_type')::admin_user_role, 'comerciante'::admin_user_role),
      new.raw_user_meta_data ->> 'phone'
    );
  END IF;
  RETURN new;
END;
$function$;

-- Recriar o trigger se necessário
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();
