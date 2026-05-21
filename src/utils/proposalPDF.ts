import jsPDF from "jspdf";

interface ProposalPDFData {
  protocol: string;
  service_title: string;
  area_name?: string | null;
  full_name: string;
  email: string;
  phone: string;
  modality: string;
  audience: string;
  message?: string;
  created_at?: string;
}

export function generateProposalPDF(data: ProposalPDFData): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // Header bar
  doc.setFillColor(30, 58, 138); // #1e3a8a
  doc.rect(0, 0, W, 90, "F");
  doc.setFillColor(245, 158, 11); // accent
  doc.rect(0, 90, W, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TIKVAH PSYCEM", 40, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Comprovativo de Pedido de Proposta", 40, 60);
  doc.setFontSize(9);
  doc.text("Maputo · Mocambique · ISO 27001 Compliant", 40, 75);

  // Protocol box
  y = 130;
  doc.setDrawColor(0, 168, 89);
  doc.setLineWidth(1.5);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(40, y, W - 80, 70, 6, 6, "FD");
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text("NUMERO DE PROTOCOLO", 56, y + 22);
  doc.setTextColor(0, 168, 89);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text(data.protocol, 56, y + 52);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const dt = data.created_at ? new Date(data.created_at) : new Date();
  doc.text(
    `Recebido: ${dt.toLocaleString("pt-PT", { timeZone: "Africa/Maputo" })} (Maputo)`,
    W - 240,
    y + 52
  );

  // Service section
  y += 100;
  drawSectionHeader(doc, y, "SERVICO SOLICITADO");
  y += 24;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(data.service_title, 40, y);
  if (data.area_name) {
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Area: ${data.area_name}`, 40, y);
  }

  // Client section
  y += 30;
  drawSectionHeader(doc, y, "DADOS DO CLIENTE");
  y += 24;
  y = drawRow(doc, y, "Nome", data.full_name);
  y = drawRow(doc, y, "Email", data.email);
  y = drawRow(doc, y, "Telefone", data.phone);
  y = drawRow(doc, y, "Modalidade", data.modality);
  y = drawRow(doc, y, "Publico", data.audience);

  // Message
  if (data.message) {
    y += 14;
    drawSectionHeader(doc, y, "MENSAGEM");
    y += 22;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(data.message, W - 80);
    doc.setFillColor(248, 250, 252);
    doc.rect(40, y - 12, W - 80, lines.length * 13 + 16, "F");
    doc.text(lines, 48, y);
    y += lines.length * 13 + 10;
  }

  // Next steps
  y += 24;
  drawSectionHeader(doc, y, "PROXIMOS PASSOS");
  y += 22;
  const steps = [
    "1. Notificacao da equipa enviada (imediato)",
    "2. Analise tecnica pelo especialista da area (ate 4 horas uteis)",
    "3. Primeiro contacto telefonico ou email (em 24 horas)",
    "4. Proposta formal escrita (em 48 a 72 horas)",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  steps.forEach((s) => { doc.text(s, 40, y); y += 16; });

  // Footer
  const FY = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor(226, 232, 240);
  doc.line(40, FY, W - 40, FY);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Tikvah Psycem · suporte.oficina.psicologo@proton.me · Maputo, Mocambique", 40, FY + 16);
  doc.text("Documento gerado automaticamente. Guarde o numero de protocolo para acompanhamento.", 40, FY + 30);
  doc.setFont("helvetica", "bold");
  doc.text(`Protocolo: ${data.protocol}`, W - 160, FY + 30);

  doc.save(`Tikvah-Proposta-${data.protocol}.pdf`);
}

function drawSectionHeader(doc: jsPDF, y: number, label: string) {
  doc.setFillColor(30, 58, 138);
  doc.rect(40, y, 4, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text(label, 52, y + 11);
}

function drawRow(doc: jsPDF, y: number, label: string, value: string): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(label, 40, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(value, 130, y);
  return y + 18;
}
