
-- Let's start clean and ensure the type is created properly
DO $$ 
BEGIN
    -- Check if the type exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_user_role') THEN
        CREATE TYPE public.admin_user_role AS ENUM ('admin', 'comerciante');
    END IF;
END $$;

-- Ensure the get_admin_user_role function works correctly
CREATE OR REPLACE FUNCTION public.get_admin_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(user_type::text, 'comerciante')
  FROM public.admin_profiles
  WHERE id = auth.uid();
$$;

-- Make sure the admin_profiles table is using the correct type
DO $$
BEGIN
    -- Only alter if the column exists and isn't already the right type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_profiles' 
        AND column_name = 'user_type'
        AND table_schema = 'public'
    ) THEN
        -- Ensure the column uses the enum type
        ALTER TABLE public.admin_profiles 
        ALTER COLUMN user_type TYPE admin_user_role 
        USING user_type::text::admin_user_role;
        
        -- Set default value
        ALTER TABLE public.admin_profiles 
        ALTER COLUMN user_type SET DEFAULT 'comerciante'::admin_user_role;
    END IF;
END $$;
