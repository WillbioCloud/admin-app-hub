-- Create storage policies for app-media bucket to allow admin uploads
-- First, create the bucket if it doesn't exist (it should already exist)
INSERT INTO storage.buckets (id, name, public) VALUES ('app-media', 'app-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload to app-media bucket
CREATE POLICY "Allow admin uploads to app-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'app-media' AND
  (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND user_type = 'admin'))
);

-- Allow admins to update files in app-media bucket
CREATE POLICY "Allow admin updates to app-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'app-media' AND
  (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND user_type = 'admin'))
);

-- Allow admins to delete files in app-media bucket
CREATE POLICY "Allow admin deletes from app-media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'app-media' AND
  (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND user_type = 'admin'))
);

-- Allow public access to view files in app-media bucket
CREATE POLICY "Allow public access to app-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'app-media');