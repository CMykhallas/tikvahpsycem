export const IVA = 0.16;

export function calcularPrecoComIva(precoBaseMZN: number): number {
  return Math.round(precoBaseMZN * (1 + IVA));
}

export function calcularPrecoComIvaEDesconto(
  precoBaseMZN: number,
  descontoPercentual: number = 0
): number {
  const precoComIva = calcularPrecoComIva(precoBaseMZN);
  const desconto = precoComIva * (descontoPercentual / 100);
  return Math.round(precoComIva - desconto);
}

export function obterPrecoPorModalidade(
  service: { precosPorModalidade?: Record<string, number> },
  modalidade: "online" | "presencial" | "hibrido"
): number | null {
  const valor = service.precosPorModalidade?.[modalidade];
  return typeof valor === "number" ? valor : null;
}

export function obterPrecoPorCliente(
  service: { precosPorCliente?: Record<string, number | null> },
  cliente: "empresas" | "individualidades" | "familia" | "casal" | "ong" | "associacoes"
): number | null {
  const valor = service.precosPorCliente?.[cliente];
  return typeof valor === "number" ? valor : null;
}