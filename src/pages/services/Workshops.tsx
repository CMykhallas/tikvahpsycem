/**
 * /services/workshops — Consome `SERVICES_CONFIG.workshops`.
 */
import { ServicePageTemplate } from "@/components/services/shared/ServicePageTemplate";
import { getServiceConfig } from "@/config/services";

const Workshops = () => (
  <ServicePageTemplate config={getServiceConfig("workshops")} />
);

export default Workshops;
