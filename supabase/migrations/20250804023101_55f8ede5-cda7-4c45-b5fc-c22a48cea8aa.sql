-- Corrigir políticas RLS para comercios usando public.get_user_role()
-- Especificando o schema e sem parâmetros

-- Remover políticas existentes
DROP POLICY IF EXISTS "Admins podem ver todos os comércios" ON comercios;
DROP POLICY IF EXISTS "Admins podem atualizar comércios" ON comercios;
DROP POLICY IF EXISTS "Admins podem deletar comércios" ON comercios;

-- Política para admins visualizarem todos os comércios
CREATE POLICY "Admins podem ver todos os comércios" 
ON comercios FOR SELECT 
USING (public.get_user_role() = 'admin');

-- Política para admins atualizarem (aprovar/rejeitar) comércios
CREATE POLICY "Admins podem atualizar comércios" 
ON comercios FOR UPDATE 
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Política para admins deletarem comércios
CREATE POLICY "Admins podem deletar comércios" 
ON comercios FOR DELETE 
USING (public.get_user_role() = 'admin');