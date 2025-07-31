-- Criar políticas RLS para a tabela notifications permitindo admins gerenciarem notificações

-- Política para admins criarem notificações
CREATE POLICY "Admins podem criar notificações" 
ON public.notifications 
FOR INSERT 
WITH CHECK (get_admin_user_role() = 'admin'::text);

-- Política para admins atualizarem notificações
CREATE POLICY "Admins podem atualizar notificações" 
ON public.notifications 
FOR UPDATE 
USING (get_admin_user_role() = 'admin'::text)
WITH CHECK (get_admin_user_role() = 'admin'::text);

-- Política para admins deletarem notificações
CREATE POLICY "Admins podem deletar notificações" 
ON public.notifications 
FOR DELETE 
USING (get_admin_user_role() = 'admin'::text);