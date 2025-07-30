
-- Criar o tipo admin_user_role se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_user_role') THEN
        CREATE TYPE admin_user_role AS ENUM ('admin', 'comerciante');
    END IF;
END $$;

-- Verificar se a tabela admin_profiles existe, se não, criar
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    user_type admin_user_role NOT NULL DEFAULT 'comerciante',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS se não estiver habilitado
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Criar policies se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_profiles' AND policyname = 'Users can read own admin profile'
    ) THEN
        CREATE POLICY "Users can read own admin profile" 
        ON public.admin_profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_profiles' AND policyname = 'Users can update own admin profile'
    ) THEN
        CREATE POLICY "Users can update own admin profile" 
        ON public.admin_profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_profiles' AND policyname = 'Permitir criação de perfil admin'
    ) THEN
        CREATE POLICY "Permitir criação de perfil admin" 
        ON public.admin_profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Atualizar o trigger para usar o tipo correto
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

-- Verificar se o trigger existe, se não, criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created_admin'
    ) THEN
        CREATE TRIGGER on_auth_user_created_admin
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();
    END IF;
END $$;
