-- Permitir que admins atualizem loteamentos
CREATE POLICY "Admins podem atualizar loteamentos" 
ON public.loteamentos 
FOR UPDATE 
USING (get_admin_user_role() = 'admin'::text);