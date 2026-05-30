-- =====================================================
-- FASE 1: Consolidar políticas de ORDERS (remover duplicatas)
-- =====================================================

-- Remover políticas SELECT redundantes da tabela orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Anonymous users can view orders with valid token" ON public.orders;
DROP POLICY IF EXISTS "Secure order access" ON public.orders;
DROP POLICY IF EXISTS "Token-based guest order access" ON public.orders;

-- Criar política SELECT unificada para orders
CREATE POLICY "Unified order access" ON public.orders 
FOR SELECT USING (
  (auth.uid() = user_id) OR 
  (has_role(auth.uid(), 'admin'::app_role)) OR 
  (has_role(auth.uid(), 'staff'::app_role)) OR
  (order_access_token IS NOT NULL AND token_expires_at > now())
);

-- =====================================================
-- FASE 2: Corrigir política de RATE_LIMITS
-- =====================================================

-- Remover política muito permissiva
DROP POLICY IF EXISTS "Edge functions can manage rate limits" ON public.rate_limits;

-- Criar política restrita para service_role (edge functions)
CREATE POLICY "Service role manages rate limits" ON public.rate_limits 
FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- FASE 3: Adicionar UPDATE/DELETE para SECURITY_INCIDENTS
-- =====================================================

CREATE POLICY "Admins can update security incidents" ON public.security_incidents
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete security incidents" ON public.security_incidents
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- FASE 4: Adicionar UPDATE/DELETE para WEBHOOK_LOGS
-- =====================================================

CREATE POLICY "Admins can update webhook logs" ON public.webhook_logs
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins can delete webhook logs" ON public.webhook_logs
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));