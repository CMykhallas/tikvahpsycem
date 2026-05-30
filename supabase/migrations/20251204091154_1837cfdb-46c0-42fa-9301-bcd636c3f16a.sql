-- =====================================================
-- FIX: Remove insecure session-based cart policies
-- Cart uses localStorage (Zustand), so restrict DB cart to service_role only
-- =====================================================

-- Drop all existing session-based policies
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can insert into their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.cart;
DROP POLICY IF EXISTS "Users can delete from their own cart" ON public.cart;

-- Keep only the service_role policy (already exists from previous migration)
-- This ensures only edge functions with service_role key can manage cart
-- The application uses localStorage for cart (useCart.ts with 'tikvah-cart' key)