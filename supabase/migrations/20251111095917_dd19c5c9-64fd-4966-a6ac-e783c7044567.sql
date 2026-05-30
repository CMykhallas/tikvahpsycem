-- Enable realtime for security tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ip_blacklist;

-- Add helpful comment
COMMENT ON TABLE public.security_incidents IS 'Security incidents log with realtime updates enabled for dashboard';
COMMENT ON TABLE public.ip_blacklist IS 'Blocked IPs with realtime updates enabled for dashboard';
