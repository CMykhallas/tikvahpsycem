
-- Create blog_images table for storing blog illustrations
CREATE TABLE public.blog_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contacts table for form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create appointments table for scheduling
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date TIMESTAMPTZ NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create services table for checkout system
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MZN',
  duration_minutes INTEGER,
  category TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for payment tracking
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MZN',
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_images (public read)
CREATE POLICY "Anyone can view blog images" ON public.blog_images FOR SELECT USING (true);

-- Create RLS policies for contacts (public insert, admin view)
CREATE POLICY "Anyone can submit contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Create RLS policies for appointments (public insert, admin view)
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);

-- Create RLS policies for services (public read)
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (active = true);

-- Create RLS policies for orders (users can view their own)
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample services
INSERT INTO public.services (name, description, price, duration_minutes, category) VALUES
('Consulta Psicológica Individual', 'Sessão de psicoterapia individual com psicólogo clínico especializado', 2500.00, 60, 'Psicoterapia'),
('Terapia de Casal', 'Sessão de terapia para casais com foco em comunicação e resolução de conflitos', 3500.00, 90, 'Psicoterapia'),
('Avaliação Psicológica Completa', 'Avaliação psicológica completa incluindo testes e relatório', 8500.00, 180, 'Avaliação'),
('Workshop Mindfulness', 'Workshop de mindfulness e técnicas de relaxamento em grupo', 1500.00, 120, 'Workshop'),
('Consultoria Organizacional', 'Consultoria em psicologia organizacional para empresas', 15000.00, 240, 'Consultoria');

-- Insert sample blog images
INSERT INTO public.blog_images (blog_slug, image_url, alt_text, position) VALUES
('mbsr-meta-analise', '/placeholder.svg', 'Pessoa meditando em ambiente natural africano com baobás ao fundo', 1),
('trauma-cultural-resiliencia', '/placeholder.svg', 'Comunidade africana em círculo tradicional de cura', 1),
('act-terapia-contextos', '/placeholder.svg', 'Terapeuta africano em sessão com cliente em ambiente cultural', 1),
('psicologia-organizacional', '/placeholder.svg', 'Equipe diversificada em ambiente corporativo moderno em Maputo', 1);
