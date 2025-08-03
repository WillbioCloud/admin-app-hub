-- Corrigir a função para não usar SECURITY DEFINER desnecessariamente
DROP FUNCTION IF EXISTS get_creator_info(UUID);

-- Criar view simples para buscar informações do criador
CREATE OR REPLACE VIEW creator_info AS
SELECT 
  ap.id,
  ap.full_name,
  ap.user_type::text as user_type,
  'admin' as profile_type
FROM public.admin_profiles ap
UNION ALL
SELECT 
  p.id,
  p.full_name,
  p.user_type::text as user_type,
  'user' as profile_type
FROM public.profiles p;