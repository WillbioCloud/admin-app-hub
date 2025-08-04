-- Adicionar campo avatar para admin_profiles
ALTER TABLE public.admin_profiles 
ADD COLUMN avatar_url TEXT;

-- Adicionar campo avatar para profiles também (caso não exista)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;