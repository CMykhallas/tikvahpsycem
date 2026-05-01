
CREATE TABLE IF NOT EXISTS public.proposal_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.service_proposals(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN ('recebida','notificada','em_analise','contactada','aprovada','rejeitada','arquivada','nota')),
  notes TEXT,
  actor TEXT NOT NULL DEFAULT 'system',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposal_audit_proposal ON public.proposal_audit_trail(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_audit_event ON public.proposal_audit_trail(event);
CREATE INDEX IF NOT EXISTS idx_proposal_audit_created ON public.proposal_audit_trail(created_at DESC);

ALTER TABLE public.proposal_audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view audit trail"
  ON public.proposal_audit_trail
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Service role manages audit trail"
  ON public.proposal_audit_trail
  AS PERMISSIVE FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.log_proposal_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.proposal_audit_trail (proposal_id, event, actor, metadata)
  VALUES (
    NEW.id,
    'recebida',
    'system',
    jsonb_build_object(
      'protocol', COALESCE(NEW.metadata->>'protocol', NULL),
      'service_slug', NEW.service_slug,
      'area_code', NEW.area_code
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proposal_received ON public.service_proposals;
CREATE TRIGGER trg_proposal_received
AFTER INSERT ON public.service_proposals
FOR EACH ROW EXECUTE FUNCTION public.log_proposal_received();

CREATE OR REPLACE FUNCTION public.log_proposal_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  ev TEXT;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    ev := CASE NEW.status
      WHEN 'in_review' THEN 'em_analise'
      WHEN 'contacted' THEN 'contactada'
      WHEN 'approved' THEN 'aprovada'
      WHEN 'rejected' THEN 'rejeitada'
      WHEN 'archived' THEN 'arquivada'
      ELSE 'nota'
    END;
    INSERT INTO public.proposal_audit_trail (proposal_id, event, actor, notes, metadata)
    VALUES (
      NEW.id, ev, 'staff', 'Status alterado de ' || OLD.status || ' para ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_proposal_status_change ON public.service_proposals;
CREATE TRIGGER trg_proposal_status_change
AFTER UPDATE OF status ON public.service_proposals
FOR EACH ROW EXECUTE FUNCTION public.log_proposal_status_change();
