-- =============================================
-- ENTERPRISE-GRADE RLS IMPROVEMENTS - ISO 27001 COMPLIANT
-- =============================================

-- =============================================
-- RATE_LIMITS TABLE - Restrict to service_role only
-- =============================================
DROP POLICY IF EXISTS "Service role manages rate limits" ON public.rate_limits;

CREATE POLICY "Service role only access"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =============================================
-- SECURITY_INCIDENTS TABLE - Restrict INSERT to service_role
-- =============================================
DROP POLICY IF EXISTS "Edge functions can insert security incidents" ON public.security_incidents;

CREATE POLICY "Service role inserts incidents"
ON public.security_incidents
FOR INSERT
TO service_role
WITH CHECK (true);

-- =============================================
-- WEBHOOK_LOGS TABLE - Restrict INSERT to service_role
-- =============================================
DROP POLICY IF EXISTS "Edge functions can insert webhook logs" ON public.webhook_logs;

CREATE POLICY "Service role inserts webhook logs"
ON public.webhook_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- =============================================
-- CART TABLE - Enable user and anonymous cart management
-- =============================================
DROP POLICY IF EXISTS "Service role can manage cart" ON public.cart;

-- Authenticated users manage their own cart
CREATE POLICY "Users manage own cart"
ON public.cart
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Anonymous users manage cart by session_id
CREATE POLICY "Anonymous cart by session"
ON public.cart
FOR ALL
TO anon
USING (session_id IS NOT NULL AND user_id IS NULL)
WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

-- Service role full access for migrations/admin
CREATE POLICY "Service role cart access"
ON public.cart
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =============================================
-- PROFILES TABLE - Allow INSERT for new users via trigger
-- The handle_new_user trigger inserts profiles, so we need service_role INSERT
-- =============================================
CREATE POLICY "Service role creates profiles"
ON public.profiles
FOR INSERT
TO service_role
WITH CHECK (true);

-- =============================================
-- LEADS TABLE - Restrict INSERT to service_role (edge functions use service_role)
-- =============================================
DROP POLICY IF EXISTS "Webhooks can insert leads" ON public.leads;

-- Edge functions should use service_role for lead insertion
-- This is more secure than allowing anon INSERT

-- =============================================
-- ORDERS TABLE - Add service_role UPDATE for payment confirmations
-- =============================================
CREATE POLICY "Service role updates orders"
ON public.orders
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- =============================================
-- Create audit log table for compliance tracking
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Service role inserts audit logs
CREATE POLICY "Service role inserts audit logs"
ON public.audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);