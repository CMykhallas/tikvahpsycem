-- Tabela de pedidos de proposta
CREATE TABLE IF NOT EXISTS public.service_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug TEXT NOT NULL,
  service_title TEXT NOT NULL,
  area_code TEXT,
  area_name TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  modality TEXT NOT NULL,
  audience TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_proposals_slug ON public.service_proposals(service_slug);
CREATE INDEX IF NOT EXISTS idx_service_proposals_status ON public.service_proposals(status);
CREATE INDEX IF NOT EXISTS idx_service_proposals_created ON public.service_proposals(created_at DESC);

ALTER TABLE public.service_proposals ENABLE ROW LEVEL SECURITY;

-- Trigger updated_at
CREATE TRIGGER update_service_proposals_updated_at
BEFORE UPDATE ON public.service_proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public submit with strict validation
CREATE POLICY "Public can submit proposals"
ON public.service_proposals
AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) BETWEEN 2 AND 150
  AND length(btrim(email)) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 6 AND 30
  AND length(btrim(service_slug)) BETWEEN 1 AND 200
  AND length(btrim(service_title)) BETWEEN 1 AND 250
  AND modality = ANY (ARRAY['Presencial','Online','Híbrido','Indiferente'])
  AND audience = ANY (ARRAY['PME','ONG','Estudantes','Público','Profissional Liberal','Outro'])
  AND (message IS NULL OR length(message) <= 5000)
  AND status = 'pending'
);

-- Staff/Admin view
CREATE POLICY "Staff view proposals"
ON public.service_proposals
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Staff update
CREATE POLICY "Staff update proposals"
ON public.service_proposals
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Admin delete
CREATE POLICY "Admin delete proposals"
ON public.service_proposals
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role full access
CREATE POLICY "Service role manages proposals"
ON public.service_proposals
AS PERMISSIVE
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');