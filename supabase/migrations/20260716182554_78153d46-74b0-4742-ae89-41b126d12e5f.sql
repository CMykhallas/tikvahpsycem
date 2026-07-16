
-- Admin audit trail for actions on the security incidents panel
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_logs_user ON public.admin_audit_logs(user_id);
CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_logs_action ON public.admin_audit_logs(action);

GRANT SELECT, INSERT ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_audit_logs TO service_role;

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins may insert, and only rows attributed to themselves
CREATE POLICY "Admins insert own audit rows"
  ON public.admin_audit_logs
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    AND user_id = auth.uid()
  );

-- Only admins may read the trail
CREATE POLICY "Admins read audit trail"
  ON public.admin_audit_logs
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Explicitly block updates/deletes: append-only trail
CREATE POLICY "No updates to admin audit"
  ON public.admin_audit_logs
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No deletes from admin audit"
  ON public.admin_audit_logs
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (false);
