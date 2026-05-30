export type ModalidadeTipo = "online" | "presencial" | "hibrido";
export type ClienteTipo = "empresas" | "individualidades" | "familia" | "casal" | "ong" | "associacoes";

export interface PrecoConfigurado {
  online: number;
  presencial: number;
  hibrido: number;
}

export interface PrecoPorCliente {
  empresas: number;
  individualidades: number;
  familia: number;
  casal: number;
  ong: number;
  associacoes: number;
}

export interface ServiceDetail {
  id: string;
  title: string;
  summary: string;
  descriptionFull: string;
  diferencial: string;
  competitividade: string;
  modalidadesPermitidas: ModalidadeTipo[];
  precoBaseMZN: number;
  precosPorModalidade: PrecoConfigurado;
  precosPorCliente: PrecoPorCliente;
}

export interface ServiceCategory {
  id: string;
  title: string;
  items: ServiceDetail[];
}

const IVA = 0.16;

const comIva = (valor: number) => Math.round(valor * (1 + IVA));

export const tikvahEcosystemDescription =
  "A Tikvah estrutura os seus serviços como um ecossistema integrado, pensado para gerar impacto mensurável em pessoas, organizações e comunidades. Aliamos psicologia fundamentada em evidência, gestão estratégica, tecnologia, direito, finanças e responsabilidade social num modelo de intervenção centrado em eficiência, rigor técnico e sustentabilidade.";

export const tikvahModel360Text =
  "A Tikvah integra saúde mental, terapia da fala (incluindo Língua Gestual), terapia ocupacional, formação, estágios, voluntariado, gestão empresarial, gestão de negócios, recursos humanos, fiscalidade, contabilidade, tecnologia, direito, responsabilidade social e comunidade num único modelo de intervenção 360°. Cada intervenção é desenhada de forma estratégica, com base em diagnóstico rigoroso, acompanhamento contínuo e avaliação sistemática de impacto, adaptada ao contexto institucional, económico e cultural em que a organização atua.";

