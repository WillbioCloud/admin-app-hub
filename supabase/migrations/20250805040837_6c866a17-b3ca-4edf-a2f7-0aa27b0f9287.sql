-- Definir status padrão para todos os usuários
UPDATE public.profiles 
SET user_status = 'ativo'
WHERE user_status IS NULL;

-- Aprovar usuários admin e comerciantes
UPDATE public.profiles 
SET is_approved = true
WHERE user_type IN ('admin', 'comerciante');