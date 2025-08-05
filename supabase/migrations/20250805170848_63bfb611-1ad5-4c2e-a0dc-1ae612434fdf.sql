-- Criar tabela para gerenciar destaques dos loteamentos
CREATE TABLE public.loteamento_destaques (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loteamento_id text NOT NULL UNIQUE,
  nome text NOT NULL,
  ativo boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loteamento_destaques ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar destaques
CREATE POLICY "Admins podem gerenciar destaques dos loteamentos" 
ON public.loteamento_destaques 
FOR ALL 
USING (public.get_admin_user_role() = 'admin')
WITH CHECK (public.get_admin_user_role() = 'admin');

-- Usuários autenticados podem ver destaques ativos
CREATE POLICY "Usuários podem ver destaques ativos" 
ON public.loteamento_destaques 
FOR SELECT 
USING (ativo = true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_loteamento_destaques_updated_at
BEFORE UPDATE ON public.loteamento_destaques
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns loteamentos exemplo
INSERT INTO public.loteamento_destaques (loteamento_id, nome, ativo) VALUES
('cidade-inteligente', 'Cidade Inteligente', true),
('santo-antonio', 'Santo Antonio', false),
('loteamento-exemplo', 'Loteamento Exemplo', false);