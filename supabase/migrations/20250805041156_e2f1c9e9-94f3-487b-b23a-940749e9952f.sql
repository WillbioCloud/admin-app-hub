-- Criar tabela leaderboard para ranking de usuários
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  points BIGINT DEFAULT 0,
  level BIGINT DEFAULT 1,
  coins BIGINT DEFAULT 0,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários autenticados podem ver o leaderboard" ON public.leaderboard
  FOR SELECT USING (true);

-- Criar função para atualizar o leaderboard
CREATE OR REPLACE FUNCTION public.update_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Limpar tabela existente
  DELETE FROM public.leaderboard;
  
  -- Inserir dados atualizados do ranking
  INSERT INTO public.leaderboard (user_id, full_name, avatar_url, points, level, coins, position)
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.points,
    p.level,
    p.coins,
    ROW_NUMBER() OVER (ORDER BY p.points DESC, p.level DESC) as position
  FROM public.profiles p
  WHERE p.user_type IN ('cliente', 'comerciante')
  AND p.points > 0
  ORDER BY p.points DESC, p.level DESC
  LIMIT 100;
END;
$$;

-- Popular a tabela inicial
SELECT public.update_leaderboard();