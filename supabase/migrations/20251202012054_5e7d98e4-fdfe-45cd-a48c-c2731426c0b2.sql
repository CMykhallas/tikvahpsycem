-- Add SELECT policies to protect sensitive customer data

-- Protect contacts table - only admins/staff can view contact submissions
CREATE POLICY "Admins and staff can view all contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- Protect leads table - only admins/staff can view marketing leads
CREATE POLICY "Admins and staff can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- Protect appointments table - only admins/staff can view appointment data
CREATE POLICY "Admins and staff can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- Strengthen orders table policy - ensure only authorized users can view orders
-- Drop existing SELECT policy first if it exists
DROP POLICY IF EXISTS "Users can view their own orders and admins can view all" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order with valid token" ON public.orders;

-- Create comprehensive SELECT policy for orders
CREATE POLICY "Secure order access"
ON public.orders
FOR SELECT
TO authenticated
USING (
  -- Users can view their own orders
  user_id = auth.uid() OR
  -- Admins and staff can view all orders
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- Allow token-based access for guest orders (without authentication)
CREATE POLICY "Token-based guest order access"
ON public.orders
FOR SELECT
TO anon
USING (
  order_access_token IS NOT NULL AND
  token_expires_at > NOW()
);