-- Primeiro, vamos verificar se existe a função get_admin_user_role
-- Se não existir, vamos criá-la

-- Criar a função get_admin_user_role se não existir
CREATE OR REPLACE FUNCTION get_admin_user_role()
RETURNS TEXT AS $$
BEGIN
  -- Verifica se o usuário está na tabela admin_profiles
  IF EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE id = auth.uid()
  ) THEN
    -- Retorna o user_type da tabela admin_profiles
    RETURN (
      SELECT user_type::text 
      FROM admin_profiles 
      WHERE id = auth.uid()
    );
  END IF;
  
  -- Se não está na tabela admin_profiles, retorna 'cliente'
  RETURN 'cliente';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agora vamos atualizar as políticas da tabela notifications
-- Primeiro remover as políticas existentes que estão com problemas
DROP POLICY IF EXISTS "Admins podem criar notificações" ON notifications;
DROP POLICY IF EXISTS "Admins podem atualizar notificações" ON notifications;
DROP POLICY IF EXISTS "Admins podem deletar notificações" ON notifications;

-- Criar novas políticas que funcionem corretamente
CREATE POLICY "Admins podem criar notificações" 
ON notifications 
FOR INSERT 
WITH CHECK (get_admin_user_role() = 'admin');

CREATE POLICY "Admins podem atualizar notificações" 
ON notifications 
FOR UPDATE 
USING (get_admin_user_role() = 'admin')
WITH CHECK (get_admin_user_role() = 'admin');

CREATE POLICY "Admins podem deletar notificações" 
ON notifications 
FOR DELETE 
USING (get_admin_user_role() = 'admin');