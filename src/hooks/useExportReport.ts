import { SecurityIncident } from '@/hooks/useSecurityIncidents';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  expires_at?: string | null;
}

interface SecurityStats {
  total_incidents: number;
  critical_incidents: number;
  unique_ips: number;
  blocked_ips: number;
  price_tampering_attempts: number;
  rate_limit_violations: number;
}

export const useExportReport = () => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: pt });
  };

  const exportToCSV = (
    incidents: SecurityIncident[],
    blockedIPs: BlockedIP[],
    stats: SecurityStats | null,
    timeRange: string
  ) => {
    const now = format(new Date(), "dd-MM-yyyy_HH-mm", { locale: pt });
    
    // Create CSV content for incidents
    let csvContent = "Relatório de Segurança - Tikvah Psicologia\n";
    csvContent += `Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}\n`;
    csvContent += `Período: ${timeRange}\n\n`;
    
    // Stats summary
    csvContent += "=== RESUMO ===\n";
    csvContent += `Total de Incidentes,${stats?.total_incidents || 0}\n`;
    csvContent += `Incidentes Críticos,${stats?.critical_incidents || 0}\n`;
    csvContent += `IPs Únicos,${stats?.unique_ips || 0}\n`;
    csvContent += `IPs Bloqueados,${stats?.blocked_ips || 0}\n`;
    csvContent += `Tentativas de Manipulação de Preço,${stats?.price_tampering_attempts || 0}\n`;
    csvContent += `Violações de Rate Limit,${stats?.rate_limit_violations || 0}\n\n`;
    
    // Incidents table
    csvContent += "=== INCIDENTES ===\n";
    csvContent += "Data/Hora,Tipo,Severidade,IP,Endpoint,User Agent\n";
    incidents.forEach(inc => {
      csvContent += `"${formatDate(inc.created_at)}","${inc.incident_type}","${inc.severity}","${inc.ip_address}","${inc.endpoint || '-'}","${inc.user_agent || '-'}"\n`;
    });
    
    csvContent += "\n=== IPs BLOQUEADOS ===\n";
    csvContent += "IP,Motivo,Bloqueado em,Expira em\n";
    blockedIPs.forEach(ip => {
      csvContent += `"${ip.ip_address}","${ip.reason}","${formatDate(ip.blocked_at)}","${ip.expires_at ? formatDate(ip.expires_at) : 'Permanente'}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-seguranca_${now}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (
    incidents: SecurityIncident[],
    blockedIPs: BlockedIP[],
    stats: SecurityStats | null,
    timeRange: string
  ) => {
    const now = format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt });
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Segurança - Tikvah Psicologia</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
          h2 { color: #2d3748; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
          .stat-card { background: #f7fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #1a365d; }
          .stat-label { font-size: 12px; color: #718096; margin-top: 5px; }
          .critical { color: #dc2626; }
          .high { color: #f97316; }
          .medium { color: #eab308; }
          .low { color: #22c55e; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          th { background: #f7fafc; font-weight: bold; }
          tr:nth-child(even) { background: #fafafa; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #718096; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛡️ Relatório de Segurança</h1>
          <p>Tikvah Psicologia - Centro de Desenvolvimento Humano</p>
          <p>Gerado em: ${now} | Período: ${timeRange}</p>
        </div>
        
        <h2>📊 Resumo Estatístico</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats?.total_incidents || 0}</div>
            <div class="stat-label">Total de Incidentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value critical">${stats?.critical_incidents || 0}</div>
            <div class="stat-label">Incidentes Críticos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats?.unique_ips || 0}</div>
            <div class="stat-label">IPs Únicos</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats?.blocked_ips || 0}</div>
            <div class="stat-label">IPs Bloqueados</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats?.price_tampering_attempts || 0}</div>
            <div class="stat-label">Manipulação de Preço</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats?.rate_limit_violations || 0}</div>
            <div class="stat-label">Violações Rate Limit</div>
          </div>
        </div>
        
        <h2>⚠️ Incidentes de Segurança (${incidents.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Severidade</th>
              <th>IP</th>
              <th>Endpoint</th>
            </tr>
          </thead>
          <tbody>
            ${incidents.length === 0 
              ? '<tr><td colspan="5" style="text-align: center;">Nenhum incidente registado</td></tr>'
              : incidents.map(inc => `
                <tr>
                  <td>${formatDate(inc.created_at)}</td>
                  <td>${inc.incident_type.replace(/_/g, ' ')}</td>
                  <td class="${inc.severity}">${inc.severity}</td>
                  <td>${inc.ip_address}</td>
                  <td>${inc.endpoint || '-'}</td>
                </tr>
              `).join('')
            }
          </tbody>
        </table>
        
        <h2>🚫 IPs Bloqueados (${blockedIPs.length})</h2>
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Motivo</th>
              <th>Bloqueado em</th>
              <th>Expira em</th>
            </tr>
          </thead>
          <tbody>
            ${blockedIPs.length === 0
              ? '<tr><td colspan="4" style="text-align: center;">Nenhum IP bloqueado</td></tr>'
              : blockedIPs.map(ip => `
                <tr>
                  <td>${ip.ip_address}</td>
                  <td>${ip.reason}</td>
                  <td>${formatDate(ip.blocked_at)}</td>
                  <td>${ip.expires_at ? formatDate(ip.expires_at) : 'Permanente'}</td>
                </tr>
              `).join('')
            }
          </tbody>
        </table>
        
        <div class="footer">
          <p>Documento gerado automaticamente pelo sistema de segurança Tikvah</p>
          <p>Este relatório é confidencial e destinado apenas a administradores autorizados</p>
        </div>
      </body>
      </html>
    `;
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return { exportToCSV, exportToPDF };
};
