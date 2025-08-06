-- Criar buckets para uploads da aba de notícias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('news-media', 'news-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/mov', 'video/avi']),
  ('author-avatars', 'author-avatars', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket news-media
CREATE POLICY "Admins podem fazer upload de mídia para notícias"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'news-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar mídia de notícias"
ON storage.objects FOR DELETE 
USING (bucket_id = 'news-media' AND auth.role() = 'authenticated');

CREATE POLICY "Mídia de notícias é publicamente visível"
ON storage.objects FOR SELECT 
USING (bucket_id = 'news-media');

-- Políticas para o bucket author-avatars
CREATE POLICY "Admins podem fazer upload de avatares"
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'author-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Admins podem deletar avatares"
ON storage.objects FOR DELETE 
USING (bucket_id = 'author-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatares são publicamente visíveis"
ON storage.objects FOR SELECT 
USING (bucket_id = 'author-avatars');