-- Fix search_path issue in has_role function
-- This ensures the function can properly access the public schema
ALTER FUNCTION public.has_role(_role text) SET search_path TO 'public';
