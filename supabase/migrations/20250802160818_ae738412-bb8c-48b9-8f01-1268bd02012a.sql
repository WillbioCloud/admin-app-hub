-- Adicionar colunas de localização e imagem para comercios
ALTER TABLE public.comercios 
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision,
ADD COLUMN image_url text;