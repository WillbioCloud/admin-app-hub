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

-- Add function to generate reward codes automatically
CREATE OR REPLACE FUNCTION public.generate_reward_codes(reward_id_param UUID, stock_amount INTEGER)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
  new_code TEXT;
BEGIN
  FOR i IN 1..stock_amount LOOP
    new_code := UPPER(SUBSTRING(MD5(reward_id_param::text || i || now()::text) FROM 1 FOR 8));
    codes := array_append(codes, new_code);
  END LOOP;
  
  RETURN codes;
END;
$$;