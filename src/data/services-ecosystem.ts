/**
 * Tikvah Psycem — Ecossistema de Serviços
 * -----------------------------------------------------------------------------
 * Fonte comercial canónica do catálogo de serviços.
 *
 * OBJETIVOS DE ENGENHARIA
 * - manter uma única fonte de verdade para preços e condições comerciais;
 * - assegurar tipagem forte e validação estrutural;
 * - impedir IDs duplicados e referências comerciais inconsistentes;
 * - separar dados, regras de domínio, indexação e apresentação;
 * - facilitar auditoria, testes automatizados e evolução controlada.
 *
 * ALINHAMENTO DE BOAS PRÁTICAS
 * - ISO 9001: gestão da qualidade, rastreabilidade e controlo de alterações;
 * - ISO/IEC 27001: integridade, minimização de exposição e governação de dados;
 * - OWASP ASVS: validação explícita e ausência de confiança implícita em input;
 * - WCAG 2.2: os dados são neutros à apresentação; acessibilidade é aplicada na UI.
 *
 * IMPORTANTE
 * Este ficheiro foi estruturado segundo boas práticas compatíveis com os referenciais
 * acima. Isso NÃO significa certificação ISO da organização ou da aplicação.
 *
 * POLÍTICA DE DADOS
 * - Não inventar preços, modalidades, segmentos de cliente ou serviços.
 * - Alterações comerciais devem ocorrer neste catálogo e ser revistas por controlo
 *   de mudança.
 * - A camada de UI deve consumir estes dados; não deve recalcular nem substituir
 *   valores comerciais por lógica local.
 */

/* ============================================================================
 * 1. CONSTANTES DE DOMÍNIO
 * ========================================================================== */

export const IVA = 0.16 as const;
export const CURRENCY = "MZN" as const;
export const LOCALE = "pt-MZ" as const;
export const COUNTRY = "MZ" as const;

export const MODALIDADES = [
  "online",
  "presencial",
  "hibrido",
] as const;

export const CLIENTES = [
  "empresas",
  "individualidades",
  "familia",
  "casal",
  "ong",
  "associacoes",
] as const;

export type ModalidadeTipo = (typeof MODALIDADES)[number];
export type ClienteTipo = (typeof CLIENTES)[number];

/* ============================================================================
 * 2. TIPOS
 * ========================================================================== */

export type PrecoMZN = number;
export type PrecoClienteMZN = number | null;

export type PrecosPorModalidade = Readonly<
  Partial<Record<ModalidadeTipo, PrecoMZN>>
>;

export type PrecosPorCliente = Readonly<
  Record<ClienteTipo, PrecoClienteMZN>
>;

export interface ServiceDetail {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly descriptionFull: string;
  readonly diferencial: string;
  readonly competitividade: string;
  readonly modalidadesPermitidas: readonly ModalidadeTipo[];
  readonly precoBaseMZN: PrecoMZN;
  readonly precoComIvaMZN: PrecoMZN;
  readonly precosPorModalidade: PrecosPorModalidade;
  readonly precosPorCliente: PrecosPorCliente;
}

export interface ServiceCategory {
  readonly id: string;
  readonly title: string;
  readonly items: readonly ServiceDetail[];
}

export interface IndexedEcosystemService {
  readonly category: ServiceCategory;
  readonly service: ServiceDetail;
}

export interface ServiceCatalogValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface ServiceCatalogIntegrityReport
  extends ServiceCatalogValidationResult {
  readonly categoryCount: number;
  readonly serviceCount: number;
  readonly checkedAt: string;
}

/* ============================================================================
 * 3. METADADOS DO CATÁLOGO
 * ========================================================================== */

export const serviceCatalogMetadata = Object.freeze({
  name: "Ecossistema de Serviços Tikvah Psycem",
  organization: "Tikvah Psycem",
  description:
    "A Tikvah Psycem estrutura os seus serviços como um ecossistema integrado, pensado para gerar impacto mensurável em pessoas, organizações e comunidades. Aliamos psicologia fundamentada em evidência, gestão estratégica, tecnologia, direito, finanças e responsabilidade social num modelo de intervenção centrado em eficiência, rigor técnico e sustentabilidade.",
  model360:
    "A Tikvah Psycem integra saúde mental, terapia da fala (incluindo Língua Gestual), terapia ocupacional, formação, estágios, voluntariado, gestão empresarial, gestão de negócios, recursos humanos, fiscalidade, contabilidade, tecnologia, direito, responsabilidade social e comunidade num único modelo de intervenção 360°. Cada intervenção é desenhada de forma estratégica, com base em diagnóstico rigoroso, acompanhamento contínuo e avaliação sistemática de impacto, adaptada ao contexto institucional, económico e cultural em que a organização atua.",
  locale: LOCALE,
  country: COUNTRY,
  currency: CURRENCY,
  taxRate: IVA,
  taxRatePercent: IVA * 100,
  status: "active" as const,
  governance: Object.freeze({
    commercialSourceOfTruth: true,
    pricingMayBeInventedByConsumers: false,
    linkagePolicy: "explicit-id-only" as const,
  }),
});

/* ============================================================================
 * 4. DADOS COMERCIAIS — FONTE DE VERDADE
 * ========================================================================== */

/**
 * Os valores abaixo foram preservados do ficheiro fornecido.
 * `satisfies` valida a forma do objeto sem destruir a inferência literal.
 */
