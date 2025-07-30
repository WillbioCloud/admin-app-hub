
-- First, drop the function if it exists to avoid conflicts
DROP FUNCTION IF EXISTS public.get_admin_user_role();

-- Drop the type if it exists to recreate it properly
DROP TYPE IF EXISTS public.admin_user_role CASCADE;

-- Create the admin_user_role enum type
CREATE TYPE public.admin_user_role AS ENUM ('admin', 'comerciante');

-- Now recreate the get_admin_user_role function with the correct type
CREATE OR REPLACE FUNCTION public.get_admin_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT COALESCE(user_type::text, 'comerciante')
  FROM public.admin_profiles
  WHERE id = auth.uid();
$function$;

-- Ensure the admin_profiles table uses the correct type
ALTER TABLE public.admin_profiles 
ALTER COLUMN user_type TYPE admin_user_role USING user_type::text::admin_user_role;

-- Set the default value
ALTER TABLE public.admin_profiles 
ALTER COLUMN user_type SET DEFAULT 'comerciante'::admin_user_role;
