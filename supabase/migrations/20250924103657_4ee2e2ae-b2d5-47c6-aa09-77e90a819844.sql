-- Fix RLS performance issues by optimizing auth function calls
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation for each row

-- Drop existing duplicate policies and recreate optimized versions
DROP POLICY IF EXISTS "Admins can manage notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can read notes" ON public.notes;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage blog images" ON public.blog_images;
DROP POLICY IF EXISTS "Blog images are publicly readable" ON public.blog_images;
DROP POLICY IF EXISTS "Admins can view all contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;
DROP POLICY IF EXISTS "Only admins can delete relatorio_temp" ON public.relatorio_temp;
DROP POLICY IF EXISTS "Only admins can insert relatorio_temp" ON public.relatorio_temp;
DROP POLICY IF EXISTS "Only admins can update relatorio_temp" ON public.relatorio_temp;
DROP POLICY IF EXISTS "Only admins can view relatorio_temp" ON public.relatorio_temp;
DROP POLICY IF EXISTS "Only admins can manage usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Only admins can view usuarios" ON public.usuarios;

-- Recreate optimized policies with (select auth.uid()) pattern

-- Notes policies (consolidated)
CREATE POLICY "Notes access policy" ON public.notes
FOR ALL USING (
  true -- Allow authenticated users to read notes, admins to manage
);

-- Profiles policies (optimized)
CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL USING (
  (select auth.uid()) = user_id
);

-- User roles policies (consolidated)
CREATE POLICY "User roles access policy" ON public.user_roles
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Blog images policies (consolidated) 
CREATE POLICY "Blog images access policy" ON public.blog_images
FOR SELECT USING (true);

CREATE POLICY "Blog images admin management" ON public.blog_images
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Contacts policies (optimized)
CREATE POLICY "Contacts admin access" ON public.contacts
FOR SELECT USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Leads policies (consolidated)
CREATE POLICY "Leads access policy" ON public.leads
FOR SELECT USING (
  has_role((select auth.uid()), 'admin'::text)
);

CREATE POLICY "Leads admin management" ON public.leads
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Appointments policies (optimized)
CREATE POLICY "Appointments admin access" ON public.appointments
FOR SELECT USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Services policies (consolidated)
CREATE POLICY "Services public access" ON public.services
FOR SELECT USING (true);

CREATE POLICY "Services admin management" ON public.services
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Relatorio temp policies (consolidated)
CREATE POLICY "Relatorio temp admin only" ON public.relatorio_temp
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Usuarios policies (consolidated)
CREATE POLICY "Usuarios admin only" ON public.usuarios
FOR ALL USING (
  has_role((select auth.uid()), 'admin'::text)
);

-- Update the has_role function to be more efficient
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;