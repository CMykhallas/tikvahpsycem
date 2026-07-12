/**
 * Consultoria — thin wrapper around ServicePageTemplate.
 * All content lives in `src/config/services.ts` (`consultoria` entry).
 * The custom `ConsultoriaMenuBar` is injected as the sticky sub-nav slot,
 * preserving the existing UX without duplicating layout code.
 */
import { ServicePageTemplate } from "@/components/services/shared/ServicePageTemplate";
import { getServiceConfig } from "@/config/services";
import { ConsultoriaMenuBar } from "@/components/ConsultoriaMenuBar";

const Consultoria = () => (
  <ServicePageTemplate
    config={getServiceConfig("consultoria")}
    stickyNav={<ConsultoriaMenuBar />}
  />
);

export default Consultoria;