export const tikvahServicesEcosystem: ServiceCategory[] = [
  {
    id: "saude-mental-reabilitacao",
    title: "Saúde mental, reabilitação e intervenção",
    items: [
      {
        id: "psicologia-clinica",
        title: "Psicologia clínica, social e organizacional",
        summary:
          "Avaliação psicológica, formulação de caso e planeamento de intervenção individualizado continuado.",
        descriptionFull:
          "Serviço de alta complexidade focado no diagnóstico clínico, mapeamento de competências socioemocionais e intervenção continuada. Atua diretamente sobre o desenvolvimento da resiliência, mitigação de sintomas de ansiedade e depressão, e otimização do desempenho comportamental em contextos pessoais e corporativos de alta pressão.",
        diferencial:
          "Uso de protocolos clínicos validados internacionalmente, com plano terapêutico individual e monitorização de evolução por objetivos.",
        competitividade:
          "Posicionamento premium-realista para Maputo, com relação custo-benefício superior para acompanhamento clínico qualificado e relatórios técnicos.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 3000,
        precosPorModalidade: {
          online: comIva(2800),
          presencial: comIva(3200),
          hibrido: comIva(3000)
        },
        precosPorCliente: {
          individualidades: comIva(3000),
          casal: comIva(4200),
          familia: comIva(4500),
          empresas: comIva(6500),
          ong: comIva(5000),
          associacoes: comIva(4800)
        }
      },
      {
        id: "terapia-da-fala",
        title: "Terapia da Fala",
        summary:
          "Avaliação fonética, fonológica e linguística acompanhada de reabilitação especializada.",
        descriptionFull:
          "Intervenção focada na prevenção, avaliação e tratamento das perturbações da comunicação humana, fala, linguagem e motricidade orofacial. Direcionada ao desenvolvimento infantil, dificuldades de aprendizagem e reabilitação neurológica em adultos pós-AVC, TCE ou outras condições neurológicas.",
        diferencial:
          "Planos terapêuticos individualizados com exercícios práticos domiciliários e supervisão clínica contínua.",
        competitividade:
          "Tarifário ajustado à realidade de Maputo para um serviço técnico especializado, com opção de acompanhamento contínuo.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 2800,
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(2800),
          hibrido: comIva(2600)
        },
        precosPorCliente: {
          individualidades: comIva(2800),
          casal: comIva(0),
          familia: comIva(4200),
          empresas: comIva(7000),
          ong: comIva(4800),
          associacoes: comIva(5000)
        }
      },
      {
        id: "terapia-fala-gestual",
        title: "Terapia da Fala em Língua Gestual",
        summary:
          "Apoio especializado a pessoas com deficiência auditiva e integração institucional.",
        descriptionFull:
          "Desenvolvimento de competências comunicativas e mediação linguística para a comunidade surda e para contextos institucionais que necessitam de acessibilidade comunicacional. Inclui adaptação de materiais, orientação a equipas e treino funcional de comunicação inclusiva.",
        diferencial:
          "Serviço especializado com mediação linguística e orientação de acessibilidade para contextos escolares, clínicos e corporativos.",
        competitividade:
          "Serviço raro e de alto valor social em Maputo, com posicionamento técnico diferenciado e aplicabilidade institucional real.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 3500,
        precosPorModalidade: {
          online: comIva(3200),
          presencial: comIva(3500),
          hibrido: comIva(3300)
        },
        precosPorCliente: {
          individualidades: comIva(3500),
          casal: comIva(0),
          familia: comIva(5000),
          empresas: comIva(8500),
          ong: comIva(6000),
          associacoes: comIva(6200)
        }
      },
      {
        id: "terapia-ocupacional",
        title: "Terapia ocupacional",
        summary:
          "Intervenção focada na funcionalidade, autonomia e participação ocupacional.",
        descriptionFull:
          "Apoio clínico e funcional para pessoas com limitações no desempenho diário, dificuldades motoras, neurológicas, sensoriais ou de autonomia. O serviço foca reabilitação, adaptação do ambiente e treino de atividades da vida diária.",
        diferencial:
          "Plano funcional baseado na realidade do cliente, com metas observáveis e acompanhamento da progressão.",
        competitividade:
          "Preço equilibrado para Maputo, com um serviço altamente útil para crianças, adultos, idosos e reabilitação pós-doença.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 3000,
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(3000),
          hibrido: comIva(3200)
        },
        precosPorCliente: {
          individualidades: comIva(3000),
          casal: comIva(0),
          familia: comIva(4300),
          empresas: comIva(7500),
          ong: comIva(5000),
          associacoes: comIva(5200)
        }
      },
      {
        id: "avaliacao-psicologica",
        title: "Avaliação psicológica",
        summary:
          "Avaliação clínica, organizacional e pericial com relatório técnico.",
        descriptionFull:
          "Processo de avaliação estruturado com entrevista, observação clínica, instrumentos psicológicos e devolução técnica. Aplicável a contextos clínicos, educacionais, organizacionais e administrativos, com relatório claro e profissional.",
        diferencial:
          "Avaliação técnica rigorosa, orientada por finalidade clínica ou institucional e com devolução objetiva.",
        competitividade:
          "Serviço com forte procura em Maputo, adequado a pessoas e instituições que precisam de documentação técnica séria.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 4500,
        precosPorModalidade: {
          online: comIva(4200),
          presencial: comIva(4500),
          hibrido: comIva(4300)
        },
        precosPorCliente: {
          individualidades: comIva(4500),
          casal: comIva(0),
          familia: comIva(6500),
          empresas: comIva(9000),
          ong: comIva(7000),
          associacoes: comIva(7200)
        }
      },
      {
        id: "intervencao-crise",
        title: "Apoio em crise e intervenção emocional urgente",
        summary:
          "Intervenção breve para situações de choque, luto, conflito grave ou desorganização emocional.",
        descriptionFull:
          "Serviço de resposta rápida para pessoas em sofrimento agudo, com foco em estabilização emocional, redução de risco e orientação prática imediata. Indicado para crises familiares, rupturas, violência psicológica, luto e estados de ansiedade intensa.",
        diferencial:
          "Atendimento com prioridade clínica e foco em segurança, contenção e estabilização.",
        competitividade:
          "Modelo de atendimento compatível com a urgência emocional real da cidade, sem perder rigor clínico.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 2500,
        precosPorModalidade: {
          online: comIva(2400),
          presencial: comIva(2500),
          hibrido: comIva(2600)
        },
        precosPorCliente: {
          individualidades: comIva(2500),
          casal: comIva(3200),
          familia: comIva(3800),
          empresas: comIva(7000),
          ong: comIva(4500),
          associacoes: comIva(4700)
        }
      }
    ]
  },
  {
    id: "gestao-empresarial-rh-economia",
    title: "Gestão empresarial, negócios, RH e economia",
    items: [
      {
        id: "gestao-empresarial",
        title: "Gestão Empresarial e Alinhamento Estratégico",
        summary:
          "Diagnóstico organizacional, definição estratégica e otimização de desempenho de equipas.",
        descriptionFull:
          "Consultoria executiva direcionada à reengenharia de processos internos, gestão da mudança e otimização de unidades operativas. Mapeia gargalos operacionais e desenha modelos de governança eficientes para sustentar o crescimento sustentável da organização.",
        diferencial:
          "Abordagem integrada que cruza indicadores financeiros com psicologia organizacional para melhorar eficiência e retenção de talento.",
        competitividade:
          "Honorários compatíveis com o mercado de Maputo para consultoria seniores de alto impacto.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 14000,
        precosPorModalidade: {
          online: comIva(13000),
          presencial: comIva(14000),
          hibrido: comIva(13500)
        },
        precosPorCliente: {
          individualidades: comIva(10000),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(16240),
          ong: comIva(15600),
          associacoes: comIva(15080)
        }
      },
      {
        id: "gestao-clima-burnout",
        title: "Gestão de Clima Organizacional e Burnout",
        summary:
          "Diagnósticos de ambiente de trabalho, resolução de conflitos e mitigação de stresse corporativo.",
        descriptionFull:
          "Desenvolvimento e auditoria de políticas de bem-estar laboral. Atua na prevenção do burnout, gestão do absentismo e fortalecimento da cultura de segurança e confiança, promovendo a produtividade sustentável através de auditorias de clima e plano de intervenção.",
        diferencial:
          "Metodologia quantitativa para medição de stresse ocupacional e retorno sobre investimento em produtividade.",
        competitividade:
          "Serviço com valor direto para empresas de Maputo que querem reduzir rotação, conflito e queda de desempenho.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 12000,
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
        id: "gestao-rh",
        title: "Gestão de Recursos Humanos",
        summary:
          "Estruturação de RH, perfis de função, recrutamento e desenvolvimento organizacional.",
        descriptionFull:
          "Consultoria para desenho de processos de recrutamento, onboarding, avaliação de desempenho, organização de equipa e políticas internas. Orientada para pequenas e médias empresas que precisam de RH funcional e profissional.",
        diferencial:
          "Alinha dimensão humana e estrutura operacional para reduzir erros de contratação e aumentar produtividade.",
        competitividade:
          "Preço ajustado ao mercado empresarial de Maputo, com foco em implementação prática.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 10000,
        precosPorModalidade: {
          online: comIva(9500),
          presencial: comIva(10000),
          hibrido: comIva(9800)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(11600),
          ong: comIva(11200),
          associacoes: comIva(10800)
        }
      }
    ]
  },
  {
    id: "fiscalidade-contabilidade",
    title: "Fiscalidade, contabilidade e conformidade",
    items: [
      {
        id: "contabilidade-empresarial",
        title: "Contabilidade empresarial e reporte financeiro",
        summary:
          "Organização contabilística, reconciliação, relatórios e suporte fiscal.",
        descriptionFull:
          "Serviço de suporte contabilístico para empresas que precisam de organização documental, reconciliação bancária, relatórios internos e apoio na preparação de obrigações fiscais e financeiras.",
        diferencial:
          "Modelo de acompanhamento consistente, com relatórios claros e suporte de conformidade ajustado à realidade da empresa.",
        competitividade:
          "Preço competitivo para PMEs de Maputo, com maior proximidade e personalização do que escritórios tradicionais de grande porte.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 7500,
        precosPorModalidade: {
          online: comIva(7000),
          presencial: comIva(7500),
          hibrido: comIva(7200)
        },
        precosPorCliente: {
          individualidades: comIva(4500),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(8700),
          ong: comIva(8400),
          associacoes: comIva(8200)
        }
      },
      {
        id: "consultoria-fiscal",
        title: "Consultoria fiscal e conformidade tributária",
        summary:
          "Apoio em obrigações fiscais, planeamento tributário e organização documental.",
        descriptionFull:
          "Consultoria para apoio em obrigações tributárias, leitura de risco fiscal, organização documental, preparação e acompanhamento de processos de conformidade fiscal para negócios e instituições.",
        diferencial:
          "Abordagem pragmática para reduzir erros, atrasos e penalizações, com orientação clara e aplicável.",
        competitividade:
          "Valor alinhado ao mercado de Maputo para empresas que pretendem suporte fiscal sério sem custos excessivos.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 8500,
        precosPorModalidade: {
          online: comIva(8000),
          presencial: comIva(8500),
          hibrido: comIva(8200)
        },
        precosPorCliente: {
          individualidades: comIva(5000),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(9860),
          ong: comIva(9400),
          associacoes: comIva(9200)
        }
      }
    ]
  },
  {
    id: "formacao-estagios-comunidade",
    title: "Formação, estágios, comunidade e impacto social",
    items: [
      {
        id: "formacao-profissional",
        title: "Formação profissional e desenvolvimento de competências",
        summary:
          "Cursos, workshops e capacitações práticas para indivíduos e equipas.",
        descriptionFull:
          "Programas de capacitação técnica e comportamental para profissionais, estudantes, equipas e organizações, com foco em desenvolvimento de competências, comunicação, liderança, atendimento e bem-estar.",
        diferencial:
          "Formação desenhada à medida, com aplicações práticas e materiais de apoio adaptados ao contexto do cliente.",
        competitividade:
          "Preço consistente com formações especializadas em Maputo, mantendo acessibilidade e posicionamento premium.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 6000,
        precosPorModalidade: {
          online: comIva(5500),
          presencial: comIva(6000),
          hibrido: comIva(5800)
        },
        precosPorCliente: {
          individualidades: comIva(6500),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(13920),
          ong: comIva(9600),
          associacoes: comIva(9200)
        }
      },
      {
        id: "estagio-supervisionado",
        title: "Estágio supervisionado e observação clínica",
        summary:
          "Integração prática com supervisão técnica e orientação contínua.",
        descriptionFull:
          "Programa para estudantes e profissionais em formação que desejam experiência real em contexto clínico, organizacional ou comunitário, com supervisão, feedback e desenvolvimento técnico estruturado.",
        diferencial:
          "Modelo de aprendizagem supervisionada com objetivos definidos e acompanhamento efetivo.",
        competitividade:
          "Posicionamento acessível para estudantes e instituições, sem perder rigor metodológico.",
        modalidadesPermitidas: ["presencial", "hibrido"],
        precoBaseMZN: 4500,
        precosPorModalidade: {
          online: comIva(0),
          presencial: comIva(4500),
          hibrido: comIva(4200)
        },
        precosPorCliente: {
          individualidades: comIva(5200),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(9000),
          ong: comIva(7000),
          associacoes: comIva(6800)
        }
      },
      {
        id: "responsabilidade-social",
        title: "Responsabilidade social e projetos comunitários",
        summary:
          "Intervenções sociais, campanhas, grupos de apoio e literacia em saúde mental.",
        descriptionFull:
          "Planeamento e execução de iniciativas comunitárias voltadas para saúde mental, inclusão, prevenção, apoio psicossocial e literacia em bem-estar emocional, com foco em impacto mensurável.",
        diferencial:
          "Projetos orientados por diagnóstico de necessidade, segmentação de público e métricas de impacto.",
        competitividade:
          "Modelo de intervenção adequado a ONGs, igrejas, escolas, associações e projetos com missão social.",
        modalidadesPermitidas: ["online", "presencial", "hibrido"],
        precoBaseMZN: 5000,
        precosPorModalidade: {
          online: comIva(4800),
          presencial: comIva(5000),
          hibrido: comIva(4900)
        },
        precosPorCliente: {
          individualidades: comIva(0),
          casal: comIva(0),
          familia: comIva(0),
          empresas: comIva(11600),
          ong: comIva(6960),
          associacoes: comIva(7250)
        }
      }
    ]
  }
];