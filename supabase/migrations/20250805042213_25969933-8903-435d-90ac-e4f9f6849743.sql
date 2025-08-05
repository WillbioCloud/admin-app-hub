-- Ajustar a VIEW leaderboard para retornar os campos que o React Native espera
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.points as xp,  -- Renomear points para xp
  p.level,
  p.coins,
  ROW_NUMBER() OVER (ORDER BY p.points DESC, p.level DESC) as position
FROM public.profiles p
WHERE p.user_type IN ('cliente', 'comerciante')
AND p.points > 0
ORDER BY p.points DESC, p.level DESC
LIMIT 100;