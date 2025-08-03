-- Adicionar colunas para rastrear quem criou recompensas e missões
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.missions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON public.missions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para buscar informações do usuário criador
CREATE OR REPLACE FUNCTION get_creator_info(user_id UUID)
RETURNS TABLE(
  full_name TEXT,
  user_type TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Primeiro tenta buscar nos admin_profiles
  RETURN QUERY
  SELECT 
    ap.full_name,
    ap.user_type::text
  FROM public.admin_profiles ap
  WHERE ap.id = user_id;
  
  -- Se não encontrou, busca nos profiles normais
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      p.full_name,
      p.user_type::text
    FROM public.profiles p
    WHERE p.id = user_id;
  END IF;
END;
$$;