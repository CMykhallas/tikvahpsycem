/**
 * ============================================================================
 * TIKVAH PSYCEM
 * Service Catalog Linkage
 * ============================================================================
 *
 * Responsabilidade:
 *   Fazer a ligação explícita entre a taxonomia institucional e o catálogo
 *   comercial do Ecossistema.
 *
 * Princípios:
 *   - Não duplicar preços.
 *   - Não duplicar dados comerciais.
 *   - Não efectuar matching por texto.
 *   - Utilizar IDs estáveis e explícitos.
 *   - Permitir que uma área institucional tenha vários serviços comerciais.
 *   - Permitir que um serviço comercial seja apresentado em diferentes
 *     contextos institucionais, desde que explicitamente autorizado.
 *
 * Segurança / Qualidade:
 *   - Dados determinísticos.
 *   - Sem fallback silencioso.
 *   - Sem criação automática de serviços.
 *   - Erros de integridade devem ser detectáveis em CI.
 * ============================================================================
 */

import {
  tikvahServicesEcosystem,
  type ServiceCategory,
  type ServiceDetail,
} from "./services-ecosystem";

/* ============================================================================
 * 1. TIPOS
 * ========================================================================== */

export interface EcosystemServiceReference {
  /**
   * ID exacto da categoria existente no Ecossistema.
   */
  ecosystemCategoryId: string;

  /**
   * ID exacto do serviço existente no Ecossistema.
   */
  ecosystemServiceId: string;
}

export interface TaxonomyServiceLink {
  /**
   * ID estável da área/subárea da taxonomia.
   */
  taxonomyId: string;

  /**
   * Referências comerciais explícitas.
   *
   * Uma taxonomia pode não possuir ainda uma oferta comercial.
   */
  ecosystemServices: EcosystemServiceReference[];
}

/* ============================================================================
 * CONSTRUÇÃO SEGURA DO ÍNDICE
 * ========================================================================== */

function createEcosystemServiceIndex(
  categories: readonly ServiceCategory[]
): ReadonlyMap<
  string,
  IndexedEcosystemService
> {
  const index = new Map<
    string,
    IndexedEcosystemService
  >();

  for (const category of categories) {
    for (const service of category.items) {
      if (index.has(service.id)) {
        throw new Error(
          [
            "[ECOSYSTEM_DUPLICATE_SERVICE_ID]",
            `O ID de serviço "${service.id}"`,
            "está registado mais de uma vez no catálogo.",
            "Cada serviço comercial deve possuir um ID único.",
          ].join(" ")
        );
      }

      index.set(
        service.id,
        {
          category,
          service,
        }
      );
    }
  }

  return index;
}


/**
 * Índice operacional dos serviços comerciais.
 *
 * O índice é criado exclusivamente a partir do catálogo principal.
 */
export const ecosystemServiceIndex =
  createEcosystemServiceIndex(
    tikvahServicesEcosystem
  );

/* ============================================================================
 * 3. RESOLUÇÃO SEGURA
 * ========================================================================== */

/**
 * Resolve um serviço comercial através do seu ID.
 *
 * Não existe fallback por título, slug, descrição ou posição no array.
 */
export function resolveEcosystemService(
  reference: EcosystemServiceReference
): IndexedEcosystemService | null {
  const indexed = ecosystemServiceIndex.get(
    reference.ecosystemServiceId
  );

  if (!indexed) {
    return null;
  }

  if (indexed.category.id !== reference.ecosystemCategoryId) {
    return null;
  }

  return indexed;
}

/**
 * Resolve uma referência e lança erro quando a referência está inválida.
 *
 * Útil em testes, CI/CD e validações administrativas.
 */
export function requireEcosystemService(
  reference: EcosystemServiceReference
): IndexedEcosystemService {
  const resolved = resolveEcosystemService(reference);

  if (!resolved) {
    throw new Error(
      [
        "Invalid ecosystem service reference.",
        `category=${reference.ecosystemCategoryId}`,
        `service=${reference.ecosystemServiceId}`,
      ].join(" ")
    );
  }

  return resolved;
}

/* ============================================================================
 * 4. CONSULTA POR CATEGORIA
 * ========================================================================== */

