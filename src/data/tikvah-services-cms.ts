import data from "./tikvah-psycem-services-cms.json";

export type ModalidadeTipo = "online" | "presencial" | "hibrido";

export interface ServiceDetail {
  id: string;
  title: string;
  summary: string;
  descriptionFull: string;
  diferencial: string;
  competitividade: string;
  modalidadesPermitidas: ModalidadeTipo[];
  precoBaseMZN: number;
  precoComIvaMZN: number;
  precosPorModalidade?: Partial<Record<ModalidadeTipo, number>>;
  precosPorCliente?: Partial<
    Record<
      "empresas" | "individualidades" | "familia" | "casal" | "ong" | "associacoes",
      number
    >
  >;
}

export interface ServiceCategory {
  id: string;
  title: string;
  items: ServiceDetail[];
}

// Correção das chaves apontando corretamente para o JSON atualizado
export const tikvahEcosystemDescription: string = (data as any).tikvahpsycemEcosystemDescription;
export const tikvahModel360Text: string = (data as any).tikvahModel360Text;

// TODO: os preços das 4 categorias novas (assessoria, coaching-mentoria,
// programas-estruturados, reciclagem-sustentabilidade) em tikvah-services-cms.json
// são INDICATIVOS (base × IVA 16%, variação por modalidade/cliente) —
// confirmar com o negócio antes de publicar.
export const tikvahServicesEcosystem: ServiceCategory[] =
  (data as any).categories as ServiceCategory[];