-- Create bucket for map images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('map-images', 'map-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for map-images bucket
CREATE POLICY "Public read access for map-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'map-images');

CREATE POLICY "Authenticated users can upload map-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'map-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their map-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'map-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their map-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'map-images' AND auth.uid() IS NOT NULL);