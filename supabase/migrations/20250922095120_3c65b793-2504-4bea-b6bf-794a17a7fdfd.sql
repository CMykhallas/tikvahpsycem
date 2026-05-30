-- Fix critical security issue: Restrict access to notes table

-- Drop the overly permissive policy that allows public read access
DROP POLICY IF EXISTS "public can read countries" ON public.notes;

-- Create restrictive policies for notes table
-- Allow admins to manage all operations on notes
CREATE POLICY "Admins can manage notes"
ON public.notes
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to read notes (if this is reference data)
-- Remove this policy if notes should be completely private to admins only
CREATE POLICY "Authenticated users can read notes"
ON public.notes
FOR SELECT
TO authenticated
USING (true);

-- Prevent all public/anonymous access by ensuring RLS is enabled
-- (RLS should already be enabled, but this ensures it)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;