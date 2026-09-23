/**
 * ============================================================================
 * TESTES DE INTEGRIDADE — ECOSSISTEMA DE SERVIÇOS TIKVAH
 * ============================================================================
 *
 * @module services-ecosystem.test
 *
 * @description
 * Suite de testes unitários e de integridade estrutural do catálogo comercial
 * da Tikvah Psycem.
 *
 * OBJECTIVOS
 * ----------
 * Esta suite verifica:
 *
 * 1. Integridade estrutural do catálogo;
 * 2. Unicidade dos identificadores;
 * 3. Coerência dos contadores;
 * 4. Integridade dos preços;
 * 5. Validade das modalidades;
 * 6. Coerência entre modalidades permitidas e preços configurados;
 * 7. Integridade global do catálogo;
 * 8. Funcionamento da API de consulta do índice;
 * 9. Comportamento seguro perante IDs inexistentes;
 * 10. Contrato de execução da validação de integridade.
 *
 * PRINCÍPIOS
 * ----------
 * - Single Source of Truth;
 * - DRY;
 * - fail-fast;
 * - determinismo;
 * - rastreabilidade;
 * - validação explícita;
 * - ausência de inferência comercial;
 * - segurança por defeito;
 * - testabilidade;
 * - manutenção controlada.
 *
 * CONFORMIDADE / ALINHAMENTO
 * --------------------------
 * Os testes fazem parte de uma estratégia de qualidade e controlo de
 * alterações alinhada com boas práticas internacionais, incluindo:
 *
 * - ISO 9001 — gestão da qualidade e controlo de processos;
 * - ISO/IEC 27001 — integridade e controlo da informação;
 * - ISO/IEC/IEEE 29119 — práticas de teste de software;
 * - OWASP — princípios de desenvolvimento seguro;
 * - TypeScript — segurança de tipos em compilação;
 * - CI/CD — execução automatizada dos quality gates.
 *
 * NOTA
 * ----
 * "Alinhado com" não significa certificação formal.
 *
 * Estes testes não certificam a organização ou o software segundo qualquer
 * norma ISO. Eles implementam controlos técnicos compatíveis com princípios
 * de qualidade, integridade, rastreabilidade e controlo de alterações.
 * ============================================================================
 */

import {
  assertServiceCatalogIntegrity,
  ecosystemCatalogSummary,
  ecosystemCategoryCount,
  ecosystemCategoryExists,
  ecosystemCategoryIds,
  ecosystemServiceCount,
  ecosystemServiceExists,
  ecosystemServiceIds,
  getCategoryForEcosystemService,
  getEcosystemServiceById,
  getEcosystemServiceContext,
  getEcosystemServicesByCategory,
  getIndexedEcosystemServices,
  serviceCatalogCategoryCount,
  serviceCatalogCategoryIds,
  serviceCatalogServiceCount,
  tikvahServicesEcosystem,
  validateEcosystemCatalogStructure,
  validateServiceCatalogIntegrity,
} from "../services-ecosystem";


/* ============================================================================
 * 1. CONSTANTES DE TESTE
 * ========================================================================== */

const VALID_MODALITIES = [
  "online",
  "presencial",
  "hibrido",
] as const;


/* ============================================================================
 * 2. SUITE PRINCIPAL
 * ========================================================================== */

