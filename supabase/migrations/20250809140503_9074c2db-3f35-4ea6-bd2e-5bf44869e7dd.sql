-- Remover política antiga que pode estar causando conflito
DROP POLICY IF EXISTS "Comerciantes podem ver e editar seus próprios comércios" ON public.comercios;

-- Criar política simplificada para INSERT
DROP POLICY IF EXISTS "Usuários autenticados podem criar comercios" ON public.comercios;
CREATE POLICY "Usuários podem criar comercios" ON public.comercios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Atualizar política de UPDATE para ser mais específica
DROP POLICY IF EXISTS "Donos e Admins podem atualizar seus comercios" ON public.comercios;
CREATE POLICY "Donos e Admins podem atualizar comercios" ON public.comercios
  FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid()) OR 
    (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND user_type = 'admin'))
  )
  WITH CHECK (
    (user_id = auth.uid()) OR 
    (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND user_type = 'admin'))
  );