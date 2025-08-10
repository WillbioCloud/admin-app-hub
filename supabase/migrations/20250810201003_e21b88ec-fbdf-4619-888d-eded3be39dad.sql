-- Add location fields to comercios table for editing
ALTER TABLE public.comercios 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add reward code tracking for stock management
ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS reward_codes TEXT[] DEFAULT '{}';

-- Create table for tracking reward code usage
CREATE TABLE IF NOT EXISTS public.reward_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(code)
);

-- Enable RLS on the new table
ALTER TABLE public.reward_code_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for reward code usage
CREATE POLICY "Admins and merchants can manage reward codes" 
ON public.reward_code_usage
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid() AND user_type IN ('admin', 'comerciante')
  )
);

-- Add mission relationship enforcement to rewards table
-- First, remove the nullable constraint and make mission_id_unlock required
ALTER TABLE public.rewards 
ALTER COLUMN mission_id_unlock SET NOT NULL;