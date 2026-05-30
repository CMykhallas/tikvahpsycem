-- Fix appointments table security - Add RLS policies for admin and staff access

-- Allow admin and staff to view appointments for business operations
CREATE POLICY "Admin and staff can view appointments" 
ON public.appointments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Allow admin and staff to update appointment status and manage bookings
CREATE POLICY "Admin and staff can update appointments" 
ON public.appointments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'staff')
  )
);

-- Allow admin to delete appointments if necessary
CREATE POLICY "Admin can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);