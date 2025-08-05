-- Atualizar user_type na tabela profiles baseado na tabela admin_profiles
UPDATE public.profiles 
SET user_type = (
  SELECT CASE 
    WHEN ap.user_type = 'admin' THEN 'admin'
    WHEN ap.user_type = 'comerciante' THEN 'comerciante'
    ELSE 'cliente'
  END
  FROM admin_profiles ap 
  WHERE ap.id = profiles.id
)
WHERE EXISTS (
  SELECT 1 FROM admin_profiles ap WHERE ap.id = profiles.id
);

-- Para usuários que não estão na admin_profiles, definir como 'cliente'
UPDATE public.profiles 
SET user_type = 'cliente'
WHERE user_type IS NULL;