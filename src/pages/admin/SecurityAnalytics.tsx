/**
 * Admin analytics dashboard for security incidents.
 * Aggregates by reason and severity across configurable time windows (24h / 7d / 30d).
 * Data source: `security_incidents` (populated by app & consumed by monitor-abuse-spikes).
 * All user-controlled strings (reason, IP) are rendered via JSX text nodes — never HTML.
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { logAdminAction } from "@/lib/adminAudit";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";

type Range = "24h" | "7d" | "30d";
const RANGE_DAYS: Record<Range, number> = { "24h": 1, "7d": 7, "30d": 30 };

interface RawIncident {
  created_at: string;
  incident_type: string;
  severity: string;
  ip_address: string;
  details: Record<string, unknown> | null;
}

interface CountRow { key: string; count: number; }
interface SeverityRow { severity: string; count: number; }
interface TrendRow { bucket: string; count: number; }

const SEVERITY_COLORS: Record<string, string> = {
  low: "hsl(var(--muted-foreground))",
  medium: "hsl(var(--primary))",
  high: "hsl(30 90% 50%)",
  critical: "hsl(var(--destructive))",
};

const SecurityAnalytics = () => {
  const [range, setRange] = useState<Range>("7d");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<RawIncident[]>([]);

  const sinceIso = useMemo(
    () => new Date(Date.now() - RANGE_DAYS[range] * 86_400_000).toISOString(),
    [range],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("security_incidents")
          .select("created_at,incident_type,severity,ip_address,details")
          .gte("created_at", sinceIso)
          .order("created_at", { ascending: false })
          .limit(10_000);
        if (error) throw error;
        if (!cancelled) setRows((data ?? []) as RawIncident[]);
      } catch (err) {
        console.error("[SecurityAnalytics] load failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    void logAdminAction({
      action: "page_view",
      resource: "security_analytics",
      metadata: { range },
    });
    return () => { cancelled = true; };
  }, [sinceIso, range]);

  const byReason = useMemo<CountRow[]>(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const reason = String(r.details?.["reason"] ?? r.incident_type ?? "unknown");
      m.set(reason, (m.get(reason) ?? 0) + 1);
    }
    return Array.from(m, ([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [rows]);

  const bySeverity = useMemo<SeverityRow[]>(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.severity, (m.get(r.severity) ?? 0) + 1);
    return Array.from(m, ([severity, count]) => ({ severity, count }));
  }, [rows]);

  const trend = useMemo<TrendRow[]>(() => {
    const buckets = new Map<string, number>();
    const bucketMs = range === "24h" ? 3_600_000 : 86_400_000;
    for (const r of rows) {
      const t = new Date(r.created_at).getTime();
      const b = new Date(Math.floor(t / bucketMs) * bucketMs).toISOString();
      buckets.set(b, (buckets.get(b) ?? 0) + 1);
    }
    return Array.from(buckets, ([bucket, count]) => ({ bucket, count }))
      .sort((a, b) => a.bucket.localeCompare(b.bucket));
  }, [rows, range]);

  const topIps = useMemo<CountRow[]>(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.ip_address, (m.get(r.ip_address) ?? 0) + 1);
    return Array.from(m, ([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [rows]);

  const criticalCount = bySeverity.find((s) => s.severity === "critical")?.count ?? 0;
  const highCount = bySeverity.find((s) => s.severity === "high")?.count ?? 0;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SEOHead title="Analytics de Segurança — Admin" description="Métricas agregadas de incidentes de segurança" />
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" data-testid="analytics-title">Analytics de Segurança</h1>
          <p className="text-sm text-muted-foreground">Agregações por reason, severidade e IP</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button asChild variant="secondary" size="sm">
            <Link to="/admin/security-incidents">Ver incidentes</Link>
          </Button>
          <Select value={range} onValueChange={(v: Range) => setRange(v)}>
            <SelectTrigger className="w-40" data-testid="range-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total incidentes</div>
          <div className="text-3xl font-bold" data-testid="metric-total">{rows.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Críticos</div>
          <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">High</div>
          <div className="text-3xl font-bold">{highCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">IPs únicos</div>
          <div className="text-3xl font-bold">{new Set(rows.map((r) => r.ip_address)).size}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Top 10 Reasons</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byReason} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="key" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Distribuição por severidade</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySeverity} dataKey="count" nameKey="severity" outerRadius={90} label>
                  {bySeverity.map((s) => (
                    <Cell key={s.severity} fill={SEVERITY_COLORS[s.severity] ?? "hsl(var(--muted))"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="font-semibold mb-3">
            Tendência ({range === "24h" ? "por hora" : "por dia"})
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="bucket"
                  tickFormatter={(v) => new Date(v).toLocaleString("pt-PT", {
                    month: "2-digit", day: "2-digit",
                    hour: range === "24h" ? "2-digit" : undefined,
                  })}
                  tick={{ fontSize: 11 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleString("pt-PT")} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold mb-3">Top 10 IPs</h2>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">IP</th>
              <th className="text-left p-2">Incidentes</th>
              <th className="text-left p-2">Severidade</th>
            </tr>
          </thead>
          <tbody>
            {topIps.map((row) => {
              const ipRows = rows.filter((r) => r.ip_address === row.key);
              const worst = ipRows.some((r) => r.severity === "critical")
                ? "critical"
                : ipRows.some((r) => r.severity === "high") ? "high" : "medium";
              return (
                <tr key={row.key} className="border-t">
                  {/* JSX auto-escapes — IP renders as literal text, never HTML */}
                  <td className="p-2 font-mono text-xs">{row.key}</td>
                  <td className="p-2">{row.count}</td>
                  <td className="p-2">
                    <Badge variant={worst === "critical" ? "destructive" : "secondary"}>{worst}</Badge>
                  </td>
                </tr>
              );
            })}
            {topIps.length === 0 && !loading && (
              <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">Sem dados no período</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default SecurityAnalytics;
