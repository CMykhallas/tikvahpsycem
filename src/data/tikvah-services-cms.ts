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

export const tikvahpsycemEcosystemDescription: string = (data as any).tikvahpsycemEcosystemDescription;
export const tikvahpsycemModel360Text: string = (data as any).tikvahModel360Text;
export const tikvahpsycemServicesEcosystem: ServiceCategory[] =
  (data as any).categories as ServiceCategory[];