export function getEcosystemCategory(
  categoryId: string
): ServiceCategory | null {
  return (
    tikvahServicesEcosystem.find(
      (category) => category.id === categoryId
    ) ?? null
  );
}

/* ============================================================================
 * 5. CONSULTA DOS SERVIÇOS DE UMA TAXONOMIA
 * ========================================================================== */

export function resolveTaxonomyServices(
  link: TaxonomyServiceLink
): IndexedEcosystemService[] {
  return link.ecosystemServices
    .map(resolveEcosystemService)
    .filter(
      (
        item
      ): item is IndexedEcosystemService => item !== null
    );
}

/* ============================================================================
 * 6. VALIDAÇÃO DAS REFERÊNCIAS
 * ========================================================================== */

export interface LinkageValidationError {
  code:
    | "EMPTY_TAXONOMY_ID"
    | "MISSING_CATEGORY"
    | "MISSING_SERVICE"
    | "CATEGORY_SERVICE_MISMATCH"
    | "DUPLICATE_REFERENCE";

  message: string;

  taxonomyId?: string;
  ecosystemCategoryId?: string;
  ecosystemServiceId?: string;
}

export function validateTaxonomyServiceLink(
  link: TaxonomyServiceLink
): LinkageValidationError[] {
  const errors: LinkageValidationError[] = [];

  if (!link.taxonomyId.trim()) {
    errors.push({
      code: "EMPTY_TAXONOMY_ID",
      message: "A referência possui taxonomyId vazio.",
    });
  }

  const referenceKeys = new Set<string>();

  for (const reference of link.ecosystemServices) {
    const key = [
      reference.ecosystemCategoryId,
      reference.ecosystemServiceId,
    ].join(":");

    if (referenceKeys.has(key)) {
      errors.push({
        code: "DUPLICATE_REFERENCE",
        message:
          `Referência duplicada: ${key}.`,
        taxonomyId: link.taxonomyId,
        ecosystemCategoryId:
          reference.ecosystemCategoryId,
        ecosystemServiceId:
          reference.ecosystemServiceId,
      });

      continue;
    }

    referenceKeys.add(key);

    const category = getEcosystemCategory(
      reference.ecosystemCategoryId
    );

    if (!category) {
      errors.push({
        code: "MISSING_CATEGORY",
        message:
          `Categoria inexistente: "${reference.ecosystemCategoryId}".`,
        taxonomyId: link.taxonomyId,
        ecosystemCategoryId:
          reference.ecosystemCategoryId,
        ecosystemServiceId:
          reference.ecosystemServiceId,
      });

      continue;
    }

    const service = category.items.find(
      (item) =>
        item.id === reference.ecosystemServiceId
    );

    if (!service) {
      errors.push({
        code: "MISSING_SERVICE",
        message:
          `Serviço "${reference.ecosystemServiceId}" ` +
          `não existe na categoria "${reference.ecosystemCategoryId}".`,
        taxonomyId: link.taxonomyId,
        ecosystemCategoryId:
          reference.ecosystemCategoryId,
        ecosystemServiceId:
          reference.ecosystemServiceId,
      });
    }
  }

  return errors;
}

/* ============================================================================
 * 7. VALIDAÇÃO GLOBAL
 * ========================================================================== */

export function validateTaxonomyServiceLinks(
  links: TaxonomyServiceLink[]
): LinkageValidationError[] {
  const errors: LinkageValidationError[] = [];

  const taxonomyIds = new Set<string>();

  for (const link of links) {
    if (taxonomyIds.has(link.taxonomyId)) {
      errors.push({
        code: "DUPLICATE_REFERENCE",
        message:
          `Taxonomy ID duplicado: "${link.taxonomyId}".`,
        taxonomyId: link.taxonomyId,
      });
    }

    taxonomyIds.add(link.taxonomyId);

    errors.push(
      ...validateTaxonomyServiceLink(link)
    );
  }

  return errors;
}

