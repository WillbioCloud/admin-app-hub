-- Adicionar políticas RLS para a tabela rewards
-- Permitir que admins e comerciantes gerenciem recompensas

-- Política para INSERT - admins e comerciantes podem criar recompensas
CREATE POLICY "Admins e comerciantes podem criar recompensas" 
ON rewards 
FOR INSERT 
WITH CHECK (
  get_admin_user_role() = 'admin' OR 
  get_admin_user_role() = 'comerciante'
);

-- Política para UPDATE - admins e comerciantes podem atualizar recompensas
CREATE POLICY "Admins e comerciantes podem atualizar recompensas" 
ON rewards 
FOR UPDATE 
USING (
  get_admin_user_role() = 'admin' OR 
  get_admin_user_role() = 'comerciante'
);

-- Política para DELETE - admins e comerciantes podem deletar recompensas
CREATE POLICY "Admins e comerciantes podem deletar recompensas" 
ON rewards 
FOR DELETE 
USING (
  get_admin_user_role() = 'admin' OR 
  get_admin_user_role() = 'comerciante'
);