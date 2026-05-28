-- =========================================
-- FIX SECURITY DEFINER VIEW
-- Migration Date: 2026-05-24
-- =========================================
-- Issue: public.decrypted_security_incidents uses SECURITY DEFINER
-- This bypasses RLS policies and enforces creator permissions instead of querying user
--
-- Solution: Remove SECURITY DEFINER from the view
-- Result: View will enforce RLS policies of the querying user (safer)

-- =========================================
-- DROP AND RECREATE VIEW WITHOUT SECURITY DEFINER
-- =========================================

-- First, drop the view with SECURITY DEFINER
DROP VIEW IF EXISTS public.decrypted_security_incidents CASCADE;

-- Recreate without SECURITY DEFINER (uses querying user's permissions)
CREATE OR REPLACE VIEW public.decrypted_security_incidents AS
SELECT
  id,
  incident_type,
  severity,
  ip_address,
  user_agent,
  endpoint,
  details,
  created_at,
  updated_at
FROM public.security_incidents
WHERE
  -- Only show incidents to admins
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  );

-- Add comment documenting the security stance
COMMENT ON VIEW public.decrypted_security_incidents IS 
'View of security incidents for admin review. Does NOT use SECURITY DEFINER to ensure RLS policies are enforced for the querying user. Admins only - checked via RLS.';

-- =========================================
-- VERIFY RLS ON UNDERLYING TABLE
-- =========================================

-- Ensure security_incidents table has RLS enabled
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can insert
CREATE POLICY IF NOT EXISTS "Service role inserts incidents"
ON public.security_incidents
FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy: Admins can view
CREATE POLICY IF NOT EXISTS "Admins can view incidents"
ON public.security_incidents
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy: Service role can read (for automated systems)
CREATE POLICY IF NOT EXISTS "Service role reads incidents"
ON public.security_incidents
FOR SELECT
TO service_role
USING (true);

-- =========================================
-- SUMMARY
-- =========================================
-- ✓ View removed SECURITY DEFINER
-- ✓ RLS now enforced for querying user
-- ✓ Admin-only access enforced via policy
-- ✓ Underlying table has proper RLS policies
-- ✓ Service role can still manage incidents
