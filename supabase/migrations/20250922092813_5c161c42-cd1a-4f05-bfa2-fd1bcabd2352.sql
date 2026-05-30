-- Fix critical security issue: Enable RLS and create policies for unprotected tables

-- Enable Row Level Security on relatorio_temp table
ALTER TABLE public.relatorio_temp ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on usuarios table  
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for relatorio_temp (business metrics - admin only)
CREATE POLICY "Only admins can view relatorio_temp"
ON public.relatorio_temp
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert relatorio_temp"
ON public.relatorio_temp  
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update relatorio_temp"
ON public.relatorio_temp
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete relatorio_temp"
ON public.relatorio_temp
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create secure policies for usuarios table (legacy user data - admin management)
CREATE POLICY "Only admins can view usuarios"
ON public.usuarios
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage usuarios"
ON public.usuarios
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));