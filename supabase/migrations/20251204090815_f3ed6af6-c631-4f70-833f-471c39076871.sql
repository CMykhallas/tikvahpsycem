-- =====================================================
-- FIX: Restrict cart edge function policy to service_role only
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Edge functions can manage cart" ON public.cart;

-- Create restricted policy for service_role only
-- This ensures only backend edge functions with service_role key can manage cart
CREATE POLICY "Service role can manage cart" ON public.cart
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');