describe("Tikvah Services Ecosystem", () => {


  /* ==========================================================================
   * 2.1 ESTRUTURA GERAL
   * ======================================================================== */

  describe("estrutura do catálogo", () => {
    it("deve possuir pelo menos uma categoria comercial", () => {
      expect(
        tikvahServicesEcosystem.length
      ).toBeGreaterThan(0);
    });


    it("cada categoria deve possuir estrutura mínima válida", () => {
      for (const category of tikvahServicesEcosystem) {
        expect(category.id).toEqual(
          expect.any(String)
        );

        expect(category.id.trim()).not.toBe("");

        expect(category.title).toEqual(
          expect.any(String)
        );

        expect(category.title.trim()).not.toBe("");

        expect(
          Array.isArray(category.items)
        ).toBe(true);
      }
    });


    it("cada categoria deve possuir pelo menos um serviço", () => {
      for (const category of tikvahServicesEcosystem) {
        expect(category.items.length).toBeGreaterThan(0);
      }
    });


    it("cada serviço deve possuir estrutura mínima válida", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          expect(service.id).toEqual(
            expect.any(String)
          );

          expect(service.id.trim()).not.toBe("");

          expect(service.title).toEqual(
            expect.any(String)
          );

          expect(service.title.trim()).not.toBe("");

          expect(service.summary).toEqual(
            expect.any(String)
          );

          expect(service.descriptionFull).toEqual(
            expect.any(String)
          );

          expect(service.diferencial).toEqual(
            expect.any(String)
          );

          expect(service.competitividade).toEqual(
            expect.any(String)
          );
        }
      }
    });
  });


  /* ==========================================================================
   * 2.2 IDENTIFICADORES
   * ======================================================================== */

  describe("identificadores", () => {
    it("não deve possuir IDs de categorias duplicados", () => {
      const ids =
        tikvahServicesEcosystem.map(
          (category) => category.id
        );

      expect(
        new Set(ids).size
      ).toBe(ids.length);
    });


    it("não deve possuir IDs de serviços duplicados", () => {
      const ids =
        tikvahServicesEcosystem.flatMap(
          (category) =>
            category.items.map(
              (service) => service.id
            )
        );

      expect(
        new Set(ids).size
      ).toBe(ids.length);
    });


    it("todos os IDs de categorias devem ser strings não vazias", () => {
      for (const id of ecosystemCategoryIds) {
        expect(typeof id).toBe("string");
        expect(id.trim()).not.toBe("");
      }
    });


    it("todos os IDs de serviços devem ser strings não vazias", () => {
      for (const id of ecosystemServiceIds) {
        expect(typeof id).toBe("string");
        expect(id.trim()).not.toBe("");
      }
    });
  });


  /* ==========================================================================
   * 2.3 CONTADORES
   * ======================================================================== */

  describe("contadores derivados", () => {
    it("deve manter o número de categorias consistente", () => {
      expect(
        ecosystemCategoryCount
      ).toBe(
        tikvahServicesEcosystem.length
      );

      expect(
        serviceCatalogCategoryCount
      ).toBe(
        ecosystemCategoryCount
      );
    });


    it("deve manter o número de serviços consistente", () => {
      const actualServiceCount =
        tikvahServicesEcosystem.reduce(
          (total, category) =>
            total + category.items.length,
          0
        );

      expect(
        ecosystemServiceCount
      ).toBe(actualServiceCount);

      expect(
        serviceCatalogServiceCount
      ).toBe(actualServiceCount);
    });


    it("o número de IDs de categorias deve corresponder ao contador", () => {
      expect(
        ecosystemCategoryIds.length
      ).toBe(
        ecosystemCategoryCount
      );

      expect(
        serviceCatalogCategoryIds.length
      ).toBe(
        serviceCatalogCategoryCount
      );
    });


    it("o número de IDs de serviços deve corresponder ao contador", () => {
      expect(
        ecosystemServiceIds.length
      ).toBe(
        ecosystemServiceCount
      );
    });
  });


  /* ==========================================================================
   * 2.4 PREÇOS
   * ======================================================================== */

  describe("integridade dos preços", () => {
    it("deve possuir preço base numérico e não negativo", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          expect(
            typeof service.precoBaseMZN
          ).toBe("number");

          expect(
            Number.isFinite(
              service.precoBaseMZN
            )
          ).toBe(true);

          expect(
            service.precoBaseMZN
          ).toBeGreaterThanOrEqual(0);
        }
      }
    });


    it("deve possuir preços de modalidade numéricos e não negativos", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          for (const modalidade of VALID_MODALITIES) {
            const price =
              service.precosPorModalidade[
                modalidade
              ];

            expect(
              typeof price
            ).toBe("number");

            expect(
              Number.isFinite(price)
            ).toBe(true);

            expect(
              price
            ).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });


    it("deve possuir preços por tipo de cliente numéricos e não negativos", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          for (const price of Object.values(
            service.precosPorCliente
          )) {
            expect(
              typeof price
            ).toBe("number");

            expect(
              Number.isFinite(price)
            ).toBe(true);

            expect(
              price
            ).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });
  });


  /* ==========================================================================
   * 2.5 MODALIDADES
   * ======================================================================== */

  describe("modalidades", () => {
    it("deve possuir apenas modalidades suportadas", () => {
      const validModalities =
        new Set(VALID_MODALITIES);

      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          for (const modalidade of service.modalidadesPermitidas) {
            expect(
              validModalities.has(modalidade)
            ).toBe(true);
          }
        }
      }
    });


    it("não deve possuir modalidades duplicadas dentro do mesmo serviço", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          const modalities =
            service.modalidadesPermitidas;

          expect(
            new Set(modalities).size
          ).toBe(
            modalities.length
          );
        }
      }
    });


    it("cada modalidade permitida deve possuir preço superior a zero", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          for (const modalidade of service.modalidadesPermitidas) {
            expect(
              service.precosPorModalidade[
                modalidade
              ]
            ).toBeGreaterThan(0);
          }
        }
      }
    });


    it("modalidades não permitidas podem possuir preço zero", () => {
      /*
       * Este teste documenta deliberadamente uma regra do modelo comercial:
       *
       * preço zero NÃO significa necessariamente serviço gratuito.
       *
       * Pode significar que a modalidade não é aplicável ao serviço.
       *
       * Portanto, não devemos impor:
       *
       *   preço > 0
       *
       * para todas as modalidades.
       */
      expect(true).toBe(true);
    });
  });


  /* ==========================================================================
   * 2.6 INTEGRIDADE DO ÍNDICE
   * ======================================================================== */

  describe("índice de serviços", () => {
    it("deve possuir a mesma quantidade de serviços que o catálogo", () => {
      expect(
        getIndexedEcosystemServices().length
      ).toBe(
        ecosystemServiceCount
      );
    });


    it("todos os serviços do catálogo devem existir no índice", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          expect(
            ecosystemServiceExists(service.id)
          ).toBe(true);

          expect(
            getEcosystemServiceById(service.id)
          ).not.toBeNull();
        }
      }
    });


    it("nenhum serviço inexistente deve ser encontrado", () => {
      expect(
        ecosystemServiceExists(
          "__service_id_that_does_not_exist__"
        )
      ).toBe(false);

      expect(
        getEcosystemServiceById(
          "__service_id_that_does_not_exist__"
        )
      ).toBeNull();
    });


    it("deve retornar o contexto correcto de cada serviço", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          const context =
            getEcosystemServiceContext(
              service.id
            );

          expect(context).not.toBeNull();

          expect(
            context?.service.id
          ).toBe(service.id);

          expect(
            context?.category.id
          ).toBe(category.id);
        }
      }
    });
  });


  /* ==========================================================================
   * 2.7 CONSULTAS POR CATEGORIA
   * ======================================================================== */

  describe("consultas por categoria", () => {
    it("deve reconhecer categorias existentes", () => {
      for (const category of tikvahServicesEcosystem) {
        expect(
          ecosystemCategoryExists(
            category.id
          )
        ).toBe(true);
      }
    });


    it("deve rejeitar categorias inexistentes", () => {
      expect(
        ecosystemCategoryExists(
          "__category_that_does_not_exist__"
        )
      ).toBe(false);
    });


    it("deve retornar os serviços correctos de cada categoria", () => {
      for (const category of tikvahServicesEcosystem) {
        const services =
          getEcosystemServicesByCategory(
            category.id
          );

        expect(
          services.length
        ).toBe(
          category.items.length
        );

        expect(
          services.every(
            ({ category: resultCategory }) =>
              resultCategory.id ===
              category.id
          )
        ).toBe(true);
      }
    });


    it("deve retornar lista vazia para categoria inexistente", () => {
      expect(
        getEcosystemServicesByCategory(
          "__category_that_does_not_exist__"
        )
      ).toEqual([]);
    });
  });


  /* ==========================================================================
   * 2.8 RELAÇÃO SERVIÇO → CATEGORIA
   * ======================================================================== */

  describe("relação serviço-categoria", () => {
    it("cada serviço deve possuir uma categoria válida", () => {
      for (const category of tikvahServicesEcosystem) {
        for (const service of category.items) {
          const result =
            getCategoryForEcosystemService(
              service.id
            );

          expect(result).not.toBeNull();

          expect(result?.id).toBe(
            category.id
          );
        }
      }
    });


    it("deve retornar null para serviço inexistente", () => {
      expect(
        getCategoryForEcosystemService(
          "__service_that_does_not_exist__"
        )
      ).toBeNull();
    });
  });


  /* ==========================================================================
   * 2.9 VALIDAÇÃO ESTRUTURAL
   * ======================================================================== */

  describe("validação estrutural", () => {
    it("deve passar a validação estrutural do catálogo", () => {
      expect(
        validateEcosystemCatalogStructure()
      ).toBe(true);
    });
  });


  /* ==========================================================================
   * 2.10 VALIDAÇÃO GLOBAL
   * ======================================================================== */

  describe("validação global de integridade", () => {
    it("deve produzir um relatório válido", () => {
      const report =
        validateServiceCatalogIntegrity();

      expect(report.valid).toBe(true);

      expect(report.errors).toHaveLength(0);
    });


    it("não deve produzir erros de integridade", () => {
      const report =
        validateServiceCatalogIntegrity();

      expect(
        report.errors
      ).toEqual([]);
    });


    it("deve passar pelo assert de integridade", () => {
      expect(() => {
        assertServiceCatalogIntegrity();
      }).not.toThrow();
    });
  });


  /* ==========================================================================
   * 2.11 RESUMO ESTRUTURAL
   * ======================================================================== */

  describe("resumo estrutural", () => {
    it("deve possuir contadores coerentes", () => {
      expect(
        ecosystemCatalogSummary.categoryCount
      ).toBe(
        ecosystemCategoryCount
      );

      expect(
        ecosystemCatalogSummary.serviceCount
      ).toBe(
        ecosystemServiceCount
      );
    });


    it("deve possuir IDs de categorias coerentes", () => {
      expect(
        ecosystemCatalogSummary.categoryIds
      ).toEqual(
        ecosystemCategoryIds
      );
    });


    it("deve possuir IDs de serviços coerentes", () => {
      expect(
        ecosystemCatalogSummary.serviceIds
      ).toEqual(
        ecosystemServiceIds
      );
    });
  });


  /* ==========================================================================
   * 2.12 ENTRADAS INVÁLIDAS
   * ======================================================================== */

  describe("robustez perante entradas inválidas", () => {
    it("deve rejeitar ID de serviço vazio", () => {
      expect(
        getEcosystemServiceById("")
      ).toBeNull();

      expect(
        ecosystemServiceExists("")
      ).toBe(false);
    });


    it("deve rejeitar ID de serviço composto apenas por espaços", () => {
      expect(
        getEcosystemServiceById("   ")
      ).toBeNull();

      expect(
        ecosystemServiceExists("   ")
      ).toBe(false);
    });


    it("deve rejeitar ID de categoria vazio", () => {
      expect(
        ecosystemCategoryExists("")
      ).toBe(false);

      expect(
        getEcosystemServicesByCategory("")
      ).toEqual([]);
    });


    it("deve rejeitar ID de categoria composto apenas por espaços", () => {
      expect(
        ecosystemCategoryExists("   ")
      ).toBe(false);

      expect(
        getEcosystemServicesByCategory("   ")
      ).toEqual([]);
    });
  });
});