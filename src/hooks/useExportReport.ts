import { SecurityIncident } from '@/hooks/useSecurityIncidents';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import DOMPurify from 'dompurify';

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

/**
 * Strip ALL HTML/JS from a value. Any stored X-Forwarded-For or user-agent
 * that contains `<script>` / `<img onerror>` payloads becomes inert text.
 */
const clean = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  const raw = String(value);
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/** Escape for safe use inside a CSV cell (already sanitized to plain text). */
const csvCell = (value: unknown): string => {
  const s = clean(value).replace(/"/g, '""');
  // Prevent CSV formula injection (Excel)
  const guarded = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${guarded}"`;
};

export const useExportReport = () => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: pt });
  };

  const exportToCSV = (
    incidents: SecurityIncident[],
    blockedIPs: BlockedIP[],
    stats: SecurityStats | null,
    timeRange: string
  ) => {
    const now = format(new Date(), 'dd-MM-yyyy_HH-mm', { locale: pt });

    let csvContent = 'Relatório de Segurança - Tikvah Psicologia\n';
    csvContent += `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: pt })}\n`;
    csvContent += `Período: ${clean(timeRange)}\n\n`;

    csvContent += '=== RESUMO ===\n';
    csvContent += `Total de Incidentes,${stats?.total_incidents || 0}\n`;
    csvContent += `Incidentes Críticos,${stats?.critical_incidents || 0}\n`;
    csvContent += `IPs Únicos,${stats?.unique_ips || 0}\n`;
    csvContent += `IPs Bloqueados,${stats?.blocked_ips || 0}\n`;
    csvContent += `Tentativas de Manipulação de Preço,${stats?.price_tampering_attempts || 0}\n`;
    csvContent += `Violações de Rate Limit,${stats?.rate_limit_violations || 0}\n\n`;

    csvContent += '=== INCIDENTES ===\n';
    csvContent += 'Data/Hora,Tipo,Severidade,IP,Endpoint,User Agent\n';
    incidents.forEach((inc) => {
      csvContent +=
        [
          csvCell(formatDate(inc.created_at)),
          csvCell(inc.incident_type),
          csvCell(inc.severity),
          csvCell(inc.ip_address),
          csvCell(inc.endpoint || '-'),
          csvCell(inc.user_agent || '-'),
        ].join(',') + '\n';
    });

    csvContent += '\n=== IPs BLOQUEADOS ===\n';
    csvContent += 'IP,Motivo,Bloqueado em,Expira em\n';
    blockedIPs.forEach((ip) => {
      csvContent +=
        [
          csvCell(ip.ip_address),
          csvCell(ip.reason),
          csvCell(formatDate(ip.blocked_at)),
          csvCell(ip.expires_at ? formatDate(ip.expires_at) : 'Permanente'),
        ].join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-seguranca_${now}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  /**
   * Build the report by constructing DOM nodes with textContent — never by
   * concatenating attacker-controlled strings into HTML — then write the
   * serialized output to the print window. Any script payload smuggled into
   * `ip_address`, `user_agent`, or `endpoint` is rendered as inert text.
   */
  const exportToPDF = (
    incidents: SecurityIncident[],
    blockedIPs: BlockedIP[],
    stats: SecurityStats | null,
    timeRange: string
  ) => {
    const nowLabel = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: pt });

    const doc = document.implementation.createHTMLDocument('Relatório de Segurança');
    doc.documentElement.lang = 'pt';

    const meta = doc.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    doc.head.appendChild(meta);

    const csp = doc.createElement('meta');
    csp.setAttribute('http-equiv', 'Content-Security-Policy');
    csp.setAttribute(
      'content',
      "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"
    );
    doc.head.appendChild(csp);

    const style = doc.createElement('style');
    style.textContent = `
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
      th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; word-break: break-all; }
      th { background: #f7fafc; font-weight: bold; }
      tr:nth-child(even) { background: #fafafa; }
      .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #718096; }
      @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
    `;
    doc.head.appendChild(style);

    const title = doc.createElement('title');
    title.textContent = 'Relatório de Segurança - Tikvah Psicologia';
    doc.head.appendChild(title);

    const body = doc.body;

    const header = doc.createElement('div');
    header.className = 'header';
    const h1 = doc.createElement('h1');
    h1.textContent = '🛡️ Relatório de Segurança';
    const p1 = doc.createElement('p');
    p1.textContent = 'Tikvah Psicologia - Centro de Desenvolvimento Humano';
    const p2 = doc.createElement('p');
    p2.textContent = `Gerado em: ${nowLabel} | Período: ${clean(timeRange)}`;
    header.append(h1, p1, p2);
    body.appendChild(header);

    // Stats
    const statsHeading = doc.createElement('h2');
    statsHeading.textContent = '📊 Resumo Estatístico';
    body.appendChild(statsHeading);

    const grid = doc.createElement('div');
    grid.className = 'stats-grid';
    const statItems: Array<[string, number, string?]> = [
      ['Total de Incidentes', stats?.total_incidents || 0],
      ['Incidentes Críticos', stats?.critical_incidents || 0, 'critical'],
      ['IPs Únicos', stats?.unique_ips || 0],
      ['IPs Bloqueados', stats?.blocked_ips || 0],
      ['Manipulação de Preço', stats?.price_tampering_attempts || 0],
      ['Violações Rate Limit', stats?.rate_limit_violations || 0],
    ];
    statItems.forEach(([label, value, tone]) => {
      const card = doc.createElement('div');
      card.className = 'stat-card';
      const v = doc.createElement('div');
      v.className = `stat-value${tone ? ' ' + tone : ''}`;
      v.textContent = String(value);
      const l = doc.createElement('div');
      l.className = 'stat-label';
      l.textContent = label;
      card.append(v, l);
      grid.appendChild(card);
    });
    body.appendChild(grid);

    // Incidents table
    const incHeading = doc.createElement('h2');
    incHeading.textContent = `⚠️ Incidentes de Segurança (${incidents.length})`;
    body.appendChild(incHeading);

    const incTable = doc.createElement('table');
    const incThead = doc.createElement('thead');
    const incHeadRow = doc.createElement('tr');
    ['Data/Hora', 'Tipo', 'Severidade', 'IP', 'Endpoint'].forEach((label) => {
      const th = doc.createElement('th');
      th.textContent = label;
      incHeadRow.appendChild(th);
    });
    incThead.appendChild(incHeadRow);
    incTable.appendChild(incThead);

    const incTbody = doc.createElement('tbody');
    if (incidents.length === 0) {
      const emptyRow = doc.createElement('tr');
      const emptyCell = doc.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.style.textAlign = 'center';
      emptyCell.textContent = 'Nenhum incidente registado';
      emptyRow.appendChild(emptyCell);
      incTbody.appendChild(emptyRow);
    } else {
      incidents.forEach((inc) => {
        const row = doc.createElement('tr');
        const cells: Array<{ text: string; className?: string }> = [
          { text: formatDate(inc.created_at) },
          { text: (inc.incident_type || '').replace(/_/g, ' ') },
          { text: inc.severity || '', className: inc.severity },
          { text: inc.ip_address || '-' },
          { text: inc.endpoint || '-' },
        ];
        cells.forEach(({ text, className }) => {
          const td = doc.createElement('td');
          if (className) td.className = className;
          // textContent is the anti-XSS boundary — never innerHTML here.
          td.textContent = clean(text);
          row.appendChild(td);
        });
        incTbody.appendChild(row);
      });
    }
    incTable.appendChild(incTbody);
    body.appendChild(incTable);

    // Blocked IPs
    const ipHeading = doc.createElement('h2');
    ipHeading.textContent = `🚫 IPs Bloqueados (${blockedIPs.length})`;
    body.appendChild(ipHeading);

    const ipTable = doc.createElement('table');
    const ipThead = doc.createElement('thead');
    const ipHeadRow = doc.createElement('tr');
    ['IP', 'Motivo', 'Bloqueado em', 'Expira em'].forEach((label) => {
      const th = doc.createElement('th');
      th.textContent = label;
      ipHeadRow.appendChild(th);
    });
    ipThead.appendChild(ipHeadRow);
    ipTable.appendChild(ipThead);

    const ipTbody = doc.createElement('tbody');
    if (blockedIPs.length === 0) {
      const emptyRow = doc.createElement('tr');
      const emptyCell = doc.createElement('td');
      emptyCell.colSpan = 4;
      emptyCell.style.textAlign = 'center';
      emptyCell.textContent = 'Nenhum IP bloqueado';
      emptyRow.appendChild(emptyCell);
      ipTbody.appendChild(emptyRow);
    } else {
      blockedIPs.forEach((ip) => {
        const row = doc.createElement('tr');
        [
          ip.ip_address,
          ip.reason,
          formatDate(ip.blocked_at),
          ip.expires_at ? formatDate(ip.expires_at) : 'Permanente',
        ].forEach((text) => {
          const td = doc.createElement('td');
          td.textContent = clean(text);
          row.appendChild(td);
        });
        ipTbody.appendChild(row);
      });
    }
    ipTable.appendChild(ipTbody);
    body.appendChild(ipTable);

    const footer = doc.createElement('div');
    footer.className = 'footer';
    const f1 = doc.createElement('p');
    f1.textContent = 'Documento gerado automaticamente pelo sistema de segurança Tikvah';
    const f2 = doc.createElement('p');
    f2.textContent =
      'Este relatório é confidencial e destinado apenas a administradores autorizados';
    footer.append(f1, f2);
    body.appendChild(footer);

    // Serialize the fully constructed DOM. Since every dynamic value went in
    // through `textContent` (and was pre-sanitized by DOMPurify), no attacker
    // payload can escape into executable HTML/JS.
    const serialized = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) return;

    // Replace the blank document atomically. No `document.write` of untrusted
    // strings — the payload here is a fully sanitized DOM serialization.
    printWindow.document.open();
    printWindow.document.write(serialized);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return { exportToCSV, exportToPDF };
};
