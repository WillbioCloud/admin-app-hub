-- Corrigir search_path para as funções existentes
CREATE OR REPLACE FUNCTION public.perform_health_info_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.health_info
  WHERE
    -- Condição 1: A dica foi criada há mais de 30 dias
    created_at < NOW() - INTERVAL '30 days'

    -- Condição 2: A dica NÃO é a nossa dica de nutrição automática (id 999)
    AND id != 999

    -- Condição 3: O ID da dica NÃO existe na tabela de favoritos de NENHUM usuário
    AND id NOT IN (SELECT health_info_id FROM public.user_favorites);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(user_type::text, 'comerciante')
  FROM public.profiles
  WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_admin_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(user_type::text, 'comerciante')
  FROM public.admin_profiles
  WHERE id = auth.uid();
$$;