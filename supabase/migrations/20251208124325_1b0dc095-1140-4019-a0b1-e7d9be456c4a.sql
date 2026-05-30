-- Fix 1: Replace overly permissive IP blacklist policy with service_role restriction
DROP POLICY IF EXISTS "Edge functions can manage blacklist" ON ip_blacklist;

CREATE POLICY "Service role manages blacklist"
ON ip_blacklist FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix 2: Add UPDATE policy for orders table so admin/staff can update order status
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));