/* ============================================================================
 * 8. EXPORTAÇÃO DO ÍNDICE E METADADOS ESTRUTURAIS
 * ============================================================================
 *
 * Responsabilidade:
 * - Expor contadores derivados do catálogo comercial.
 * - Expor identificadores de categorias e serviços.
 * - Disponibilizar consultas seguras ao índice.
 * - Disponibilizar um resumo estrutural para observabilidade, testes e
 *   componentes administrativos.
 *
 * PRINCÍPIO DE ARQUITECTURA
 * -------------------------
 * `tikvahServicesEcosystem` permanece a fonte de verdade do catálogo
 * comercial.
 *
 * `ecosystemServiceIndex` é uma estrutura derivada para acesso eficiente.
 *
 * Nenhum valor comercial é criado, inferido ou duplicado nesta camada.
 *
 * ALINHAMENTO
 * -----------
 * Esta organização favorece:
 * - DRY — Don't Repeat Yourself;
 * - Single Source of Truth;
 * - separação entre dados-fonte e estruturas derivadas;
 * - rastreabilidade;
 * - testabilidade;
 * - controlo de alterações;
 * - observabilidade;
 * - manutenção segura.
 * ========================================================================== */


/* ============================================================================
 * 8.1 TIPOS DERIVADOS DO ÍNDICE
 * ========================================================================== */

/**
 * Representação de um serviço comercial juntamente com a respectiva
 * categoria no Ecossistema.
 *
 * Esta estrutura é derivada exclusivamente de:
 * - `tikvahServicesEcosystem`;
 * - `ecosystemServiceIndex`.
 *
 * Não contém dados comerciais adicionais.
 */
export interface IndexedEcosystemService {
  readonly category: ServiceCategory;
  readonly service: ServiceDetail;
}


/**
 * Resumo estrutural do catálogo comercial.
 *
 * Este tipo é destinado a:
 * - dashboards administrativos;
 * - testes automatizados;
 * - observabilidade;
 * - diagnósticos;
 * - documentação técnica;
 * - verificações de integridade;
 * - componentes internos de administração.
 *
 * Não deve ser utilizado como fonte de preços ou regras comerciais.
 */
export interface EcosystemCatalogSummary {
  readonly categoryCount: number;
  readonly serviceCount: number;
  readonly categoryIds: readonly string[];
  readonly serviceIds: readonly string[];
}


/* ============================================================================
 * 8.2 CONTADORES PRINCIPAIS
 * ========================================================================== */

/**
 * Número total de serviços comerciais actualmente indexados.
 *
 * A contagem deriva do índice operacional, evitando a existência de uma
 * segunda contagem manual.
 */
export const ecosystemServiceCount: number =
  ecosystemServiceIndex.size;


/**
 * Número total de categorias comerciais actualmente registadas.
 *
 * Derivado directamente da fonte de verdade do catálogo.
 */
export const ecosystemCategoryCount: number =
  tikvahServicesEcosystem.length;


/* ============================================================================
 * 8.3 IDENTIFICADORES DAS CATEGORIAS
 * ========================================================================== */

/**
 * Lista dos IDs das categorias comerciais.
 *
 * A lista é derivada directamente de `tikvahServicesEcosystem`.
 *
 * `Object.freeze()` fornece imutabilidade superficial em runtime,
 * enquanto `readonly` protege contra mutações no TypeScript.
 */
export const ecosystemCategoryIds: readonly string[] =
  Object.freeze(
    tikvahServicesEcosystem.map(
      (category) => category.id
    )
  );


/* ============================================================================
 * 8.4 IDENTIFICADORES DOS SERVIÇOS
 * ========================================================================== */

/**
 * Lista dos IDs dos serviços comerciais.
 *
 * A lista é derivada do índice operacional para garantir correspondência
 * com os serviços efectivamente indexados.
 */
export const ecosystemServiceIds: readonly string[] =
  Object.freeze(
    Array.from(
      ecosystemServiceIndex.keys()
    )
  );


/* ============================================================================
 * 8.5 CONSULTAS DO ÍNDICE
 * ========================================================================== */

/**
 * Retorna uma cópia da lista de serviços actualmente indexados.
 *
 * A estrutura interna do `Map` nunca é exposta directamente.
 *
 * @returns Lista dos serviços comerciais indexados.
 */
export function getIndexedEcosystemServices(): IndexedEcosystemService[] {
  return Array.from(
    ecosystemServiceIndex.values()
  );
}


