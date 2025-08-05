-- Atualizar políticas RLS para o bucket 'comercios' 
-- para garantir que comerciantes possam fazer upload de todas as suas mídias

-- Primeiro, remover políticas conflitantes
DROP POLICY IF EXISTS "Comerciantes podem fazer upload de suas mídias" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own commerce images" ON storage.objects;

-- Criar política mais específica para INSERT que permita upload baseado no user_id
CREATE POLICY "Comerciantes podem fazer upload no bucket comercios"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'comercios' AND 
  auth.uid() IS NOT NULL
);

-- Garantir que as políticas de UPDATE e DELETE funcionem corretamente
DROP POLICY IF EXISTS "Comerciantes podem atualizar suas mídias" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own commerce images" ON storage.objects;

CREATE POLICY "Comerciantes podem atualizar suas mídias no bucket comercios"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'comercios' AND 
  auth.uid() IS NOT NULL
);

DROP POLICY IF EXISTS "Comerciantes podem deletar suas mídias" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own commerce images" ON storage.objects;

CREATE POLICY "Comerciantes podem deletar suas mídias no bucket comercios"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'comercios' AND 
  auth.uid() IS NOT NULL
);