/**
 * /services/cursos — Consome `SERVICES_CONFIG.cursos`.
 */
import { ServicePageTemplate } from "@/components/services/shared/ServicePageTemplate";
import { getServiceConfig } from "@/config/services";

const Cursos = () => (
  <ServicePageTemplate config={getServiceConfig("cursos")} />
);

export default Cursos;