/**
 * Procura um serviço comercial através do seu ID exacto.
 *
 * Não utiliza:
 * - correspondência aproximada;
 * - `includes`;
 * - pesquisa por título;
 * - pesquisa semântica;
 * - normalização implícita;
 * - fallback heurístico.
 *
 * Esta decisão é intencional para evitar associação incorrecta de serviços.
 *
 * @param serviceId ID exacto do serviço.
 * @returns Serviço indexado ou `null` caso não exista.
 */
export function getEcosystemServiceById(
  serviceId: string
): IndexedEcosystemService | null {
  if (
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    return null;
  }

  return (
    ecosystemServiceIndex.get(serviceId) ??
    null
  );
}


/**
 * Retorna todos os serviços pertencentes a uma categoria específica.
 *
 * A pesquisa da categoria é exacta.
 *
 * @param categoryId ID exacto da categoria.
 * @returns Serviços da categoria ou array vazio quando a categoria não existe.
 */
export function getEcosystemServicesByCategory(
  categoryId: string
): IndexedEcosystemService[] {
  if (
    typeof categoryId !== "string" ||
    categoryId.trim().length === 0
  ) {
    return [];
  }

  const category = tikvahServicesEcosystem.find(
    (item) => item.id === categoryId
  );

  if (!category) {
    return [];
  }

  return category.items.map(
    (service): IndexedEcosystemService => ({
      category,
      service,
    })
  );
}


/**
 * Verifica a existência de uma categoria comercial.
 *
 * @param categoryId ID exacto da categoria.
 */
export function ecosystemCategoryExists(
  categoryId: string
): boolean {
  if (
    typeof categoryId !== "string" ||
    categoryId.trim().length === 0
  ) {
    return false;
  }

  return tikvahServicesEcosystem.some(
    (category) => category.id === categoryId
  );
}


/**
 * Verifica a existência de um serviço comercial.
 *
 * @param serviceId ID exacto do serviço.
 */
export function ecosystemServiceExists(
  serviceId: string
): boolean {
  if (
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    return false;
  }

  return ecosystemServiceIndex.has(
    serviceId
  );
}


/**
 * Retorna a categoria à qual pertence um serviço.
 *
 * @param serviceId ID exacto do serviço.
 * @returns Categoria correspondente ou `null`.
 */
export function getCategoryForEcosystemService(
  serviceId: string
): ServiceCategory | null {
  if (
    typeof serviceId !== "string" ||
    serviceId.trim().length === 0
  ) {
    return null;
  }

  return (
    ecosystemServiceIndex.get(serviceId)
      ?.category ??
    null
  );
}


/**
 * Retorna o contexto completo de um serviço comercial.
 *
 * O contexto contém:
 * - categoria;
 * - serviço.
 *
 * @param serviceId ID exacto do serviço.
 * @returns Contexto comercial ou `null`.
 */
export function getEcosystemServiceContext(
  serviceId: string
): IndexedEcosystemService | null {
  return getEcosystemServiceById(
    serviceId
  );
}


/* ============================================================================
 * 8.6 RESUMO ESTRUTURAL
 * ========================================================================== */

/**
 * Resumo estrutural do Ecossistema.
 *
 * Útil para:
 * - dashboards administrativos;
 * - testes;
 * - observabilidade;
 * - diagnóstico;
 * - documentação técnica;
 * - health checks internos;
 * - auditoria estrutural.
 *
 * IMPORTANTE:
 * Este objecto não constitui fonte de verdade comercial.
 *
 * Preços, IVA, modalidades e regras de cliente devem continuar a ser
 * obtidos dos dados comerciais originais do Ecossistema.
 */
export const ecosystemCatalogSummary: EcosystemCatalogSummary =
  Object.freeze({
    categoryCount:
      ecosystemCategoryCount,

    serviceCount:
      ecosystemServiceCount,

    categoryIds:
      ecosystemCategoryIds,

    serviceIds:
      ecosystemServiceIds,
  });


/* ============================================================================
 * 8.7 METADADOS DO CATÁLOGO
 * ========================================================================== */

