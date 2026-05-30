
-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY CASE role
    WHEN 'admin' THEN 1
    WHEN 'staff' THEN 2
    WHEN 'user' THEN 3
  END
  LIMIT 1
$$;

-- Drop existing overly permissive policies on leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;

-- Create secure RLS policies for leads (admin/staff only)
CREATE POLICY "Admin and staff can view leads" 
  ON public.leads 
  FOR SELECT 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admin and staff can insert leads" 
  ON public.leads 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admin and staff can update leads" 
  ON public.leads 
  FOR UPDATE 
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'staff')
  );

CREATE POLICY "Admin can delete leads" 
  ON public.leads 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Update webhook_logs policies to be admin-only
DROP POLICY IF EXISTS "Authenticated users can view webhook logs" ON public.webhook_logs;

CREATE POLICY "Admin can view webhook logs" 
  ON public.webhook_logs 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policy for user_roles (users can only see their own roles, admins can see all)
CREATE POLICY "Users can view own roles, admins can view all" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admin can manage all user roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile, admins can view all" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin can manage all profiles" 
  ON public.profiles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  
  -- Give new users the 'user' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and assign role on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
