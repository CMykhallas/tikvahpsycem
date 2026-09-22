import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthorizationDetails = {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

const oauthApi = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Pedido inválido: falta o identificador de autorização.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = `/auth?next=${encodeURIComponent(next)}`;
        return;
      }
      const { data, error: detailsError } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const api = oauthApi();
    const { data, error: decisionError } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não devolveu um destino de redireccionamento.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "a aplicação";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        {error ? (
          <>
            <CardHeader>
              <CardTitle>Não foi possível processar o pedido</CardTitle>
              <CardDescription role="alert">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </>
        ) : !details ? (
          <CardHeader>
            <CardTitle>A carregar…</CardTitle>
            <CardDescription aria-live="polite">A validar o pedido de autorização.</CardDescription>
          </CardHeader>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Ligar {clientName} à sua conta</CardTitle>
              <CardDescription>
                Isto permite que {clientName} utilize a Tikvah Psycem em seu nome, com as mesmas
                permissões da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button disabled={busy} onClick={() => decide(true)}>
                Aprovar
              </Button>
              <Button variant="outline" disabled={busy} onClick={() => decide(false)}>
                Recusar
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
