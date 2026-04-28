-- Remove anonymous INSERT on cart table to prevent session_id hijacking.
-- The frontend cart is client-side only (Zustand/localStorage); the cart table
-- is reserved for authenticated users and server-side (service_role) flows.
DROP POLICY IF EXISTS "Anonymous can insert cart items" ON public.cart;