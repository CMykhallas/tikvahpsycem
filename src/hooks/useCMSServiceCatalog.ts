/**
 * ============================================================================
 * TIKVAH PSYCEM — CMS SERVICE CATALOG HOOK
 * ============================================================================
 *
 * Integra o catálogo CMS estático com React.
 *
 * Fluxo:
 *
 * React
 *   ↓
 * useCMSServiceCatalog
 *   ↓
 * service-catalog.service.ts
 *   ↓
 * cms-loader.ts
 *   ↓
 * tikvah-services-cms.json
 *
 * Este hook NÃO faz:
 * - fetch HTTP;
 * - chamada ao Supabase;
 * - useEffect de carregamento;
 * - polling;
 * - alteração de dados comerciais.
 *
 * O catálogo CMS já está disponível no bundle através do import estático.
 * ============================================================================
 */

import { useMemo } from "react";

import {
  serviceCatalogService,
  type ServiceCatalogQuery,
} from "@/services/service-catalog-validator";

import type {
  ServiceCategoryCMS,
  ServiceDetailCMS,
  CMSCatalogStats,
} from "@/services/cms-loader";

/* ============================================================================
 * 1. TIPOS
 * ========================================================================== */

export interface UseCMSServiceCatalogResult {
  readonly categories: readonly ServiceCategoryCMS[];
  readonly services: readonly ServiceDetailCMS[];
  readonly stats: CMSCatalogStats;
  readonly isLoading: false;
  readonly isError: boolean;
  readonly error: Error | null;
}

/* ============================================================================
 * 2. HOOK PRINCIPAL
 * ========================================================================== */

export function useCMSServiceCatalog(): UseCMSServiceCatalogResult {
  const catalog = serviceCatalogService.getCatalog();

  const categories = catalog.categories;

  const services = useMemo(() => {
    const result: ServiceDetailCMS[] = [];

    for (const category of categories) {
      for (const service of category.items) {
        result.push(service);
      }
    }

    return result;
  }, [categories]);

  const stats = useMemo(
    () => serviceCatalogService.getStats(),
    [],
  );

  return {
    categories,
    services,
    stats,
    isLoading: false,
    isError: false,
    error: null,
  };
}

/* ============================================================================
 * 3. HOOK — CATEGORIA
 * ========================================================================== */

export function useCMSServiceCategory(
  categoryId: string | undefined,
) {
  return useMemo(() => {
    if (!categoryId) {
      return null;
    }

    return serviceCatalogService.getCategoryById(
      categoryId,
    );
  }, [categoryId]);
}

/* ============================================================================
 * 4. HOOK — SERVIÇO
 * ========================================================================== */

export function useCMSService(
  serviceId: string | undefined,
) {
  return useMemo(() => {
    if (!serviceId) {
      return null;
    }

    return serviceCatalogService.getServiceById(
      serviceId,
    );
  }, [serviceId]);
}

/* ============================================================================
 * 5. HOOK — CONTEXTO DO SERVIÇO
 * ========================================================================== */

export function useCMSServiceContext(
  serviceId: string | undefined,
) {
  return useMemo(() => {
    if (!serviceId) {
      return null;
    }

    return serviceCatalogService.getServiceContext(
      serviceId,
    );
  }, [serviceId]);
}

/* ============================================================================
 * 6. HOOK — CONSULTA
 * ========================================================================== */

export function useCMSServiceQuery(
  query: ServiceCatalogQuery = {},
) {
  return useMemo(
    () => serviceCatalogService.query(query),
    [
      query.categoryId,
      query.modality,
      query.clientType,
    ],
  );
}

/* ============================================================================
 * 7. HEALTH CHECK
 * ========================================================================== */

export function useCMSCatalogHealth() {
  return useMemo(
    () => serviceCatalogService.healthCheck(),
    [],
  );
}