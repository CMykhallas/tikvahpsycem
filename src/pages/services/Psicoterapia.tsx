/**
 * /services/psicoterapia — Consome `SERVICES_CONFIG.psicoterapia`.
 * Toda a UI vive em `ServicePageTemplate`; conteúdo em `src/config/services.ts`.
 */
import { ServicePageTemplate } from "@/components/services/shared/ServicePageTemplate";
import { getServiceConfig } from "@/config/services";

const Psicoterapia = () => (
  <ServicePageTemplate config={getServiceConfig("psicoterapia")} />
);

export default Psicoterapia;