export const tikvahServicesEcosystem: readonly ServiceCategory[] = [
  {
    "id": "saude-mental-reabilitacao",
    "title": "Saúde mental, reabilitação e intervenção",
    "items": [
      {
        "id": "psicologia-clinica",
        "title": "Psicologia clínica, social e organizacional",
        "summary": "Avaliação psicológica, formulação de caso e planeamento de intervenção individualizado continuado.",
        "descriptionFull": "Serviço de alta complexidade focado no diagnóstico clínico, mapeamento de competências socioemocionais e intervenção continuada. Atua diretamente sobre o desenvolvimento da resiliência, mitigação de sintomas de ansiedade e depressão, e otimização do desempenho comportamental em contextos pessoais e corporativos de alta pressão.",
        "diferencial": "Uso de protocolos clínicos validados internacionalmente, com plano terapêutico individual e monitorização de evolução por objetivos.",
        "competitividade": "Posicionamento premium-realista para Maputo, com relação custo-benefício superior para acompanhamento clínico qualificado e relatórios técnicos.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 3000,
        "precoComIvaMZN": 3480,
        "precosPorModalidade": {
          "online": 3248,
          "presencial": 3712,
          "hibrido": 3480
        },
        "precosPorCliente": {
          "individualidades": 3480,
          "casal": 4872,
          "familia": 5220,
          "empresas": 7540,
          "ong": 5800,
          "associacoes": 5568
        }
      },
      {
        "id": "terapia-da-fala",
        "title": "Terapia da Fala",
        "summary": "Avaliação fonética, fonológica e linguística acompanhada de reabilitação especializada.",
        "descriptionFull": "Intervenção focada na prevenção, avaliação e tratamento das perturbações da comunicação humana, fala, linguagem e motricidade orofacial. Direcionada ao desenvolvimento infantil, dificuldades de aprendizagem e reabilitação neurológica em adultos pós-AVC, TCE ou outras condições neurológicas.",
        "diferencial": "Planos terapêuticos individualizados com exercícios práticos domiciliários e supervisão clínica contínua.",
        "competitividade": "Tarifário ajustado à realidade de Maputo para um serviço técnico especializado, com opção de acompanhamento contínuo.",
        "modalidadesPermitidas": [
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 2800,
        "precoComIvaMZN": 3248,
        "precosPorModalidade": {
          "presencial": 3248,
          "hibrido": 3016
        },
        "precosPorCliente": {
          "individualidades": 3248,
          "casal": null,
          "familia": 4872,
          "empresas": 8120,
          "ong": 5568,
          "associacoes": 5800
        }
      },
      {
        "id": "terapia-fala-gestual",
        "title": "Terapia da Fala em Língua Gestual",
        "summary": "Apoio especializado a pessoas com deficiência auditiva e integração institucional.",
        "descriptionFull": "Desenvolvimento de competências comunicativas e mediação linguística para a comunidade surda e para contextos institucionais que necessitam de acessibilidade comunicacional. Inclui adaptação de materiais, orientação a equipas e treino funcional de comunicação inclusiva.",
        "diferencial": "Serviço especializado com mediação linguística e orientação de acessibilidade para contextos escolares, clínicos e corporativos.",
        "competitividade": "Serviço raro e de alto valor social em Maputo, com posicionamento técnico diferenciado e aplicabilidade institucional real.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 3500,
        "precoComIvaMZN": 4060,
        "precosPorModalidade": {
          "online": 3712,
          "presencial": 4060,
          "hibrido": 3828
        },
        "precosPorCliente": {
          "individualidades": 4060,
          "casal": null,
          "familia": 5800,
          "empresas": 9860,
          "ong": 6960,
          "associacoes": 7192
        }
      },
      {
        "id": "terapia-ocupacional",
        "title": "Terapia ocupacional",
        "summary": "Intervenção focada na funcionalidade, autonomia e participação ocupacional.",
        "descriptionFull": "Apoio clínico e funcional para pessoas com limitações no desempenho diário, dificuldades motoras, neurológicas, sensoriais ou de autonomia. O serviço foca reabilitação, adaptação do ambiente e treino de atividades da vida diária.",
        "diferencial": "Plano funcional baseado na realidade do cliente, com metas observáveis e acompanhamento da progressão.",
        "competitividade": "Preço equilibrado para Maputo, com um serviço altamente útil para crianças, adultos, idosos e reabilitação pós-doença.",
        "modalidadesPermitidas": [
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 3000,
        "precoComIvaMZN": 3480,
        "precosPorModalidade": {
          "presencial": 3480,
          "hibrido": 3712
        },
        "precosPorCliente": {
          "individualidades": 3480,
          "casal": null,
          "familia": 4988,
          "empresas": 8700,
          "ong": 5800,
          "associacoes": 6028
        }
      },
      {
        "id": "avaliacao-psicologica",
        "title": "Avaliação psicológica",
        "summary": "Avaliação clínica, organizacional e pericial com relatório técnico.",
        "descriptionFull": "Processo de avaliação estruturado com entrevista, observação clínica, instrumentos psicológicos e devolução técnica. Aplicável a contextos clínicos, educacionais, organizacionais e administrativos, com relatório claro e profissional.",
        "diferencial": "Avaliação técnica rigorosa, orientada por finalidade clínica ou institucional e com devolução objetiva.",
        "competitividade": "Serviço com forte procura em Maputo, adequado a pessoas e instituições que precisam de documentação técnica séria.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 4500,
        "precoComIvaMZN": 5220,
        "precosPorModalidade": {
          "online": 4872,
          "presencial": 5220,
          "hibrido": 4988
        },
        "precosPorCliente": {
          "individualidades": 5220,
          "casal": null,
          "familia": 7540,
          "empresas": 10440,
          "ong": 8120,
          "associacoes": 8352
        }
      },
      {
        "id": "intervencao-crise",
        "title": "Apoio em crise e intervenção emocional urgente",
        "summary": "Intervenção breve para situações de choque, luto, conflito grave ou desorganização emocional.",
        "descriptionFull": "Serviço de resposta rápida para pessoas em sofrimento agudo, com foco em estabilização emocional, redução de risco e orientação prática imediata. Indicado para crises familiares, rupturas, violência psicológica, luto e estados de ansiedade intensa.",
        "diferencial": "Atendimento com prioridade clínica e foco em segurança, contenção e estabilização.",
        "competitividade": "Modelo de atendimento compatível com a urgência emocional real da cidade, sem perder rigor clínico.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 2500,
        "precoComIvaMZN": 2900,
        "precosPorModalidade": {
          "online": 2784,
          "presencial": 2900,
          "hibrido": 3016
        },
        "precosPorCliente": {
          "individualidades": 2900,
          "casal": 3712,
          "familia": 4392,
          "empresas": 8120,
          "ong": 5220,
          "associacoes": 5440
        }
      }
    ]
  },
  {
    "id": "gestao-empresarial-rh-economia",
    "title": "Gestão empresarial, negócios, RH e economia",
    "items": [
      {
        "id": "gestao-empresarial",
        "title": "Gestão Empresarial e Alinhamento Estratégico",
        "summary": "Diagnóstico organizacional, definição estratégica e otimização de desempenho de equipas.",
        "descriptionFull": "Consultoria executiva direcionada à reengenharia de processos internos, gestão da mudança e otimização de unidades operativas. Mapeia gargalos operacionais e desenha modelos de governança eficientes para sustentar o crescimento sustentável da organização.",
        "diferencial": "Abordagem integrada que cruza indicadores financeiros com psicologia organizacional para melhorar eficiência e retenção de talento.",
        "competitividade": "Honorários compatíveis com o mercado de Maputo para consultoria seniores de alto impacto.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 14000,
        "precoComIvaMZN": 16240,
        "precosPorModalidade": {
          "online": 15080,
          "presencial": 16240,
          "hibrido": 15664
        },
        "precosPorCliente": {
          "individualidades": 11600,
          "casal": null,
          "familia": null,
          "empresas": 16240,
          "ong": 15664,
          "associacoes": 15080
        }
      },
      {
        "id": "gestao-clima-burnout",
        "title": "Gestão de Clima Organizacional e Burnout",
        "summary": "Diagnósticos de ambiente de trabalho, resolução de conflitos e mitigação de stresse corporativo.",
        "descriptionFull": "Desenvolvimento e auditoria de políticas de bem-estar laboral. Atua na prevenção do burnout, gestão do absentismo e fortalecimento da cultura de segurança e confiança, promovendo a produtividade sustentável através de auditorias de clima e plano de intervenção.",
        "diferencial": "Metodologia quantitativa para medição de stresse ocupacional e retorno sobre investimento em produtividade.",
        "competitividade": "Serviço com valor direto para empresas de Maputo que querem reduzir rotação, conflito e queda de desempenho.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 12000,
        "precoComIvaMZN": 13920,
        "precosPorModalidade": {
          "online": 12760,
          "presencial": 13920,
          "hibrido": 13340
        },
        "precosPorCliente": {
          "individualidades": null,
          "casal": null,
          "familia": null,
          "empresas": 13920,
          "ong": 13440,
          "associacoes": 13200
        }
      },
      {
        "id": "gestao-rh",
        "title": "Gestão de Recursos Humanos",
        "summary": "Estruturação de RH, perfis de função, recrutamento e desenvolvimento organizacional.",
        "descriptionFull": "Consultoria para desenho de processos de recrutamento, onboarding, avaliação de desempenho, organização de equipa e políticas internas. Orientada para pequenas e médias empresas que precisam de RH funcional e profissional.",
        "diferencial": "Alinha dimensão humana e estrutura operacional para reduzir erros de contratação e aumentar produtividade.",
        "competitividade": "Preço ajustado ao mercado empresarial de Maputo, com foco em implementação prática.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 10000,
        "precoComIvaMZN": 11600,
        "precosPorModalidade": {
          "online": 11020,
          "presencial": 11600,
          "hibrido": 11368
        },
        "precosPorCliente": {
          "individualidades": null,
          "casal": null,
          "familia": null,
          "empresas": 11600,
          "ong": 11200,
          "associacoes": 10800
        }
      }
    ]
  },
  {
    "id": "fiscalidade-contabilidade",
    "title": "Fiscalidade, contabilidade e conformidade",
    "items": [
      {
        "id": "contabilidade-empresarial",
        "title": "Contabilidade empresarial e reporte financeiro",
        "summary": "Organização contabilística, reconciliação, relatórios e suporte fiscal.",
        "descriptionFull": "Serviço de suporte contabilístico para empresas que precisam de organização documental, reconciliação bancária, relatórios internos e apoio na preparação de obrigações fiscais e financeiras.",
        "diferencial": "Modelo de acompanhamento consistente, com relatórios claros e suporte de conformidade ajustado à realidade da empresa.",
        "competitividade": "Preço competitivo para PMEs de Maputo, com maior proximidade e personalização do que escritórios tradicionais de grande porte.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 7500,
        "precoComIvaMZN": 8700,
        "precosPorModalidade": {
          "online": 8120,
          "presencial": 8700,
          "hibrido": 8352
        },
        "precosPorCliente": {
          "individualidades": 5220,
          "casal": null,
          "familia": null,
          "empresas": 8700,
          "ong": 8400,
          "associacoes": 8200
        }
      },
      {
        "id": "consultoria-fiscal",
        "title": "Consultoria fiscal e conformidade tributária",
        "summary": "Apoio em obrigações fiscais, planeamento tributário e organização documental.",
        "descriptionFull": "Consultoria para apoio em obrigações tributárias, leitura de risco fiscal, organização documental, preparação e acompanhamento de processos de conformidade fiscal para negócios e instituições.",
        "diferencial": "Abordagem pragmática para reduzir erros, atrasos e penalizações, com orientação clara e aplicável.",
        "competitividade": "Valor alinhado ao mercado de Maputo para empresas que pretendem suporte fiscal sério sem custos excessivos.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 8500,
        "precoComIvaMZN": 9860,
        "precosPorModalidade": {
          "online": 9280,
          "presencial": 9860,
          "hibrido": 9628
        },
        "precosPorCliente": {
          "individualidades": 5800,
          "casal": null,
          "familia": null,
          "empresas": 9860,
          "ong": 9400,
          "associacoes": 9200
        }
      }
    ]
  },
  {
    "id": "formacao-estagios-comunidade",
    "title": "Formação, estágios, comunidade e impacto social",
    "items": [
      {
        "id": "formacao-profissional",
        "title": "Formação profissional e desenvolvimento de competências",
        "summary": "Cursos, workshops e capacitações práticas para indivíduos e equipas.",
        "descriptionFull": "Programas de capacitação técnica e comportamental para profissionais, estudantes, equipas e organizações, com foco em desenvolvimento de competências, comunicação, liderança, atendimento e bem-estar.",
        "diferencial": "Formação desenhada à medida, com aplicações práticas e materiais de apoio adaptados ao contexto do cliente.",
        "competitividade": "Preço consistente com formações especializadas em Maputo, mantendo acessibilidade e posicionamento premium.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 6000,
        "precoComIvaMZN": 6960,
        "precosPorModalidade": {
          "online": 6380,
          "presencial": 6960,
          "hibrido": 6728
        },
        "precosPorCliente": {
          "individualidades": 6960,
          "casal": null,
          "familia": null,
          "empresas": 13920,
          "ong": 9600,
          "associacoes": 9200
        }
      },
      {
        "id": "estagio-supervisionado",
        "title": "Estágio supervisionado e observação clínica",
        "summary": "Integração prática com supervisão técnica e orientação contínua.",
        "descriptionFull": "Programa para estudantes e profissionais em formação que desejam experiência real em contexto clínico, organizacional ou comunitário, com supervisão, feedback e desenvolvimento técnico estruturado.",
        "diferencial": "Modelo de aprendizagem supervisionada com objetivos definidos e acompanhamento efetivo.",
        "competitividade": "Posicionamento acessível para estudantes e instituições, sem perder rigor metodológico.",
        "modalidadesPermitidas": [
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 4500,
        "precoComIvaMZN": 5220,
        "precosPorModalidade": {
          "presencial": 5220,
          "hibrido": 4872
        },
        "precosPorCliente": {
          "individualidades": 5220,
          "casal": null,
          "familia": null,
          "empresas": 10440,
          "ong": 8120,
          "associacoes": 7880
        }
      },
      {
        "id": "responsabilidade-social",
        "title": "Responsabilidade social e projetos comunitários",
        "summary": "Intervenções sociais, campanhas, grupos de apoio e literacia em saúde mental.",
        "descriptionFull": "Planeamento e execução de iniciativas comunitárias voltadas para saúde mental, inclusão, prevenção, apoio psicossocial e literacia em bem-estar emocional, com foco em impacto mensurável.",
        "diferencial": "Projetos orientados por diagnóstico de necessidade, segmentação de público e métricas de impacto.",
        "competitividade": "Modelo de intervenção adequado a ONGs, igrejas, escolas, associações e projetos com missão social.",
        "modalidadesPermitidas": [
          "online",
          "presencial",
          "hibrido"
        ],
        "precoBaseMZN": 5000,
        "precoComIvaMZN": 5800,
        "precosPorModalidade": {
          "online": 5568,
          "presencial": 5800,
          "hibrido": 5672
        },
        "precosPorCliente": {
          "individualidades": null,
          "casal": null,
          "familia": null,
          "empresas": 11600,
          "ong": 6960,
          "associacoes": 7250
        }
      }
    ]
  },
  {
    id: "assessoria",
    title: "Assessoria empresarial e financeira",
    items: [
      {
        id: "assessoria-empresarial",
        title: "Assessoria Empresarial e Estratégia de Crescimento",
        summary:
          "Apoio a startups e negócios em fase de crescimento na estruturação estratégica e operacional.",
        descriptionFull:
          "Acompanhamento próximo a empreendedores e pequenas empresas na definição de modelo de negócio, plano de crescimento, estruturação inicial e validação de mercado, com foco na realidade económica de Moçambique.",
        diferencial:
          "Abordagem prática e adaptada ao estágio real do negócio, sem recomendações genéricas de manual.",
        competitividade:
          "Preço acessível para startups e PMEs em fase inicial, com opção de acompanhamento continuado.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 9000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(8500),
          presencial: comIva(9000),
          hibrido: comIva(8800)
        },
        precosPorCliente: {
          individualidades: comIva(6500),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(10440),
          ong: comIva(9800),
          associacoes: comIva(9600)
        }
      },
      {
        id: "assessoria-financeira",
        title: "Assessoria Financeira e Desenvolvimento Profissional",
        summary:
          "Treinamento e desenvolvimento de habilidades técnicas e interpessoais para profissionais e equipas.",
        descriptionFull:
          "Programa de apoio financeiro pessoal/profissional combinado com desenvolvimento de competências técnicas e interpessoais, direcionado a indivíduos em transição de carreira ou equipas em desenvolvimento.",
        diferencial:
          "Combina literacia financeira prática com desenvolvimento comportamental, algo raro no mercado local.",
        competitividade:
          "Posicionamento acessível para indivíduos, com pacote corporativo para equipas.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 5000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(4700),
          presencial: comIva(5000),
          hibrido: comIva(4900)
        },
        precosPorCliente: {
          individualidades: comIva(5000),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(11600),
          ong: comIva(8000),
          associacoes: comIva(7800)
        }
      }
    ]
  },
  {
    id: "coaching-mentoria",
    title: "Coaching e mentoria",
    items: [
      {
        id: "coaching-executivo",
        title: "Coaching Executivo",
        summary:
          "Acompanhamento individual para lideranças com foco em decisão, performance e gestão de conflitos.",
        descriptionFull:
          "Programa estruturado de coaching individual para executivos e líderes organizacionais, com objetivos claros, sessões periódicas e avaliação de progresso ao longo do percurso.",
        diferencial:
          "Metodologia baseada em psicologia organizacional, não apenas técnicas motivacionais genéricas.",
        competitividade:
          "Alinhado ao mercado de coaching executivo em Maputo para lideranças de médias e grandes empresas.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 6000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(5700),
          presencial: comIva(6000),
          hibrido: comIva(5900)
        },
        precosPorCliente: {
          individualidades: comIva(6000),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(13920),
          ong: comIva(9600),
          associacoes: comIva(9200)
        }
      },
      {
        id: "coaching-carreira-vida",
        title: "Coaching de Carreira e de Vida",
        summary:
          "Apoio individual na definição de objetivos pessoais e profissionais.",
        descriptionFull:
          "Acompanhamento individual para pessoas em transição de carreira, procura de propósito ou definição de metas de vida, com plano de ação estruturado.",
        diferencial:
          "Processo estruturado por objetivos, com acompanhamento e ajustes ao longo do percurso.",
        competitividade:
          "Preço acessível para indivíduos, mantendo qualidade técnica do acompanhamento.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 3500, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(3300),
          presencial: comIva(3500),
          hibrido: comIva(3400)
        },
        precosPorCliente: {
          individualidades: comIva(3500),
          casal: comIva(4500),
          familia: comIva(0),
          empresas: comIva(8100),
          ong: comIva(5600),
          associacoes: comIva(5400)
        }
      },
      {
        id: "mentoria-academica-profissional",
        title: "Mentoria Académica e Profissional",
        summary:
          "Orientação continuada para estudantes e profissionais em início de carreira.",
        descriptionFull:
          "Programa de mentoria para estudantes universitários e profissionais juniores, com orientação sobre percurso académico, primeiras experiências profissionais e desenvolvimento de identidade profissional.",
        diferencial:
          "Foco em construção de identidade profissional com segurança, não apenas aconselhamento pontual.",
        competitividade:
          "Posicionamento acessível, pensado para estudantes e profissionais em início de carreira.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 2500, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(2300),
          presencial: comIva(2500),
          hibrido: comIva(2400)
        },
        precosPorCliente: {
          individualidades: comIva(2500),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(5800),
          ong: comIva(4000),
          associacoes: comIva(3900)
        }
      }
    ]
  },
  {
    id: "programas-estruturados",
    title: "Programas estruturados de impacto",
    items: [
      {
        id: "programa-burnout",
        title: "Programa de Prevenção e Manejo do Burnout",
        summary:
          "Intervenção estruturada para prevenção e tratamento da síndrome de esgotamento profissional.",
        descriptionFull:
          "Programa institucional com psicoeducação sobre estresse ocupacional, técnicas de autorregulação psiconeurofisiológica e reorganização de processos laborais, desenhado para reduzir o esgotamento profissional nas organizações.",
        diferencial:
          "Abordagem estruturada e mensurável, não apenas palestras pontuais de sensibilização.",
        competitividade:
          "Valor direto para empresas que enfrentam alta rotatividade e absentismo ligado ao stress.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 12000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(11000),
          presencial: comIva(12000),
          hibrido: comIva(11500)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(13920),
          ong: comIva(13440),
          associacoes: comIva(13200)
        }
      },
      {
        id: "programa-mindfulness",
        title: "Programa de Mindfulness Baseado em Evidências (MBSR/MBCT)",
        summary:
          "Treinamento sistematizado em práticas de atenção plena, protocolos MBSR e MBCT.",
        descriptionFull:
          "Programa de grupo estruturado em protocolos internacionalmente validados (Mindfulness-Based Stress Reduction e Mindfulness-Based Cognitive Therapy) para redução de stress e prevenção de recaída em quadros ansiosos/depressivos.",
        diferencial:
          "Uso de protocolos validados internacionalmente, não apenas sessões avulsas de meditação.",
        competitividade:
          "Preço acessível em formato de grupo, com opção corporativa.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 4000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(3700),
          presencial: comIva(4000),
          hibrido: comIva(3900)
        },
        precosPorCliente: {
          individualidades: comIva(2800),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(9280),
          ong: comIva(6400),
          associacoes: comIva(6200)
        }
      },
      {
        id: "programa-envelhecimento-ativo",
        title: "Programa de Envelhecimento Ativo",
        summary:
          "Intervenção multidimensional para promoção de saúde mental na terceira idade.",
        descriptionFull:
          "Programa com estimulação cognitiva, atividade física adaptada, engajamento social e atividades domiciliares complementares, direcionado a idosos e às suas famílias.",
        diferencial:
          "Abordagem multidimensional (cognitiva, física e social), não apenas atividades recreativas isoladas.",
        competitividade:
          "Serviço com pouca oferta especializada em Maputo, posicionamento diferenciado.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 3500, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(3500),
          hibrido: comIva(3300)
        },
        precosPorCliente: {
          individualidades: comIva(3500),
          casal: comIva(0),
          familia: comIva(4800),
          empresas: comIva(0),
          ong: comIva(5500),
          associacoes: comIva(5300)
        }
      },
      {
        id: "programa-prevencao-escolar",
        title: "Programa Escolar de Prevenção em Saúde Mental",
        summary:
          "Intervenção psicoeducativa sistematizada para ambiente escolar, incluindo prevenção de bullying e manejo de stress.",
        descriptionFull:
          "Programa institucional para escolas, com oficinas temáticas, desenvolvimento de competências socioemocionais, prevenção de bullying, manejo de stress e capacitação docente.",
        diferencial:
          "Programa sistematizado e adaptado ao calendário escolar, com capacitação de docentes incluída.",
        competitividade:
          "Preço institucional acessível para escolas e associações de pais.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 6000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(6000),
          hibrido: comIva(5700)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(0),
          ong: comIva(6960),
          associacoes: comIva(6960)
        }
      }
    ]
  },
  {
    id: "reciclagem-sustentabilidade",
    title: "Reciclagem e sustentabilidade",
    items: [
      {
        id: "conscientizacao-ambiental",
        title: "Conscientização Ambiental",
        summary:
          "Workshops e campanhas de sensibilização ambiental para organizações e comunidades.",
        descriptionFull:
          "Sessões formativas sobre impacto ambiental, práticas sustentáveis e responsabilidade ecológica institucional, adaptadas ao contexto de Moçambique.",
        diferencial:
          "Conteúdo adaptado à realidade local, não material genérico traduzido.",
        competitividade:
          "Preço acessível para escolas, ONGs e pequenas empresas.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 4000, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(3700),
          presencial: comIva(4000),
          hibrido: comIva(3900)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(9280),
          ong: comIva(5600),
          associacoes: comIva(5800)
        }
      },
      {
        id: "gestao-residuos",
        title: "Treinamento em Gestão de Resíduos",
        summary:
          "Capacitação prática em gestão e redução de resíduos institucionais.",
        descriptionFull:
          "Formação prática sobre gestão de resíduos, separação, redução e práticas sustentáveis aplicáveis ao contexto organizacional.",
        diferencial:
          "Foco prático e aplicável, com recomendações concretas por tipo de organização.",
        competitividade:
          "Preço competitivo para instituições que precisam de conformidade ambiental básica.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 4500, // TODO: preço indicativo, confirmar com o negócio antes de publicar
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(4500),
          hibrido: comIva(4300)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(10440),
          ong: comIva(6300),
          associacoes: comIva(6300)
        }
      }
    ]
  }
] as const;

