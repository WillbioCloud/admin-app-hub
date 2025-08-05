-- ========= PASSO 1: RECRIANDO A TABELA 'PROFILES' EXATAMENTE COMO ERA =========
-- Este comando cria a tabela com todas as colunas do seu print.
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- ========= PASSO 2: CONFIGURANDO A SEGURANÇA (RLS) PARA A TABELA =========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ========= PASSO 3: CRIANDO O GATILHO PARA NOVOS USUÁRIOS (ESSENCIAL) =========
-- Esta função garante que todo novo usuário que se cadastrar terá um perfil criado automaticamente.
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

-- Ativa o gatilho.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========= PASSO 4: SCRIPT DE RECUPERAÇÃO DE DADOS (O MAIS IMPORTANTE) =========
-- Este comando vai ler sua tabela de autenticação e inserir os usuários que faltam na sua tabela 'profiles',
-- recuperando os dados que foram perdidos.
INSERT INTO public.profiles (id, full_name, avatar_url, phone)
SELECT
  u.id,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url',
  u.raw_user_meta_data->>'phone'
FROM
  auth.users u
WHERE
  u.id NOT IN (SELECT id FROM public.profiles);