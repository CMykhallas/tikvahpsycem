-- Fix contacts table security - Add RLS policy for admin and staff access

-- Allow admin and staff to view contact submissions for customer service
CREATE POLICY "Admin and staff can view contacts" 
ON public.contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Allow admin and staff to update contact status for management
CREATE POLICY "Admin and staff can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);