-- Primeiro, vamos verificar a função get_admin_user_role() atual
DROP FUNCTION IF EXISTS public.get_admin_user_role();

-- Recriar a função corretamente
CREATE OR REPLACE FUNCTION public.get_admin_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verifica se o usuário está na tabela admin_profiles
  IF EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  ) THEN
    -- Retorna o user_type da tabela admin_profiles
    RETURN (
      SELECT user_type::text 
      FROM public.admin_profiles 
      WHERE id = auth.uid()
    );
  END IF;
  
  -- Se não está na tabela admin_profiles, retorna 'cliente'
  RETURN 'cliente';
END;
$$;

-- Atualizar as políticas de notifications para funcionar corretamente
DROP POLICY IF EXISTS "Admins podem criar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem atualizar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem deletar notificações" ON public.notifications;

-- Recriar as políticas corretamente
CREATE POLICY "Admins podem criar notificações" 
ON public.notifications 
FOR INSERT 
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Admins podem atualizar notificações" 
ON public.notifications 
FOR UPDATE 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Admins podem deletar notificações" 
ON public.notifications 
FOR DELETE 
USING (public.get_admin_user_role() = 'admin');

-- Ativar RLS nas tabelas que estão faltando (conforme o linter)
ALTER TABLE public.gamificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recompensas ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas básicas para as tabelas
CREATE POLICY "Admins podem gerenciar gamificações" 
ON public.gamificacoes 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Usuários autenticados podem ver gamificações ativas" 
ON public.gamificacoes 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar recompensas" 
ON public.recompensas 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Usuários autenticados podem ver recompensas ativas" 
ON public.recompensas 
FOR SELECT 
USING (ativo = true);