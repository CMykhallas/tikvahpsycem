/**
 * Admin audit trail helper.
 * Inserts append-only rows into `public.admin_audit_logs` for actions on admin panels.
 * RLS enforces: only admins may insert, and only rows attributed to themselves.
 * Failures are swallowed & logged to console — auditing must never break the admin UX.
 */
import { supabase } from "@/integrations/supabase/client";

export type AdminAuditAction =
  | "view_filters_applied"
  | "export_csv"
  | "copy_request_id"
  | "page_view"
  | "pagination_change";

export interface AdminAuditPayload {
  action: AdminAuditAction;
  resource: string;
  metadata?: Record<string, unknown>;
}

export const logAdminAction = async ({ action, resource, metadata = {} }: AdminAuditPayload): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return;
    const { error } = await supabase.from("admin_audit_logs").insert({
      user_id: uid,
      action,
      resource,
      metadata,
    });
    if (error) console.warn("[adminAudit] insert failed", error.message);
  } catch (err) {
    console.warn("[adminAudit] unexpected error", err);
  }
};