/**
 * IDs das categorias comerciais.
 *
 * Mantido como alias semântico para componentes de metadados e documentação.
 *
 * A origem permanece exclusivamente `tikvahServicesEcosystem`.
 */
export const serviceCatalogCategoryIds =
  ecosystemCategoryIds;


/**
 * Número de categorias comerciais.
 *
 * Não calcular novamente através do catálogo.
 */
export const serviceCatalogCategoryCount =
  ecosystemCategoryCount;


/**
 * Número de serviços comerciais.
 *
 * Derivado do índice operacional.
 */
export const serviceCatalogServiceCount =
  ecosystemServiceCount;


/* ============================================================================
 * 8.8 METADADOS ESTRUTURAIS CONSOLIDADOS
 * ========================================================================== */

/**
 * Metadados estruturais do catálogo comercial.
 *
 * Estes dados podem ser utilizados por:
 * - administração;
 * - documentação;
 * - testes;
 * - observabilidade;
 * - SEO técnico quando apropriado;
 * - diagnósticos.
 *
 * Não incluir aqui preços ou regras comerciais duplicadas.
 */
export const serviceCatalogStructure = Object.freeze({
  categoryCount:
    serviceCatalogCategoryCount,

  serviceCount:
    serviceCatalogServiceCount,

  categoryIds:
    serviceCatalogCategoryIds,

  serviceIds:
    ecosystemServiceIds,
});


/* ============================================================================
 * 8.9 VERIFICAÇÕES ESTRUTURAIS BÁSICAS
 * ========================================================================== */

/**
 * Verifica se uma lista contém apenas valores únicos.
 *
 * @param values Lista a verificar.
 */
function hasUniqueValues(
  values: readonly string[]
): boolean {
  return (
    new Set(values).size ===
    values.length
  );
}


/**
 * Verifica a consistência estrutural básica do catálogo.
 *
 * Esta função não substitui a validação de integridade comercial.
 * Ela verifica apenas invariantes estruturais fundamentais.
 */
export function validateEcosystemCatalogStructure(): boolean {
  const categoryIds =
    tikvahServicesEcosystem.map(
      (category) => category.id
    );

  const serviceIds =
    tikvahServicesEcosystem.flatMap(
      (category) =>
        category.items.map(
          (service) => service.id
        )
    );

  const indexedServiceIds =
    Array.from(
      ecosystemServiceIndex.keys()
    );

  const categoryCountMatches =
    ecosystemCategoryCount ===
    tikvahServicesEcosystem.length;

  const serviceCountMatches =
    ecosystemServiceCount ===
    serviceIds.length;

  const indexedCountMatches =
    ecosystemServiceCount ===
    indexedServiceIds.length;

  const categoriesAreUnique =
    hasUniqueValues(categoryIds);

  const servicesAreUnique =
    hasUniqueValues(serviceIds);

  const indexMatchesSource =
    serviceIds.length ===
      indexedServiceIds.length &&
    serviceIds.every(
      (id) =>
        ecosystemServiceIndex.has(id)
    );

  return (
    categoryCountMatches &&
    serviceCountMatches &&
    indexedCountMatches &&
    categoriesAreUnique &&
    servicesAreUnique &&
    indexMatchesSource
  );
}


/* ============================================================================
 * 8.10 ASSERTION PARA CI/CD E TESTES
 * ========================================================================== */

/**
 * Garante a integridade estrutural mínima do catálogo.
 *
 * Deve ser utilizada em:
 * - testes unitários;
 * - testes de integração;
 * - CI/CD;
 * - verificações de build, quando apropriado.
 *
 * Não deve ser utilizada para substituir uma validação completa do
 * catálogo comercial.
 *
 * @throws Error quando a estrutura do catálogo é inconsistente.
 */
export function assertEcosystemCatalogStructure(): void {
  if (
    !validateEcosystemCatalogStructure()
  ) {
    throw new Error(
      [
        "[ECOSYSTEM_CATALOG_INTEGRITY_ERROR]",
        "A estrutura do catálogo comercial é inconsistente.",
        "Verifique IDs duplicados, contagens divergentes ou divergências entre",
        "tikvahServicesEcosystem e ecosystemServiceIndex.",
      ].join(" ")
    );
  }
}