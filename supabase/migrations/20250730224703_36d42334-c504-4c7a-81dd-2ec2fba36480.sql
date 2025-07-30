
-- Create the get_admin_user_role function that's needed for the admin system
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
