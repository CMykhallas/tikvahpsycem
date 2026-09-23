/**
 * ============================================================================
 * TIKVAH PSYCEM — SERVICE CATALOG SERVICE
 * ============================================================================
 *
 * Camada de domínio para acesso ao catálogo institucional/comercial.
 *
 * Responsabilidades:
 * - Consumir exclusivamente o cms-loader.
 * - Expor uma API estável para a aplicação.
 * - Centralizar consultas ao catálogo.
 * - Evitar acesso directo ao JSON pelos componentes.
 * - Evitar matching implícito entre serviços.
 * - Preservar integralmente os dados comerciais do CMS.
 *
 * Não é responsabilidade desta camada:
 * - alterar preços;
 * - calcular novos preços comerciais;
 * - criar serviços;
 * - inferir relações entre serviços;
 * - fazer fuzzy matching;
 * - modificar modalidades;
 * - modificar IVA.
 *
 * Fonte de verdade comercial:
 *   tikvah-services-cms.json
 * ============================================================================
 */

import {
  getCMSCategories,
  getCMSCategoryById,
  getCMSServiceById,
  getCMSCatalogStats,
  getIndexedCMSCategoryById,
  getIndexedCMSServiceById,
  loadCMSCatalog,
  type ServiceCategoryCMS,
  type ServiceDetailCMS,
  type CMSCatalogStats,
  type ModalidadeTipo,
  type ClienteTipo,
} from "./cms-loader";

/* ============================================================================
 * 1. TIPOS PÚBLICOS
 * ========================================================================== */

export interface ServiceCatalogItem {
  readonly service: ServiceDetailCMS;
  readonly category: ServiceCategoryCMS;
}

export interface ServiceCatalogSummary {
  readonly categoryCount: number;
  readonly serviceCount: number;
  readonly schemaVersion: string;
  readonly catalogVersion: string;
  readonly locale: string;
  readonly country: string;
  readonly currency: string;
}

export interface ServiceCatalogQuery {
  readonly categoryId?: string;
  readonly modality?: ModalidadeTipo;
  readonly clientType?: ClienteTipo;
}

export interface ServiceCatalogHealth {
  readonly ok: boolean;
  readonly categories: number;
  readonly services: number;
  readonly catalogVersion: string | null;
  readonly error: string | null;
}

/* ============================================================================
 * 2. API DO CATÁLOGO
 * ========================================================================== */

export const serviceCatalogService = {
  /**
   * Retorna o catálogo completo.
   *
   * A referência é reutilizada pelo loader.
   */
  getCatalog() {
    return loadCMSCatalog();
  },

  /**
   * Retorna todas as categorias.
   */
  getCategories(): readonly ServiceCategoryCMS[] {
    return getCMSCategories();
  },

  /**
   * Obtém uma categoria através do ID exacto.
   */
  getCategoryById(
    categoryId: string,
  ): ServiceCategoryCMS | null {
    return getIndexedCMSCategoryById(categoryId);
  },

  /**
   * Obtém um serviço através do ID exacto.
   *
   * Não existe matching por:
   * - título;
   * - slug;
   * - posição;
   * - texto parcial;
   * - similaridade;
   * - fuzzy search.
   */
  getServiceById(
    serviceId: string,
  ): ServiceDetailCMS | null {
    return getIndexedCMSServiceById(serviceId);
  },

  /**
   * Obtém um serviço juntamente com a sua categoria.
   */
  getServiceContext(
    serviceId: string,
  ): ServiceCatalogItem | null {
    const service = getIndexedCMSServiceById(serviceId);

    if (!service) {
      return null;
    }

    const categories = getCMSCategories();

    for (const category of categories) {
      const exists = category.items.some(
        (item) => item.id === serviceId,
      );

      if (exists) {
        return {
          service,
          category,
        };
      }
    }

    return null;
  },

  /**
   * Obtém todos os serviços pertencentes a uma categoria.
   */
  getServicesByCategory(
    categoryId: string,
  ): readonly ServiceDetailCMS[] {
    return (
      getIndexedCMSCategoryById(categoryId)?.items ?? []
    );
  },

  /**
   * Obtém estatísticas do catálogo.
   */
  getStats(): CMSCatalogStats {
    return getCMSCatalogStats();
  },

  /**
   * Executa uma consulta controlada sobre o catálogo.
   *
   * Os filtros são aplicados apenas sobre dados existentes.
   * Nenhum dado comercial é criado ou modificado.
   */
  query(
    query: ServiceCatalogQuery = {},
  ): readonly ServiceCatalogItem[] {
    const catalog = loadCMSCatalog();

    const results: ServiceCatalogItem[] = [];

    for (const category of catalog.categories) {
      if (
        query.categoryId !== undefined &&
        category.id !== query.categoryId
      ) {
        continue;
      }

      for (const service of category.items) {
        if (
          query.modality !== undefined &&
          !service.modalidadesPermitidas.includes(
            query.modality,
          )
        ) {
          continue;
        }

        if (query.clientType !== undefined) {
          const price =
            service.precosPorCliente[
              query.clientType
            ];

          /*
           * null significa não configurado/não aplicável.
           *
           * Não transformamos null em zero.
           */
          if (price === null) {
            continue;
          }
        }

        results.push({
          service,
          category,
        });
      }
    }

    return results;
  },

  /**
   * Verifica se um serviço existe.
   */
  hasService(serviceId: string): boolean {
    return getIndexedCMSServiceById(serviceId) !== null;
  },

  /**
   * Verifica se uma categoria existe.
   */
  hasCategory(categoryId: string): boolean {
    return getIndexedCMSCategoryById(categoryId) !== null;
  },

  /**
   * Health check da camada de catálogo.
   */
  healthCheck(): ServiceCatalogHealth {
    try {
      const stats = getCMSCatalogStats();

      return {
        ok: true,
        categories: stats.categoryCount,
        services: stats.serviceCount,
        catalogVersion: stats.catalogVersion,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        categories: 0,
        services: 0,
        catalogVersion: null,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido no catálogo.",
      };
    }
  },
};

/* ============================================================================
 * 3. FUNÇÕES FUNCIONAIS
 * ============================================================================
 *
 * Estas funções permitem uma utilização simples:
 *
 *   import {
 *     getServiceById
 *   } from "@/services/service-catalog.service";
 */

export function getCatalog() {
  return serviceCatalogService.getCatalog();
}

export function getCategories() {
  return serviceCatalogService.getCategories();
}

export function getCategoryById(
  categoryId: string,
) {
  return serviceCatalogService.getCategoryById(
    categoryId,
  );
}

export function getServiceById(
  serviceId: string,
) {
  return serviceCatalogService.getServiceById(
    serviceId,
  );
}

export function getServiceContext(
  serviceId: string,
) {
  return serviceCatalogService.getServiceContext(
    serviceId,
  );
}

export function getServicesByCategory(
  categoryId: string,
) {
  return serviceCatalogService.getServicesByCategory(
    categoryId,
  );
}

export function queryServices(
  query: ServiceCatalogQuery = {},
) {
  return serviceCatalogService.query(query);
}

export function getCatalogStats() {
  return serviceCatalogService.getStats();
}

export function catalogHealthCheck() {
  return serviceCatalogService.healthCheck();
}

export default serviceCatalogService;