-- Extend services table for executive catalog (12 areas)
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS area_code text,
  ADD COLUMN IF NOT EXISTS area_name text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS price_from numeric,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'MZN',
  ADD COLUMN IF NOT EXISTS duration_label text,
  ADD COLUMN IF NOT EXISTS modalities text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS benefits text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- Unique slug for routing
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique ON public.services(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS services_area_code_idx ON public.services(area_code);
CREATE INDEX IF NOT EXISTS services_active_sort_idx ON public.services(active, sort_order);

-- Tighten public SELECT policy to active services only
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
CREATE POLICY "Anyone can view active services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- updated_at trigger (idempotent)
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();