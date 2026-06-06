import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** When true, requires the authenticated user to have the `admin` role. */
  requireAdmin?: boolean;
}

/**
 * Route guard for the Tikvah app.
 * - Redirects unauthenticated users to `/auth` preserving the original target in location state.
 * - When `requireAdmin` is set, redirects authenticated non-admins to `/` to avoid privilege escalation.
 */
export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-dvh flex items-center justify-center bg-slate-50"
      >
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" aria-hidden="true" />
        <span className="sr-only">A verificar a sessão…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
