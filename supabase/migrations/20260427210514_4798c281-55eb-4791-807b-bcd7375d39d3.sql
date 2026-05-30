
-- 1) applications: replace "always true" INSERT with validated check
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

CREATE POLICY "Public can submit applications"
ON public.applications FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) BETWEEN 2 AND 150
  AND length(btrim(email)) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(area)) BETWEEN 2 AND 100
  AND length(btrim(education_level)) BETWEEN 2 AND 100
  AND length(btrim(phone)) BETWEEN 6 AND 30
  AND status = 'pending'
);

-- 2) contacts: replace "always true" INSERT with validated check
DROP POLICY IF EXISTS "Public can submit contact form" ON public.contacts;

CREATE POLICY "Public can submit contacts"
ON public.contacts FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 2 AND 150
  AND length(btrim(email)) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(subject)) BETWEEN 2 AND 200
  AND length(btrim(message)) BETWEEN 5 AND 5000
  AND status = 'new'
);

-- 3) SECURITY DEFINER hardening
-- Revoke anon execution of has_role — only authenticated/service_role need it
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- get_order_by_token stays executable by anon (guest order tracking by token+id)
-- Already safe: returns only rows matching token AND not expired
-- Explicitly reaffirm grants and revoke from generic PUBLIC
REVOKE EXECUTE ON FUNCTION public.get_order_by_token(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_order_by_token(uuid, text) TO anon, authenticated, service_role;
