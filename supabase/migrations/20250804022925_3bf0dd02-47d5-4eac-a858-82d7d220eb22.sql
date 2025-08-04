-- Corrigir políticas RLS para comercios
-- Permitir que admins façam UPDATE em comércios para aprovar/rejeitar

-- Remover política existente se existir e recriar
DROP POLICY IF EXISTS "Admins podem ver todos os comércios" ON comercios;
DROP POLICY IF EXISTS "Admins podem deletar comércios" ON comercios;

-- Política para admins visualizarem todos os comércios
CREATE POLICY "Admins podem ver todos os comércios" 
ON comercios FOR SELECT 
USING (get_admin_user_role() = 'admin');

-- Política para admins atualizarem (aprovar/rejeitar) comércios
CREATE POLICY "Admins podem atualizar comércios" 
ON comercios FOR UPDATE 
USING (get_admin_user_role() = 'admin')
WITH CHECK (get_admin_user_role() = 'admin');

-- Política para admins deletarem comércios
CREATE POLICY "Admins podem deletar comércios" 
ON comercios FOR DELETE 
USING (get_admin_user_role() = 'admin');