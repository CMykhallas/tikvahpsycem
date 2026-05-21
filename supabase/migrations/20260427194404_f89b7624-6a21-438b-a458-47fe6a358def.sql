-- 1) Remove sensitive tables from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.webhook_logs;
ALTER PUBLICATION supabase_realtime DROP TABLE public.security_incidents;
ALTER PUBLICATION supabase_realtime DROP TABLE public.ip_blacklist;

-- 2) Tighten candidaturas bucket upload policy: require UUID-scoped path
DROP POLICY IF EXISTS "Anyone can upload application documents" ON storage.objects;

CREATE POLICY "Public can upload scoped application documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'candidaturas'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);

-- 3) Admin-only update / delete on candidaturas bucket
CREATE POLICY "Admins can update application documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'candidaturas'
  AND public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'candidaturas'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete application documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'candidaturas'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);