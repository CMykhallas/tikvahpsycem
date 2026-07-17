/**
 * Admin panel: browse & filter security_incidents, export CSV for last 7/30 days.
 * Reuses CSV formula-injection guard from useExportReport.
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Download, Filter, RefreshCw } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { logAdminAction } from "@/lib/adminAudit";
import { Link, useSearchParams } from "react-router-dom";

interface Incident {
  id: string;
  created_at: string;
  incident_type: string;
  severity: string;
  ip_address: string;
  endpoint: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
}

const RANGES: Record<string, number> = { "24h": 1, "7d": 7, "30d": 30 };
const PAGE_SIZES = [25, 50, 100] as const;

const guardCsvCell = (v: unknown): string => {
  const s = String(v ?? "");
  const escaped = s.replace(/"/g, '""');
  return /^[=+\-@\t\r]/.test(s) ? `"'${escaped}"` : `"${escaped}"`;
};

const useDebounced = <T,>(value: T, delay = 300): T => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
};

const isRange = (v: string | null): v is "24h" | "7d" | "30d" =>
  v === "24h" || v === "7d" || v === "30d";
const isSeverity = (v: string | null): boolean =>
  v === "low" || v === "medium" || v === "high" || v === "critical";

const SecurityIncidentsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<"24h" | "7d" | "30d">(
    isRange(searchParams.get("range")) ? (searchParams.get("range") as "24h" | "7d" | "30d") : "7d",
  );
  const [ipFilter, setIpFilter] = useState(searchParams.get("ip") ?? "");
  const [reasonFilter, setReasonFilter] = useState(searchParams.get("reason") ?? "");
  const [requestIdFilter, setRequestIdFilter] = useState(searchParams.get("request_id") ?? "");
  const [severity, setSeverity] = useState<string>(
    isSeverity(searchParams.get("severity")) ? (searchParams.get("severity") as string) : "all",
  );
  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<Incident[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reflect current filters into the URL for shareable drill-down links
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("range", range);
    if (severity !== "all") next.set("severity", severity);
    if (ipFilter) next.set("ip", ipFilter);
    if (reasonFilter) next.set("reason", reasonFilter);
    if (requestIdFilter) next.set("request_id", requestIdFilter);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, severity, ipFilter, reasonFilter, requestIdFilter]);

  const debouncedIp = useDebounced(ipFilter);
  const debouncedReason = useDebounced(reasonFilter);
  const debouncedRequest = useDebounced(requestIdFilter);

  const sinceIso = useMemo(
    () => new Date(Date.now() - RANGES[range] * 24 * 60 * 60 * 1000).toISOString(),
    [range],
  );

  const load = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from("security_incidents")
        .select("id,created_at,incident_type,severity,ip_address,endpoint,user_agent,details", { count: "exact" })
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: false });
      if (debouncedIp) q = q.ilike("ip_address", `%${debouncedIp}%`);
      if (debouncedReason) q = q.ilike("incident_type", `%${debouncedReason}%`);
      if (debouncedRequest) q = q.eq("details->>request_id", debouncedRequest);
      if (severity !== "all") q = q.eq("severity", severity);
      q = q.range(page * pageSize, page * pageSize + pageSize - 1);

      const { data, error, count } = await q;
      if (error) throw error;
      setRows((data ?? []) as Incident[]);
      setTotal(count ?? 0);
    } catch (e) {
      toast.error("Erro ao carregar incidentes");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    void logAdminAction({
      action: "view_filters_applied",
      resource: "security_incidents",
      metadata: {
        range,
        severity,
        has_ip_filter: Boolean(debouncedIp),
        has_reason_filter: Boolean(debouncedReason),
        has_request_id_filter: Boolean(debouncedRequest),
        page,
        page_size: pageSize,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinceIso, debouncedIp, debouncedReason, debouncedRequest, severity, pageSize, page]);

  const exportCsv = async (days: 7 | 30) => {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("security_incidents")
      .select("id,created_at,incident_type,severity,ip_address,endpoint,user_agent,details")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10_000);
    if (error) {
      toast.error("Falha ao exportar CSV");
      return;
    }
    const cols = ["id", "created_at", "incident_type", "severity", "ip_address", "endpoint", "user_agent", "reason", "request_id"];
    const header = cols.map(guardCsvCell).join(",");
    const body = (data ?? []).map((r: any) => {
      const details = r.details || {};
      return [
        r.id,
        r.created_at,
        r.incident_type,
        r.severity,
        r.ip_address,
        r.endpoint,
        r.user_agent,
        details.reason,
        details.request_id,
      ].map(guardCsvCell).join(",");
    }).join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-incidents-${days}d-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`CSV de ${days} dias exportado`);
    void logAdminAction({
      action: "export_csv",
      resource: "security_incidents",
      metadata: { days, row_count: data?.length ?? 0 },
    });
  };

  const copyRequestId = async (id: string | undefined) => {
    if (!id) return;
    await navigator.clipboard.writeText(id);
    toast.success("request_id copiado");
    void logAdminAction({
      action: "copy_request_id",
      resource: "security_incidents",
      metadata: { request_id_prefix: id.slice(0, 8) },
    });
  };

  const pages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SEOHead title="Incidentes de Segurança — Admin" description="Painel administrativo de incidentes de segurança" />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" data-testid="admin-incidents-title">Incidentes de Segurança</h1>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link to="/admin/security-analytics" data-testid="link-analytics">Dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCsv(7)} data-testid="export-csv-7">
            <Download className="w-4 h-4 mr-2" />Últimos 7d
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCsv(30)} data-testid="export-csv-30">
            <Download className="w-4 h-4 mr-2" />Últimos 30d
          </Button>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading} data-testid="refresh-btn">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>


      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" /> Filtros
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input placeholder="IP (contém)" value={ipFilter} onChange={(e) => { setIpFilter(e.target.value); setPage(0); }} />
          <Input placeholder="Reason / tipo (contém)" value={reasonFilter} onChange={(e) => { setReasonFilter(e.target.value); setPage(0); }} />
          <Input placeholder="request_id (exato)" value={requestIdFilter} onChange={(e) => { setRequestIdFilter(e.target.value); setPage(0); }} />
          <Select value={severity} onValueChange={(v) => { setSeverity(v); setPage(0); }}>
            <SelectTrigger><SelectValue placeholder="Severidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas severidades</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v: "24h" | "7d" | "30d") => { setRange(v); setPage(0); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Severidade</th>
              <th className="text-left p-3">IP</th>
              <th className="text-left p-3">Endpoint</th>
              <th className="text-left p-3">Reason</th>
              <th className="text-left p-3">request_id</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const reason = (r.details?.["reason"] as string) ?? "";
              const reqId = (r.details?.["request_id"] as string) ?? "";
              return (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("pt-PT")}</td>
                  <td className="p-3">{r.incident_type}</td>
                  <td className="p-3">
                    <Badge variant={r.severity === "critical" ? "destructive" : r.severity === "high" ? "default" : "secondary"}>
                      {r.severity}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-xs">{r.ip_address}</td>
                  <td className="p-3 max-w-[200px] truncate">{r.endpoint}</td>
                  <td className="p-3">{reason}</td>
                  <td className="p-3 font-mono text-xs">
                    {reqId && (
                      <button className="inline-flex items-center gap-1 hover:text-primary" onClick={() => copyRequestId(reqId)}>
                        {reqId.slice(0, 8)}… <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum incidente encontrado</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <div>
          Total: <strong>{total}</strong> · Página {page + 1} de {Math.max(1, pages)}
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}/pág</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(p => p + 1)}>Próxima</Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityIncidentsAdmin;
