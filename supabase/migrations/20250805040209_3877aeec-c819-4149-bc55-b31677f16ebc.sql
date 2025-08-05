-- Remover trigger existente primeiro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Dropar a tabela se existir
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recriar a tabela profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT,
  full_name TEXT,
  avatar_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  realtor_level TEXT,
  points BIGINT DEFAULT 0,
  level BIGINT DEFAULT 1,
  coins BIGINT DEFAULT 0,
  user_status TEXT,
  phone TEXT
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Recriar função para novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recuperar dados dos usuários existentes
INSERT INTO public.profiles (id, full_name, avatar_url, phone)
SELECT
  u.id,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url',
  u.raw_user_meta_data->>'phone'
FROM
  auth.users u;