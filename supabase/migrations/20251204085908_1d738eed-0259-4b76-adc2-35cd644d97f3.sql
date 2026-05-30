-- =====================================================
-- FIX: Secure anonymous order access with proper token validation
-- =====================================================

-- Drop the current overly permissive unified policy
DROP POLICY IF EXISTS "Unified order access" ON public.orders;

-- Create secure policy for authenticated users only (no token access via RLS)
CREATE POLICY "Authenticated order access" ON public.orders 
FOR SELECT USING (
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (has_role(auth.uid(), 'staff'::app_role))
);

-- Create security definer function for anonymous token-based access
-- This function validates the token server-side and only returns matching order
CREATE OR REPLACE FUNCTION public.get_order_by_token(p_order_id uuid, p_token text)
RETURNS TABLE (
  id uuid,
  amount integer,
  status text,
  payment_method text,
  created_at timestamptz,
  metadata jsonb,
  products jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.id,
    o.amount,
    o.status,
    o.payment_method,
    o.created_at,
    o.metadata,
    o.products
  FROM public.orders o
  WHERE o.id = p_order_id 
    AND o.order_access_token = p_token 
    AND o.token_expires_at > now();
$$;