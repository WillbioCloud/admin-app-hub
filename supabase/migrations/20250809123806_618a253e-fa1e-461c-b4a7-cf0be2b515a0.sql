-- Remover o trigger antigo e criar o correto para admin_profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para tabela profiles (app mobile)
CREATE TRIGGER on_auth_user_created_profiles
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.raw_user_meta_data->>'app_context' IS NULL OR NEW.raw_user_meta_data->>'app_context' != 'admin_web')
  EXECUTE FUNCTION public.handle_new_user();

-- Criar trigger para tabela admin_profiles (painel web)
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.raw_user_meta_data->>'app_context' = 'admin_web')
  EXECUTE FUNCTION public.handle_new_admin_user();