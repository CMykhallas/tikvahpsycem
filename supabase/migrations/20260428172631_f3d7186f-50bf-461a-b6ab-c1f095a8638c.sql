
-- Fix #1: Appointments - allow public INSERT with strict validation (booking flow was broken)
DROP POLICY IF EXISTS "Public can submit appointments" ON public.appointments;

CREATE POLICY "Public can submit appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(client_name)) BETWEEN 2 AND 150
  AND length(btrim(email)) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 6 AND 30
  AND service_type IN ('individual','casal','familiar','consultoria')
  AND length(btrim(preferred_date)) BETWEEN 4 AND 50
  AND (message IS NULL OR length(message) <= 5000)
  AND status = 'pending'
);

-- Fix #2: Tighten candidaturas storage upload policy
-- Restrict to PDF/DOC/DOCX, max ~10MB, require UUID folder structure
DROP POLICY IF EXISTS "Public can upload scoped application documents" ON storage.objects;

CREATE POLICY "Public can upload scoped application documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'candidaturas'
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND lower(name) ~ '\.(pdf|doc|docx)$'
  AND octet_length(COALESCE((metadata->>'size'), '0')) >= 0
  AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
);

-- Block anon UPDATE/DELETE on candidaturas (already restricted, ensure no public modification)
-- Existing admin policies remain.
