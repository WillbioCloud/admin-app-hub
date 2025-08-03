-- Ativar RLS nas tabelas que estão faltando
ALTER TABLE public.gamificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recompensas ENABLE ROW LEVEL SECURITY;

-- Políticas para gamificacoes
CREATE POLICY "Admins podem gerenciar gamificações" 
ON public.gamificacoes 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Usuários autenticados podem ver gamificações ativas" 
ON public.gamificacoes 
FOR SELECT 
USING (ativo = true);

-- Políticas para recompensas 
CREATE POLICY "Admins podem gerenciar recompensas" 
ON public.recompensas 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Usuários autenticados podem ver recompensas ativas" 
ON public.recompensas 
FOR SELECT 
USING (ativo = true);