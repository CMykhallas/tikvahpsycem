
-- Create leads table with proper security
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  campaign_id TEXT,
  ad_group_id TEXT,
  keyword TEXT,
  source TEXT DEFAULT 'google_ads',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies for leads access (assuming authenticated users can access leads)
CREATE POLICY "Authenticated users can view leads" 
  ON public.leads 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leads" 
  ON public.leads 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads" 
  ON public.leads 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create webhook logs table for monitoring
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  headers JSONB,
  payload JSONB,
  response_status INTEGER,
  processing_time_ms INTEGER,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for webhook logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view webhook logs
CREATE POLICY "Authenticated users can view webhook logs" 
  ON public.webhook_logs 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow webhook endpoint to insert logs (will be handled by edge function)
CREATE POLICY "System can insert webhook logs" 
  ON public.webhook_logs 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create function to update leads updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_leads_updated_at_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_leads_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at);
CREATE INDEX idx_webhook_logs_endpoint ON public.webhook_logs(endpoint);