/* ============================================================================
 * 5. UTILITÁRIOS DE PREÇO
 * ========================================================================== */

export function calcularPrecoComIva(
  valor: number,
  taxa: number = IVA,
): number {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new TypeError("O valor deve ser um número finito e não negativo.");
  }

  if (!Number.isFinite(taxa) || taxa < 0) {
    throw new TypeError("A taxa deve ser um número finito e não negativo.");
  }

  return Math.round(valor * (1 + taxa));
}

export function formatarPrecoMZN(
  valor: number,
  locale: string = LOCALE,
): string {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new TypeError("O preço deve ser um número finito e não negativo.");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

/* ============================================================================
 * 6. INDEXAÇÃO SEGURA
 * ========================================================================== */

function createEcosystemServiceIndex(
  categories: readonly ServiceCategory[],
): ReadonlyMap<string, IndexedEcosystemService> {
  const index = new Map<string, IndexedEcosystemService>();

  for (const category of categories) {
    for (const service of category.items) {
      if (index.has(service.id)) {
        throw new Error(
          `[services-ecosystem] ID de serviço duplicado: "${service.id}"`,
        );
      }

      index.set(service.id, { category, service });
    }
  }

  return index;
}

export const ecosystemServiceIndex =
  createEcosystemServiceIndex(tikvahServicesEcosystem);

/* ============================================================================
 * 7. API DE CONSULTA
 * ========================================================================== */

export const ecosystemCategoryCount = tikvahServicesEcosystem.length;

export const ecosystemServiceCount = ecosystemServiceIndex.size;

export const ecosystemCategoryIds = Object.freeze(
  tikvahServicesEcosystem.map((category) => category.id),
);

export const ecosystemServiceIds = Object.freeze(
  Array.from(ecosystemServiceIndex.keys()),
);

export function getIndexedEcosystemServices(): readonly IndexedEcosystemService[] {
  return Object.freeze(Array.from(ecosystemServiceIndex.values()));
}

export function getEcosystemCategoryById(
  categoryId: string,
): ServiceCategory | null {
  const normalized = categoryId.trim();

  if (!normalized) return null;

  return (
    tikvahServicesEcosystem.find(
      (category) => category.id === normalized,
    ) ?? null
  );
}

export function getEcosystemServiceById(
  serviceId: string,
): IndexedEcosystemService | null {
  const normalized = serviceId.trim();

  if (!normalized) return null;

  return ecosystemServiceIndex.get(normalized) ?? null;
}

export function getEcosystemServicesByCategory(
  categoryId: string,
): readonly IndexedEcosystemService[] {
  const category = getEcosystemCategoryById(categoryId);

  if (!category) return [];

  return Object.freeze(
    category.items.map((service) => ({
      category,
      service,
    })),
  );
}

export function ecosystemCategoryExists(categoryId: string): boolean {
  return getEcosystemCategoryById(categoryId) !== null;
}

export function ecosystemServiceExists(serviceId: string): boolean {
  return getEcosystemServiceById(serviceId) !== null;
}

export function getCategoryForEcosystemService(
  serviceId: string,
): ServiceCategory | null {
  return getEcosystemServiceById(serviceId)?.category ?? null;
}

export function getEcosystemServiceContext(
  serviceId: string,
): IndexedEcosystemService | null {
  return getEcosystemServiceById(serviceId);
}

export function getPrecoPorModalidade(
  serviceId: string,
  modalidade: ModalidadeTipo,
): number | null {
  const indexed = getEcosystemServiceById(serviceId);

  if (!indexed) return null;

  if (!indexed.service.modalidadesPermitidas.includes(modalidade)) {
    return null;
  }

  return indexed.service.precosPorModalidade[modalidade] ?? null;
}

export function getPrecoPorCliente(
  serviceId: string,
  cliente: ClienteTipo,
): number | null {
  return (
    getEcosystemServiceById(serviceId)?.service.precosPorCliente[cliente] ??
    null
  );
}

export const ecosystemCatalogSummary = Object.freeze({
  categoryCount: ecosystemCategoryCount,
  serviceCount: ecosystemServiceCount,
  categoryIds: ecosystemCategoryIds,
  serviceIds: ecosystemServiceIds,
  currency: CURRENCY,
  locale: LOCALE,
  taxRate: IVA,
});

/* ============================================================================
 * 8. VALIDAÇÃO E INTEGRIDADE
 * ========================================================================== */

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidNonNegativeNumber = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0;

const isValidPositiveNumber = (value: unknown): value is number =>
  isValidNonNegativeNumber(value) && value > 0;

const isModalidade = (value: unknown): value is ModalidadeTipo =>
  typeof value === "string" &&
  (MODALIDADES as readonly string[]).includes(value);

export function validateServiceCatalogCategoryIds(): ServiceCatalogValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const category of tikvahServicesEcosystem) {
    if (!isNonEmptyString(category.id)) {
      errors.push("Foi encontrada uma categoria sem ID válido.");
      continue;
    }

    if (seen.has(category.id)) {
      errors.push(`ID de categoria duplicado: "${category.id}".`);
    }

    seen.add(category.id);
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function validateServiceCatalogServiceIds(): ServiceCatalogValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const category of tikvahServicesEcosystem) {
    for (const service of category.items) {
      if (!isNonEmptyString(service.id)) {
        errors.push(
          `Serviço sem ID válido na categoria "${category.id}".`,
        );
        continue;
      }

      if (seen.has(service.id)) {
        errors.push(`ID de serviço duplicado: "${service.id}".`);
      }

      seen.add(service.id);
    }
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function validateServiceCatalogServices(): ServiceCatalogValidationResult {
  const errors: string[] = [];

  for (const category of tikvahServicesEcosystem) {
    if (!isNonEmptyString(category.title)) {
      errors.push(`Categoria "${category.id}" sem título válido.`);
    }

    if (category.items.length === 0) {
      errors.push(`Categoria "${category.id}" não possui serviços.`);
    }

    for (const service of category.items) {
      const prefix = `[${category.id}/${service.id}]`;

      if (!isNonEmptyString(service.title)) {
        errors.push(`${prefix} título inválido.`);
      }

      if (!isNonEmptyString(service.summary)) {
        errors.push(`${prefix} resumo inválido.`);
      }

      if (!isNonEmptyString(service.descriptionFull)) {
        errors.push(`${prefix} descrição completa inválida.`);
      }

      if (!isNonEmptyString(service.diferencial)) {
        errors.push(`${prefix} diferencial inválido.`);
      }

      if (!isNonEmptyString(service.competitividade)) {
        errors.push(`${prefix} competitividade inválida.`);
      }

      if (!isValidNonNegativeNumber(service.precoBaseMZN)) {
        errors.push(`${prefix} preço base inválido.`);
      }

      if (!isValidNonNegativeNumber(service.precoComIvaMZN)) {
        errors.push(`${prefix} preço com IVA inválido.`);
      } else {
        const expected = calcularPrecoComIva(service.precoBaseMZN);

        if (service.precoComIvaMZN !== expected) {
          errors.push(
            `${prefix} preço com IVA inconsistente: esperado ${expected}, recebido ${service.precoComIvaMZN}.`,
          );
        }
      }

      const uniqueModalidades = new Set(service.modalidadesPermitidas);

      if (uniqueModalidades.size !== service.modalidadesPermitidas.length) {
        errors.push(`${prefix} possui modalidades duplicadas.`);
      }

      for (const modalidade of service.modalidadesPermitidas) {
        if (!isModalidade(modalidade)) {
          errors.push(`${prefix} modalidade inválida: "${modalidade}".`);
          continue;
        }

        const preco = service.precosPorModalidade[modalidade];

        if (!isValidPositiveNumber(preco)) {
          errors.push(
            `${prefix} modalidade permitida "${modalidade}" sem preço positivo.`,
          );
        }
      }

      for (const [modalidade, preco] of Object.entries(
        service.precosPorModalidade,
      )) {
        if (!isModalidade(modalidade)) {
          errors.push(
            `${prefix} preço associado a modalidade desconhecida "${modalidade}".`,
          );
          continue;
        }

        if (!service.modalidadesPermitidas.includes(modalidade)) {
          errors.push(
            `${prefix} preço definido para modalidade não permitida "${modalidade}".`,
          );
        }

        if (!isValidPositiveNumber(preco)) {
          errors.push(
            `${prefix} preço inválido para modalidade "${modalidade}".`,
          );
        }
      }

      for (const cliente of CLIENTES) {
        const preco = service.precosPorCliente[cliente];

        if (preco !== null && !isValidPositiveNumber(preco)) {
          errors.push(
            `${prefix} preço inválido para cliente "${cliente}".`,
          );
        }
      }
    }
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function validateServiceCatalogMetadata(): ServiceCatalogValidationResult {
  const errors: string[] = [];

  if (serviceCatalogMetadata.currency !== CURRENCY) {
    errors.push("Moeda dos metadados inconsistente.");
  }

  if (serviceCatalogMetadata.locale !== LOCALE) {
    errors.push("Locale dos metadados inconsistente.");
  }

  if (serviceCatalogMetadata.taxRate !== IVA) {
    errors.push("Taxa de IVA dos metadados inconsistente.");
  }

  if (ecosystemCategoryIds.length !== ecosystemCategoryCount) {
    errors.push("Contagem de IDs de categorias inconsistente.");
  }

  if (ecosystemServiceIds.length !== ecosystemServiceCount) {
    errors.push("Contagem de IDs de serviços inconsistente.");
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  });
}

export function validateServiceCatalogIntegrity(): ServiceCatalogIntegrityReport {
  const results = [
    validateServiceCatalogCategoryIds(),
    validateServiceCatalogServiceIds(),
    validateServiceCatalogServices(),
    validateServiceCatalogMetadata(),
  ];

  const errors = results.flatMap((result) => result.errors);

  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze(errors),
    categoryCount: ecosystemCategoryCount,
    serviceCount: ecosystemServiceCount,
    checkedAt: new Date().toISOString(),
  });
}

