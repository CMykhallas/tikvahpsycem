-- =====================================================
-- FIX: Allow anonymous users to submit contact forms
-- The INSERT policy was RESTRICTIVE, blocking all anonymous inserts
-- =====================================================

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Edge functions can insert contacts" ON public.contacts;

-- Create a PERMISSIVE policy for anonymous contact form submissions
CREATE POLICY "Anyone can submit contact form"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also fix appointments table (same issue)
DROP POLICY IF EXISTS "Edge functions can insert appointments" ON public.appointments;

CREATE POLICY "Anyone can submit appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);