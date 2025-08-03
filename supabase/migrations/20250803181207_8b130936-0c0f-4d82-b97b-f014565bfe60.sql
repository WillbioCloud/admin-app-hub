-- Dropar todas as políticas que dependem da função antes de recriá-la
DROP POLICY IF EXISTS "Admins podem gerenciar todas as missões" ON public.missions;
DROP POLICY IF EXISTS "Comerciantes podem criar missões" ON public.missions;
DROP POLICY IF EXISTS "Admins e comerciantes podem criar recompensas" ON public.rewards;
DROP POLICY IF EXISTS "Admins e comerciantes podem atualizar recompensas" ON public.rewards;
DROP POLICY IF EXISTS "Admins e comerciantes podem deletar recompensas" ON public.rewards;
DROP POLICY IF EXISTS "Admins podem criar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem atualizar notificações" ON public.notifications;
DROP POLICY IF EXISTS "Admins podem deletar notificações" ON public.notifications;

-- Agora posso dropar e recriar a função
DROP FUNCTION IF EXISTS public.get_admin_user_role();

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

-- Recriar todas as políticas
CREATE POLICY "Admins podem gerenciar todas as missões" 
ON public.missions 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Comerciantes podem criar missões" 
ON public.missions 
FOR INSERT 
WITH CHECK (public.get_admin_user_role() = 'comerciante');

CREATE POLICY "Admins e comerciantes podem criar recompensas" 
ON public.rewards 
FOR INSERT 
WITH CHECK ((public.get_admin_user_role() = 'admin') OR (public.get_admin_user_role() = 'comerciante'));

CREATE POLICY "Admins e comerciantes podem atualizar recompensas" 
ON public.rewards 
FOR UPDATE 
USING ((public.get_admin_user_role() = 'admin') OR (public.get_admin_user_role() = 'comerciante'));

CREATE POLICY "Admins e comerciantes podem deletar recompensas" 
ON public.rewards 
FOR DELETE 
USING ((public.get_admin_user_role() = 'admin') OR (public.get_admin_user_role() = 'comerciante'));

-- Políticas para notificações (CORRIGIDAS)
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