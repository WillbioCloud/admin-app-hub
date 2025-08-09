-- Add RLS policy to allow admin users to update points of interest
CREATE POLICY "Admin users can update points of interest" ON public.points_of_interest
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );