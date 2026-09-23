/**
 * ============================================================================
 * TIKVAH PSYCEM — CMS LOADER
 * ============================================================================
 *
 * Responsabilidade:
 * - Carregar o catálogo CMS estático uma única vez.
 * - Validar a estrutura antes de disponibilizá-la à aplicação.
 * - Evitar carregamentos concorrentes duplicados (single-flight).
 * - Manter uma referência imutável em memória.
 * - Não executar trabalho de I/O durante renders React.
 * - Não alterar preços, IVA, modalidades ou dados comerciais.
 *
 * Fonte de dados:
 *   src/data/tikvah-services-cms.json
 *
 * Princípio:
 *   JSON → Loader → Validação → Cache em memória → Aplicação
 *
 * IMPORTANTE:
 * Este módulo não é responsável por inventar, corrigir ou completar
 * informações comerciais. O CMS permanece a fonte de verdade.
 * ============================================================================
 */

import cmsCatalog from "@/data/tikvah-services-cms.json";

/* ============================================================================
 * 1. TIPOS
 * ========================================================================== */

export type ModalidadeTipo =
  | "online"
  | "presencial"
  | "hibrido";

export type ClienteTipo =
  | "empresas"
  | "individualidades"
  | "familia"
  | "casal"
  | "ong"
  | "associacoes";

export interface PrecoConfigurado {
  online?: number;
  presencial?: number;
  hibrido?: number;
}

export interface PrecoPorCliente {
  empresas: number | null;
  individualidades: number | null;
  familia: number | null;
  casal: number | null;
  ong: number | null;
  associacoes: number | null;
}

export interface ServiceDetailCMS {
  id: string;
  title: string;
  summary: string;
  descriptionFull: string;
  diferencial: string;
  competitividade: string;

  modalidadesPermitidas: ModalidadeTipo[];

  precoBaseMZN: number;

  precoComIvaMZN?: number;

  precosPorModalidade: PrecoConfigurado;

  precosPorCliente: PrecoPorCliente;
}

export interface ServiceCategoryCMS {
  id: string;
  title: string;
  items: ServiceDetailCMS[];
}

export interface TikvahServicesCMS {
  schemaVersion: string;
  catalogVersion: string;
  status: string;
  locale: string;
  country: string;
  currency: string;

  tax: {
    type: string;
    rate: number;
    ratePercent: number;
  };

  governance?: {
    commercialSourceOfTruth?: boolean;
    allowClientSidePriceMutation?: boolean;
    allowImplicitServiceMatching?: boolean;
    pricingModel?: string;
    nullPriceMeaning?: string;
  };

  performance?: {
    staticData?: boolean;
    clientMutation?: boolean;
    recommendedLoading?: string;
    recommendedCaching?: string;
  };

  tikvahpsycemEcosystemDescription?: string;
  tikvahModel360Text?: string;

  categories: ServiceCategoryCMS[];
}

/* ============================================================================
 * 2. CONSTANTES
 * ========================================================================== */

const VALID_MODALITIES: readonly ModalidadeTipo[] = [
  "online",
  "presencial",
  "hibrido",
] as const;

const VALID_CLIENT_TYPES: readonly ClienteTipo[] = [
  "empresas",
  "individualidades",
  "familia",
  "casal",
  "ong",
  "associacoes",
] as const;

const EXPECTED_CURRENCY = "MZN";
const EXPECTED_COUNTRY = "MZ";

/* ============================================================================
 * 3. ERRO ESPECÍFICO DO CMS
 * ========================================================================== */

export class CMSLoaderError extends Error {
  public readonly code: string;

  constructor(message: string, code = "CMS_LOAD_ERROR") {
    super(message);

    this.name = "CMSLoaderError";
    this.code = code;

    Object.setPrototypeOf(this, CMSLoaderError.prototype);
  }
}

/* ============================================================================
 * 4. TYPE GUARDS
 * ========================================================================== */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidModality(value: unknown): value is ModalidadeTipo {
  return (
    typeof value === "string" &&
    (VALID_MODALITIES as readonly string[]).includes(value)
  );
}

function isValidClientType(value: unknown): value is ClienteTipo {
  return (
    typeof value === "string" &&
    (VALID_CLIENT_TYPES as readonly string[]).includes(value)
  );
}

/* ============================================================================
 * 5. VALIDAÇÃO DE PREÇOS
 * ========================================================================== */

function validateClientPrices(
  prices: unknown,
  context: string,
): void {
  if (!isRecord(prices)) {
    throw new CMSLoaderError(
      `${context}: "precosPorCliente" deve ser um objeto.`,
      "CMS_INVALID_CLIENT_PRICES",
    );
  }

  for (const clientType of VALID_CLIENT_TYPES) {
    if (!(clientType in prices)) {
      throw new CMSLoaderError(
        `${context}: preço de cliente ausente para "${clientType}".`,
        "CMS_MISSING_CLIENT_PRICE",
      );
    }

    const value = prices[clientType];

    if (value !== null && !isFiniteNumber(value)) {
      throw new CMSLoaderError(
        `${context}: preço inválido para cliente "${clientType}".`,
        "CMS_INVALID_CLIENT_PRICE",
      );
    }

    if (typeof value === "number" && value < 0) {
      throw new CMSLoaderError(
        `${context}: preço negativo para cliente "${clientType}".`,
        "CMS_NEGATIVE_CLIENT_PRICE",
      );
    }
  }
}

function validateModalityPrices(
  service: ServiceDetailCMS,
  context: string,
): void {
  if (!isRecord(service.precosPorModalidade)) {
    throw new CMSLoaderError(
      `${context}: "precosPorModalidade" deve ser um objeto.`,
      "CMS_INVALID_MODALITY_PRICES",
    );
  }

  const allowedModalities = service.modalidadesPermitidas;

  for (const modality of allowedModalities) {
    const price =
      service.precosPorModalidade[modality];

    if (!isFiniteNumber(price)) {
      throw new CMSLoaderError(
        `${context}: preço inválido para modalidade "${modality}".`,
        "CMS_INVALID_MODALITY_PRICE",
      );
    }

    if (price <= 0) {
      throw new CMSLoaderError(
        `${context}: preço deve ser superior a zero para "${modality}".`,
        "CMS_NON_POSITIVE_MODALITY_PRICE",
      );
    }
  }

  for (const key of Object.keys(service.precosPorModalidade)) {
    if (!isValidModality(key)) {
      throw new CMSLoaderError(
        `${context}: modalidade desconhecida "${key}".`,
        "CMS_UNKNOWN_MODALITY",
      );
    }
  }
}

/* ============================================================================
 * 6. VALIDAÇÃO DO SERVIÇO
 * ========================================================================== */

function validateService(
  value: unknown,
  categoryId: string,
  serviceIndex: number,
): asserts value is ServiceDetailCMS {
  const context =
    `Categoria "${categoryId}", serviço #${serviceIndex + 1}`;

  if (!isRecord(value)) {
    throw new CMSLoaderError(
      `${context}: serviço inválido.`,
      "CMS_INVALID_SERVICE",
    );
  }

  const requiredStrings = [
    "id",
    "title",
    "summary",
    "descriptionFull",
    "diferencial",
    "competitividade",
  ] as const;

  for (const field of requiredStrings) {
    if (!isNonEmptyString(value[field])) {
      throw new CMSLoaderError(
        `${context}: campo "${field}" ausente ou inválido.`,
        "CMS_INVALID_SERVICE_FIELD",
      );
    }
  }

  if (!Array.isArray(value.modalidadesPermitidas)) {
    throw new CMSLoaderError(
      `${context}: "modalidadesPermitidas" deve ser um array.`,
      "CMS_INVALID_MODALITIES",
    );
  }

  if (value.modalidadesPermitidas.length === 0) {
    throw new CMSLoaderError(
      `${context}: o serviço deve possuir pelo menos uma modalidade.`,
      "CMS_EMPTY_MODALITIES",
    );
  }

  const modalitySet = new Set<string>();

  for (const modality of value.modalidadesPermitidas) {
    if (!isValidModality(modality)) {
      throw new CMSLoaderError(
        `${context}: modalidade inválida "${String(modality)}".`,
        "CMS_INVALID_MODALITY",
      );
    }

    if (modalitySet.has(modality)) {
      throw new CMSLoaderError(
        `${context}: modalidade duplicada "${modality}".`,
        "CMS_DUPLICATE_MODALITY",
      );
    }

    modalitySet.add(modality);
  }

  if (!isFiniteNumber(value.precoBaseMZN)) {
    throw new CMSLoaderError(
      `${context}: "precoBaseMZN" inválido.`,
      "CMS_INVALID_BASE_PRICE",
    );
  }

  if (value.precoBaseMZN < 0) {
    throw new CMSLoaderError(
      `${context}: "precoBaseMZN" não pode ser negativo.`,
      "CMS_NEGATIVE_BASE_PRICE",
    );
  }

  if (
    value.precoComIvaMZN !== undefined &&
    !isFiniteNumber(value.precoComIvaMZN)
  ) {
    throw new CMSLoaderError(
      `${context}: "precoComIvaMZN" inválido.`,
      "CMS_INVALID_VAT_PRICE",
    );
  }

  validateModalityPrices(
    value as unknown as ServiceDetailCMS,
    context,
  );

  validateClientPrices(
    value.precosPorCliente,
    context,
  );
}

/* ============================================================================
 * 7. VALIDAÇÃO DA CATEGORIA
 * ========================================================================== */

function validateCategory(
  value: unknown,
  categoryIndex: number,
): asserts value is ServiceCategoryCMS {
  const context = `Categoria #${categoryIndex + 1}`;

  if (!isRecord(value)) {
    throw new CMSLoaderError(
      `${context}: estrutura inválida.`,
      "CMS_INVALID_CATEGORY",
    );
  }

  if (!isNonEmptyString(value.id)) {
    throw new CMSLoaderError(
      `${context}: "id" inválido.`,
      "CMS_INVALID_CATEGORY_ID",
    );
  }

  if (!isNonEmptyString(value.title)) {
    throw new CMSLoaderError(
      `${context}: "title" inválido.`,
      "CMS_INVALID_CATEGORY_TITLE",
    );
  }

  if (!Array.isArray(value.items)) {
    throw new CMSLoaderError(
      `${context}: "items" deve ser um array.`,
      "CMS_INVALID_CATEGORY_ITEMS",
    );
  }

  const serviceIds = new Set<string>();

  value.items.forEach((service, serviceIndex) => {
    validateService(
      service,
      value.id as string,
      serviceIndex,
    );

    const serviceId = service.id as string;

    if (serviceIds.has(serviceId)) {
      throw new CMSLoaderError(
        `${context}: ID de serviço duplicado "${serviceId}".`,
        "CMS_DUPLICATE_SERVICE_ID",
      );
    }

    serviceIds.add(serviceId);
  });
}

/* ============================================================================
 * 8. VALIDAÇÃO GLOBAL DO CATÁLOGO
 * ========================================================================== */

function validateCatalog(
  value: unknown,
): asserts value is TikvahServicesCMS {
  if (!isRecord(value)) {
    throw new CMSLoaderError(
      "O catálogo CMS não possui uma estrutura de objeto válida.",
      "CMS_INVALID_ROOT",
    );
  }

  const requiredRootStrings = [
    "schemaVersion",
    "catalogVersion",
    "status",
    "locale",
    "country",
    "currency",
  ] as const;

  for (const field of requiredRootStrings) {
    if (!isNonEmptyString(value[field])) {
      throw new CMSLoaderError(
        `Campo raiz "${field}" ausente ou inválido.`,
        "CMS_INVALID_ROOT_FIELD",
      );
    }
  }

  if (value.country !== EXPECTED_COUNTRY) {
    throw new CMSLoaderError(
      `País CMS inesperado: "${String(value.country)}".`,
      "CMS_INVALID_COUNTRY",
    );
  }

  if (value.currency !== EXPECTED_CURRENCY) {
    throw new CMSLoaderError(
      `Moeda CMS inesperada: "${String(value.currency)}".`,
      "CMS_INVALID_CURRENCY",
    );
  }

  if (!isRecord(value.tax)) {
    throw new CMSLoaderError(
      'Objeto "tax" ausente ou inválido.',
      "CMS_INVALID_TAX",
    );
  }

  if (!isFiniteNumber(value.tax.rate)) {
    throw new CMSLoaderError(
      'Taxa IVA "rate" inválida.',
      "CMS_INVALID_TAX_RATE",
    );
  }

  if (!isFiniteNumber(value.tax.ratePercent)) {
    throw new CMSLoaderError(
      'Taxa IVA "ratePercent" inválida.',
      "CMS_INVALID_TAX_PERCENT",
    );
  }

  if (!Array.isArray(value.categories)) {
    throw new CMSLoaderError(
      '"categories" deve ser um array.',
      "CMS_INVALID_CATEGORIES",
    );
  }

  if (value.categories.length === 0) {
    throw new CMSLoaderError(
      "O catálogo CMS não possui categorias.",
      "CMS_EMPTY_CATALOG",
    );
  }

  const categoryIds = new Set<string>();
  const serviceIds = new Set<string>();

  value.categories.forEach((category, categoryIndex) => {
    validateCategory(category, categoryIndex);

    const categoryId = category.id as string;

    if (categoryIds.has(categoryId)) {
      throw new CMSLoaderError(
        `ID de categoria duplicado "${categoryId}".`,
        "CMS_DUPLICATE_CATEGORY_ID",
      );
    }

    categoryIds.add(categoryId);

    for (const service of category.items) {
      const serviceId = service.id as string;

      if (serviceIds.has(serviceId)) {
        throw new CMSLoaderError(
          `ID de serviço duplicado globalmente "${serviceId}".`,
          "CMS_DUPLICATE_GLOBAL_SERVICE_ID",
        );
      }

      serviceIds.add(serviceId);
    }
  });
}

/* ============================================================================
 * 9. ESTADO SINGLETON
 * ========================================================================== */

let validatedCatalog: Readonly<TikvahServicesCMS> | null = null;

let loadingPromise:
  | Promise<Readonly<TikvahServicesCMS>>
  | null = null;

/* ============================================================================
 * 10. CARREGAMENTO INTERNO
 * ========================================================================== */

function loadCatalogInternal(): Readonly<TikvahServicesCMS> {
  if (validatedCatalog !== null) {
    return validatedCatalog;
  }

  validateCatalog(cmsCatalog);

  /*
   * Não fazemos JSON.parse(JSON.stringify(...)).
   *
   * O import estático do Vite já disponibiliza o objeto em memória.
   * Deep-clone aqui seria trabalho desnecessário e aumentaria o consumo
   * de CPU/memória.
   *
   * A aplicação deve tratar este objeto como somente leitura.
   */

  validatedCatalog = cmsCatalog;

  return validatedCatalog;
}

/* ============================================================================
 * 11. API PRINCIPAL
 * ========================================================================== */

/**
 * Carrega o catálogo CMS.
 *
 * Características:
 * - síncrono;
 * - sem fetch;
 * - sem rede;
 * - sem I/O durante render;
 * - valida apenas uma vez;
 * - reutiliza a mesma referência em chamadas seguintes.
 */
export function loadCMSCatalog(): Readonly<TikvahServicesCMS> {
  return loadCatalogInternal();
}

/**
 * Versão assíncrona da API.
 *
 * Útil quando o consumidor já trabalha com APIs assíncronas.
 *
 * O Promise é reutilizado para impedir que múltiplas chamadas concorrentes
 * executem a validação várias vezes.
 */
export function loadCMSCatalogAsync(): Promise<
  Readonly<TikvahServicesCMS>
> {
  if (validatedCatalog !== null) {
    return Promise.resolve(validatedCatalog);
  }

  if (loadingPromise !== null) {
    return loadingPromise;
  }

  loadingPromise = Promise.resolve().then(() => {
    try {
      return loadCatalogInternal();
    } catch (error) {
      loadingPromise = null;
      throw error;
    }
  });

  return loadingPromise;
}

/* ============================================================================
 * 12. INVALIDAÇÃO CONTROLADA
 * ========================================================================== */

/**
 * Limpa o estado de cache em memória.
 *
 * NÃO deve ser utilizado em componentes React a cada render.
 *
 * Destina-se principalmente a:
 * - testes;
 * - hot reload controlado;
 * - ambientes administrativos que substituam explicitamente o catálogo.
 */
export function resetCMSCatalogCache(): void {
  validatedCatalog = null;
  loadingPromise = null;
}

/* ============================================================================
 * 13. CONSULTAS DE ALTO NÍVEL
 * ========================================================================== */

/**
 * Obtém todas as categorias.
 *
 * A referência retornada é a mesma do catálogo validado.
 */
export function getCMSCategories(): readonly ServiceCategoryCMS[] {
  return loadCMSCatalog().categories;
}

/**
 * Obtém um serviço pelo ID.
 *
 * Não utiliza includes(), fuzzy matching ou correspondência implícita.
 */
export function getCMSServiceById(
  serviceId: string,
): ServiceDetailCMS | null {
  if (!isNonEmptyString(serviceId)) {
    return null;
  }

  const catalog = loadCMSCatalog();

  for (const category of catalog.categories) {
    for (const service of category.items) {
      if (service.id === serviceId) {
        return service;
      }
    }
  }

  return null;
}

/**
 * Obtém uma categoria pelo ID.
 */
export function getCMSCategoryById(
  categoryId: string,
): ServiceCategoryCMS | null {
  if (!isNonEmptyString(categoryId)) {
    return null;
  }

  const catalog = loadCMSCatalog();

  return (
    catalog.categories.find(
      (category) => category.id === categoryId,
    ) ?? null
  );
}

/**
 * Obtém os serviços de uma categoria.
 */
export function getCMSServicesByCategory(
  categoryId: string,
): readonly ServiceDetailCMS[] {
  const category = getCMSCategoryById(categoryId);

  return category?.items ?? [];
}

/* ============================================================================
 * 14. ÍNDICE EM MEMÓRIA
 * ========================================================================== */

let serviceIndex:
  | ReadonlyMap<string, ServiceDetailCMS>
  | null = null;

let categoryIndex:
  | ReadonlyMap<string, ServiceCategoryCMS>
  | null = null;

function buildIndexes(): void {
  if (serviceIndex !== null && categoryIndex !== null) {
    return;
  }

  const catalog = loadCMSCatalog();

  const services = new Map<string, ServiceDetailCMS>();
  const categories = new Map<string, ServiceCategoryCMS>();

  for (const category of catalog.categories) {
    categories.set(category.id, category);

    for (const service of category.items) {
      services.set(service.id, service);
    }
  }

  serviceIndex = services;
  categoryIndex = categories;
}

/**
 * Pesquisa direta O(1) depois da construção inicial do índice.
 */
export function getIndexedCMSServiceById(
  serviceId: string,
): ServiceDetailCMS | null {
  if (!isNonEmptyString(serviceId)) {
    return null;
  }

  buildIndexes();

  return serviceIndex?.get(serviceId) ?? null;
}

/**
 * Pesquisa direta O(1) depois da construção inicial do índice.
 */
export function getIndexedCMSCategoryById(
  categoryId: string,
): ServiceCategoryCMS | null {
  if (!isNonEmptyString(categoryId)) {
    return null;
  }

  buildIndexes();

  return categoryIndex?.get(categoryId) ?? null;
}

/* ============================================================================
 * 15. ESTATÍSTICAS DO CATÁLOGO
 * ========================================================================== */

export interface CMSCatalogStats {
  readonly categoryCount: number;
  readonly serviceCount: number;
  readonly schemaVersion: string;
  readonly catalogVersion: string;
  readonly locale: string;
  readonly country: string;
  readonly currency: string;
}

export function getCMSCatalogStats(): CMSCatalogStats {
  const catalog = loadCMSCatalog();

  let serviceCount = 0;

  for (const category of catalog.categories) {
    serviceCount += category.items.length;
  }

  return {
    categoryCount: catalog.categories.length,
    serviceCount,
    schemaVersion: catalog.schemaVersion,
    catalogVersion: catalog.catalogVersion,
    locale: catalog.locale,
    country: catalog.country,
    currency: catalog.currency,
  };
}

/* ============================================================================
 * 16. HEALTH CHECK
 * ========================================================================== */

export interface CMSHealth {
  readonly ok: boolean;
  readonly loaded: boolean;
  readonly validated: boolean;
  readonly categories: number;
  readonly services: number;
  readonly error: string | null;
}

/**
 * Health check seguro para observabilidade/testes.
 *
 * Não lança exceção: devolve estado operacional.
 */
export function getCMSHealth(): CMSHealth {
  try {
    const stats = getCMSCatalogStats();

    return {
      ok: true,
      loaded: true,
      validated: true,
      categories: stats.categoryCount,
      services: stats.serviceCount,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      loaded: false,
      validated: false,
      categories: 0,
      services: 0,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido no CMS.",
    };
  }
}

/* ============================================================================
 * 17. EXPORTAÇÃO PADRÃO
 * ========================================================================== */

export default loadCMSCatalog;