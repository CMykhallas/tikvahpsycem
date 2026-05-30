import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecurityIncidents, SecurityIncident } from '@/hooks/useSecurityIncidents';
import { useAuth } from '@/hooks/useAuth';
import { useExportReport } from '@/hooks/useExportReport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Shield, ShieldAlert, ShieldX, Ban, Activity, AlertTriangle, Clock, RefreshCw, ArrowLeft, TrendingUp, Globe, Download, FileSpreadsheet, FileText, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { pt } from 'date-fns/locale';
import { SEOHead } from '@/components/SEOHead';

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
};

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#ec4899'];

const SecurityDashboard = () => {
  const { incidents, blockedIPs, stats, loading, fetchIncidents, fetchBlockedIPs, fetchStats } = useSecurityIncidents();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { exportToCSV, exportToPDF } = useExportReport();
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Redirect to auth if not logged in or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth', { state: { from: '/security' } });
      } else if (!isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchIncidents(),
      fetchBlockedIPs(),
      fetchStats(timeRange === '24h' ? '24 hours' : timeRange === '7d' ? '7 days' : '30 days')
    ]);
    setRefreshing(false);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    fetchStats(value === '24h' ? '24 hours' : value === '7d' ? '7 days' : '30 days');
  };

  const handleExportCSV = () => {
    const rangeLabel = timeRange === '24h' ? 'Últimas 24 horas' : timeRange === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias';
    exportToCSV(incidents, blockedIPs, stats, rangeLabel);
  };

  const handleExportPDF = () => {
    const rangeLabel = timeRange === '24h' ? 'Últimas 24 horas' : timeRange === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias';
    exportToPDF(incidents, blockedIPs, stats, rangeLabel);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Process incidents for trend chart
  const getTrendData = () => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days),
      end: new Date()
    });

    return dateRange.map(date => {
      const dayStart = startOfDay(date);
      const dayIncidents = incidents.filter(inc => {
        const incDate = startOfDay(new Date(inc.created_at));
        return incDate.getTime() === dayStart.getTime();
      });

      return {
        date: format(date, 'dd/MM', { locale: pt }),
        total: dayIncidents.length,
        critical: dayIncidents.filter(i => i.severity === 'critical').length,
        high: dayIncidents.filter(i => i.severity === 'high').length
      };
    });
  };

  // Process incidents by type for bar chart
  const getIncidentsByType = () => {
    const typeCount: Record<string, number> = {};
    incidents.forEach(inc => {
      typeCount[inc.incident_type] = (typeCount[inc.incident_type] || 0) + 1;
    });

    return Object.entries(typeCount)
      .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Process incidents by severity for pie chart
  const getSeverityDistribution = () => {
    const sevCount: Record<string, number> = {};
    incidents.forEach(inc => {
      sevCount[inc.severity] = (sevCount[inc.severity] || 0) + 1;
    });

    return Object.entries(sevCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS] || '#6b7280'
    }));
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary' | 'outline'> = {
      critical: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline'
    };
    return (
      <Badge variant={variants[severity] || 'outline'} className="capitalize">
        {severity}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: pt });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Shield className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">A carregar dashboard de segurança...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <SEOHead
        title="Dashboard de Segurança | Tikvah Psicologia"
        description="Monitorização de segurança em tempo real"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Dashboard de Segurança
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Monitorização em tempo real • {user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger className="w-[130px]">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Últimas 24h</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>

                <Button onClick={handleSignOut} variant="ghost" size="icon" title="Terminar sessão">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.total_incidents || 0}</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-red-600">
                  <ShieldX className="h-3 w-3" />
                  Críticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{stats?.critical_incidents || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  IPs Únicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.unique_ips || 0}</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-orange-600">
                  <Ban className="h-3 w-3" />
                  IPs Bloqueados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{stats?.blocked_ips || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Tentativas Preço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.price_tampering_attempts || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Rate Limit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats?.rate_limit_violations || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendência de Incidentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getTrendData()}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area type="monotone" dataKey="total" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTotal)" name="Total" />
                      <Area type="monotone" dataKey="critical" stroke="#dc2626" fillOpacity={1} fill="url(#colorCritical)" name="Críticos" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Severity Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Severidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSeverityDistribution()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {getSeverityDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {getSeverityDistribution().map((entry, index) => (
                      <div key={index} className="flex items-center gap-1 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Types Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Tipos de Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getIncidentsByType()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {getIncidentsByType().map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Incidents and Blocked IPs */}
          <Tabs defaultValue="incidents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="incidents" className="gap-2">
                <ShieldAlert className="h-4 w-4" />
                Incidentes ({incidents.length})
              </TabsTrigger>
              <TabsTrigger value="blocked" className="gap-2">
                <Ban className="h-4 w-4" />
                IPs Bloqueados ({blockedIPs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incidents">
              <Card>
                <CardHeader>
                  <CardTitle>Incidentes Recentes</CardTitle>
                  <CardDescription>Lista dos últimos incidentes de segurança detectados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Severidade</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>Endpoint</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              Nenhum incidente registado
                            </TableCell>
                          </TableRow>
                        ) : (
                          incidents.map((incident) => (
                            <TableRow key={incident.id}>
                              <TableCell className="font-mono text-sm">
                                {formatDate(incident.created_at)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {incident.incident_type.replace(/_/g, ' ')}
                              </TableCell>
                              <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                              <TableCell className="font-mono text-sm">{incident.ip_address}</TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground truncate max-w-[200px]">
                                {incident.endpoint || '-'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blocked">
              <Card>
                <CardHeader>
                  <CardTitle>IPs Bloqueados</CardTitle>
                  <CardDescription>Lista de endereços IP actualmente na lista negra</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Bloqueado em</TableHead>
                          <TableHead>Expira em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blockedIPs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nenhum IP bloqueado
                            </TableCell>
                          </TableRow>
                        ) : (
                          blockedIPs.map((ip) => (
                            <TableRow key={ip.id}>
                              <TableCell className="font-mono font-medium">{ip.ip_address}</TableCell>
                              <TableCell>{ip.reason}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatDate(ip.blocked_at)}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {ip.expires_at ? formatDate(ip.expires_at) : 'Permanente'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default SecurityDashboard;
