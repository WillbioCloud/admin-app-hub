-- Corrigir políticas RLS para comercios 
-- Usando get_user_role() sem parâmetros (versão específica)

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todos os comércios" ON comercios;
DROP POLICY IF EXISTS "Admins podem atualizar comércios" ON comercios; 
DROP POLICY IF EXISTS "Admins podem deletar comércios" ON comercios;

-- Política para admins visualizarem todos os comércios
CREATE POLICY "Admins podem ver todos os comércios" 
ON comercios FOR SELECT 
USING (get_user_role()::text = 'admin');

-- Política para admins atualizarem (aprovar/rejeitar) comércios
CREATE POLICY "Admins podem atualizar comércios" 
ON comercios FOR UPDATE 
USING (get_user_role()::text = 'admin')
WITH CHECK (get_user_role()::text = 'admin');

-- Política para admins deletarem comércios
CREATE POLICY "Admins podem deletar comércios" 
ON comercios FOR DELETE 
USING (get_user_role()::text = 'admin');