export function assertServiceCatalogIntegrity(): void {
  const report = validateServiceCatalogIntegrity();

  if (!report.valid) {
    throw new Error(
      [
        "[services-ecosystem] Falha de integridade do catálogo:",
        ...report.errors.map((error) => `- ${error}`),
      ].join("\n"),
    );
  }
}

/* ============================================================================
 * 9. EXPORTAÇÃO PADRÃO
 * ========================================================================== */

/**
 * Exportação padrão do catálogo comercial.
 *
 * GOVERNANÇA
 * - `tikvahServicesEcosystem` é a fonte de verdade dos dados comerciais.
 * - Consumidores devem preferir exports nomeados quando necessitam de uma
 *   operação específica.
 * - A camada de apresentação não deve alterar os dados recebidos.
 * - Preços, IVA, modalidades e perfis de cliente devem ser consumidos através
 *   das APIs deste módulo, evitando duplicação de regras comerciais.
 *
 * COMPATIBILIDADE
 * O default export é mantido para compatibilidade com consumidores existentes:
 *
 *   import tikvahServicesEcosystem from "@/data/services-ecosystem";
 *
 * Para novas implementações, recomenda-se:
 *
 *   import {
 *     tikvahServicesEcosystem,
 *     getEcosystemServiceById,
 *     getEcosystemServicesByCategory,
 *     formatarPrecoMZN,
 *   } from "@/data/services-ecosystem";
 *
 * INTEGRIDADE
 * A validação completa do catálogo está disponível através de:
 *
 *   assertServiceCatalogIntegrity();
 *
 * Em CI/testes, esta função pode ser executada como quality gate antes
 * do build/deploy.
 */
export default tikvahServicesEcosystem;