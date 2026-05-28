
REVOKE EXECUTE ON FUNCTION public.log_proposal_received() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_proposal_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_security_alert() FROM PUBLIC, anon, authenticated;
