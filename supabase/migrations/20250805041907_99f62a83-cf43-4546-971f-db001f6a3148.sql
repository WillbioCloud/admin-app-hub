-- Remover a tabela leaderboard
DROP TABLE IF EXISTS public.leaderboard CASCADE;

-- Criar a VIEW leaderboard como era antes
CREATE OR REPLACE VIEW public.leaderboard AS
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

-- Habilitar RLS na view
ALTER VIEW public.leaderboard SET (security_invoker = true);

-- Criar política RLS para a view
CREATE POLICY "Usuários autenticados podem ver o leaderboard" ON public.leaderboard
  FOR SELECT USING (true);