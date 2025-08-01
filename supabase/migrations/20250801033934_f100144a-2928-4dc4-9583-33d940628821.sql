-- Criar função para limpeza automática de notificações após 30 dias
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove notificações com mais de 30 dias
  DELETE FROM public.notifications
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Criar job cron para executar a limpeza diariamente às 2h da manhã
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 2 * * *', -- diariamente às 2h
  $$
  SELECT public.cleanup_old_notifications();
  $$
);

-- Adicionar coluna status à tabela comercios se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'comercios' AND column_name = 'status') THEN
        ALTER TABLE public.comercios ADD COLUMN status text DEFAULT 'pending';
    END IF;
END $$;

-- Atualizar comércios existentes para 'approved' se estiverem ativos
UPDATE public.comercios 
SET status = 'approved' 
WHERE ativo = true AND status = 'pending';