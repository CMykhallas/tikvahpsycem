-- Add SELECT policies for sensitive tables to prevent unauthorized data access

-- 1. CONTACTS TABLE: Only admins and staff can view contact submissions
CREATE POLICY "Admins and staff can view contacts"
ON public.contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'staff')
  )
);

-- 2. APPOINTMENTS TABLE: Only admins and staff can view appointments
CREATE POLICY "Admins and staff can view appointments"
ON public.appointments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'staff')
  )
);

-- 3. LEADS TABLE: Only admins and staff can view leads
CREATE POLICY "Admins and staff can view leads"
ON public.leads
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'staff')
  )
);

-- 4. PROFILES TABLE: Users can only view their own profile, admins can view all
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 5. ORDERS TABLE: Strengthen existing policy - users see own orders, staff/admin see all
-- First check if there's an existing SELECT policy and drop it if needed
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view own orders or staff can view all"
ON public.orders
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'staff')
  )
);