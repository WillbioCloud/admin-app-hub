
-- Atualizar políticas da tabela missions para permitir comerciantes criarem e admins gerenciarem
DROP POLICY IF EXISTS "Allow authenticated users to read missions" ON public.missions;

CREATE POLICY "Usuários autenticados podem ver missões ativas" 
  ON public.missions 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins podem gerenciar todas as missões" 
  ON public.missions 
  FOR ALL 
  USING (public.get_admin_user_role() = 'admin') 
  WITH CHECK (public.get_admin_user_role() = 'admin');

CREATE POLICY "Comerciantes podem criar missões" 
  ON public.missions 
  FOR INSERT 
  WITH CHECK (public.get_admin_user_role() = 'comerciante');

-- Adicionar coluna de status e comerciante à tabela missions
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Atualizar política da tabela admin_profiles para permitir criação
CREATE POLICY "Permitir criação de perfil admin" 
  ON public.admin_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Criar índices para otimizar consultas
CREATE INDEX IF NOT EXISTS missions_status_idx ON public.missions(status);
CREATE INDEX IF NOT EXISTS missions_created_by_idx ON public.missions(created_by);
CREATE INDEX IF NOT EXISTS missions_location_idx ON public.missions(loteamento_id, location_type);
