-- =============================================
-- FIX RLS POLICIES: Change from RESTRICTIVE to PERMISSIVE
-- =============================================

-- =============================================
-- CONTACTS TABLE
-- =============================================
DROP POLICY IF EXISTS "Admins and staff can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contacts;

-- PERMISSIVE policies for contacts
CREATE POLICY "Staff can view contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Public can submit contact form"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =============================================
-- APPOINTMENTS TABLE
-- =============================================
DROP POLICY IF EXISTS "Admins and staff can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can submit appointments" ON public.appointments;

-- PERMISSIVE policies for appointments
CREATE POLICY "Staff can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Public can create appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =============================================
-- LEADS TABLE
-- =============================================
DROP POLICY IF EXISTS "Admins and staff can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Edge functions can insert leads" ON public.leads;

-- PERMISSIVE policies for leads
CREATE POLICY "Staff can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Service role inserts leads"
ON public.leads
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also allow anon for webhook submissions
CREATE POLICY "Webhooks can insert leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- =============================================
-- PROFILES TABLE
-- =============================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- PERMISSIVE policies for profiles
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- =============================================
-- ORDERS TABLE
-- =============================================
DROP POLICY IF EXISTS "Authenticated order access" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can insert orders" ON public.orders;

-- PERMISSIVE policies for orders
CREATE POLICY "Users view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin') 
  OR has_role(auth.uid(), 'staff')
);

CREATE POLICY "Staff can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "Service role inserts orders"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow anon for guest checkout via edge functions
CREATE POLICY "Guest checkout creates orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (true);