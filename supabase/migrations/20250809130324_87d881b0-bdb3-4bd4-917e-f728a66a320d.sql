-- Inserir o perfil admin manualmente
INSERT INTO public.admin_profiles (
  id,
  full_name,
  user_type,
  phone,
  avatar_url
) VALUES (
  '6f336bf7-1ebd-4cdd-9975-73cc309df828',
  'Admin Ricardo',
  'admin'::admin_user_role,
  '64999232217',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin'::admin_user_role,
  full_name = 'Admin Ricardo',
  phone = '64999232217';