<<<<<<< HEAD
"use client";

import React, { useMemo, useState } from "react";
import {
  tikvahServicesEcosystem,
  tikvahEcosystemDescription,
  tikvahModel360Text,
  ServiceDetail,
  ModalidadeTipo,
} from "@/data/tikvah-services-cms";

type ClienteTipo =
  | "empresas"
  | "individualidades"
  | "familia"
  | "casal"
  | "ong"
  | "associacoes";

const formatMZN = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const clienteLabel: Record<ClienteTipo, string> = {
  empresas: "Empresas",
  individualidades: "Individualidades",
  familia: "Família",
  casal: "Casal",
  ong: "ONG",
  associacoes: "Associações",
};

export default function ServicesPage() {
  const initialCategoryId = tikvahServicesEcosystem[0]?.id ?? "";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryId);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [checkoutModalidade, setCheckoutModalidade] = useState<ModalidadeTipo>("online");
  const [checkoutCliente, setCheckoutCliente] = useState<ClienteTipo>("individualidades");
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const currentCategory = useMemo(
    () => tikvahServicesEcosystem.find((cat) => cat.id === activeCategory) ?? tikvahServicesEcosystem[0],
    [activeCategory]
  );

  const availableModalidades = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.modalidadesPermitidas.filter(
      (mod) => typeof selectedService.precosPorModalidade?.[mod] === "number"
    );
  }, [selectedService]);

  const availableClientes = useMemo(() => {
    if (!selectedService) return [];
    const keys: ClienteTipo[] = [
      "empresas",
      "individualidades",
      "familia",
      "casal",
      "ong",
      "associacoes",
    ];
    return keys.filter((key) => typeof selectedService.precosPorCliente?.[key] === "number");
  }, [selectedService]);

  const getPriceByModalidade = (service: ServiceDetail, modalidade: ModalidadeTipo) => {
    const value = service.precosPorModalidade?.[modalidade];
    return typeof value === "number" ? value : null;
  };

  const getPriceByCliente = (service: ServiceDetail, cliente: ClienteTipo) => {
    const value = service.precosPorCliente?.[cliente];
    return typeof value === "number" ? value : null;
  };

  const resolveFinalPrice = (service: ServiceDetail) => {
    const clientePrice = getPriceByCliente(service, checkoutCliente);
    const modalidadePrice = getPriceByModalidade(service, checkoutModalidade);
    return clientePrice ?? modalidadePrice ?? service.precoComIvaMZN ?? service.precoBaseMZN;
  };

  const handleCheckout = async (service: ServiceDetail) => {
    setLoadingCheckout(true);

    try {
      const finalPrice = resolveFinalPrice(service);

      console.log("Checkout iniciado", {
        serviceId: service.id,
        serviceTitle: service.title,
        modalidade: checkoutModalidade,
        cliente: checkoutCliente,
        priceMZN: finalPrice,
      });

      // Integração futura com Supabase ou gateway:
      // const response = await fetch("/api/create-checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     serviceId: service.id,
      //     serviceTitle: service.title,
      //     modalidade: checkoutModalidade,
      //     cliente: checkoutCliente,
      //     priceMZN: finalPrice,
      //   }),
      // });
      // const data = await response.json();
      // if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Erro no processamento do checkout:", err);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (!tikvahServicesEcosystem.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        Nenhum serviço disponível.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-wider">
            Portfólio Corporativo e Clínico
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Soluções e Serviços Tikvah
          </h1>
          <p className="mt-4 max-w-4xl mx-auto text-lg text-slate-600 leading-relaxed">
            {tikvahEcosystemDescription}
          </p>
        </div>

        <div className="border-b border-slate-200 mb-10">
          <nav className="flex flex-wrap -mb-px gap-2" aria-label="Categorias de Serviços">
            {tikvahServicesEcosystem.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedService(null);
                }}
                className={`py-3 px-6 font-medium text-sm border-b-2 transition-all rounded-t-lg ${
                  activeCategory === category.id
                    ? "border-teal-600 text-teal-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {category.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentCategory?.items.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedService(service);
                const defaultModalidade = service.modalidadesPermitidas.find(
                  (mod) => typeof service.precosPorModalidade?.[mod] === "number"
                );
                if (defaultModalidade) setCheckoutModalidade(defaultModalidade);
                setCheckoutCliente(
                  (["individualidades", "empresas", "familia", "casal", "ong", "associacoes"] as ClienteTipo[])
                    .find((key) => typeof service.precosPorCliente?.[key] === "number") ?? "individualidades"
                );
              }}
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all cursor-pointer text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.summary}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-teal-600">
                  Mais detalhes →
                </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">
                  {formatMZN(service.precoComIvaMZN)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedService && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative border border-slate-100">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-semibold p-2"
                aria-label="Fechar janela"
              >
                &times;
              </button>

              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-950">{selectedService.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    Preço base: {formatMZN(selectedService.precoBaseMZN)}
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    IVA incluído: {formatMZN(selectedService.precoComIvaMZN)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Descrição do Serviço
                    </h4>
                    <p>{selectedService.descriptionFull}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Diferencial Estratégico
                    </h4>
                    <p>{selectedService.diferencial}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Competitividade de Mercado
                    </h4>
                    <p>{selectedService.competitividade}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3">
                      Modalidades Disponíveis
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableModalidades.map((mod) => (
                        <button
                          key={mod}
                          onClick={() => setCheckoutModalidade(mod)}
                          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            checkoutModalidade === mod
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {mod}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3">
                      Tipo de Cliente
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableClientes.map((cliente) => (
                        <button
                          key={cliente}
                          onClick={() => setCheckoutCliente(cliente)}
                          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            checkoutCliente === cliente
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {clienteLabel[cliente]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4">
                      Preço por Modalidade
                    </h4>
                    <div className="space-y-3">
                      {availableModalidades.map((mod) => (
                        <div key={mod} className="flex justify-between text-sm">
                          <span className="capitalize text-slate-700">{mod}</span>
                          <span className="font-semibold text-slate-900">
                            {formatMZN(getPriceByModalidade(selectedService, mod))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4">
                      Preço por Tipo de Cliente
                    </h4>
                    <div className="space-y-3">
                      {availableClientes.map((cliente) => (
                        <div key={cliente} className="flex justify-between text-sm">
                          <span className="text-slate-700">{clienteLabel[cliente]}</span>
                          <span className="font-semibold text-slate-900">
                            {formatMZN(getPriceByCliente(selectedService, cliente))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl">
                    <p className="text-sm text-teal-900 leading-relaxed">
                      Todos os preços apresentados incluem IVA de 16% e foram normalizados para manter
                      coerência com o posicionamento premium-realista da Tikvah em Maputo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Voltar ao Catálogo
                </button>
                <button
                  onClick={() => handleCheckout(selectedService)}
                  disabled={loadingCheckout}
                  className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {loadingCheckout ? "A processar..." : "Agendar e Pagar"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-xl p-8 sm:p-12 text-white border border-slate-800">
          <div className="max-w-4xl">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Integração Sistémica
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl mt-2 mb-4 tracking-tight">
              Modelo de Intervenção 360°
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {tikvahModel360Text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Building, 
  GraduationCap, 
  Users, 
  Stethoscope,
  Heart,
  DollarSign,
  Scale,
  Code,
  Shield,
  TreePine,
  Globe,
  Target,
  Briefcase,
  TrendingUp,
  Lightbulb,
  HeadphonesIcon,
  BookOpen,
  Award,
  Wrench,
  MessageCircle,
  FileText,
  BarChart3,
  Compass,
  Handshake,
  Building2,
  Wallet,
  Coins,
  Newspaper,
  UserCheck,
  Laptop,
  Book,
  UsersRound,
  HandHeart,
  BriefcaseBusiness,
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Brain, Users, Stethoscope, Activity, Sparkles,
  DollarSign, Briefcase, Scale, Cpu, GraduationCap,
  HeartHandshake, HandHeart, ArrowUp, Phone, Mail, ArrowRight,
  Shield, Award, Clock, CheckCircle2,
} from "lucide-react";
import { useServicesCatalog, type CatalogService } from "@/hooks/useServicesCatalog";
import { ProposalModal } from "@/components/services/ProposalModal";
import { TikvahEcosystem } from "@/components/TikvahEcosystem";


const AREA_META: Record<string, { name: string; short: string; icon: React.ComponentType<{ className?: string }>; nav: string; tagline: string }> = {
  "01": { name: "Psicoterapia Clínica", short: "Clínica", icon: Brain, nav: "area-01", tagline: "Saúde mental baseada em evidência (TCC, ACT, EMDR)." },
  "02": { name: "Psicologia Organizacional", short: "Empresarial", icon: Users, nav: "area-02", tagline: "Engagement, liderança e cultura mensurável." },
  "03": { name: "Psiquiatria Integrativa", short: "Psiquiatria", icon: Stethoscope, nav: "area-03", tagline: "Avaliação e seguimento clínico holístico." },
  "04": { name: "Neuropsicologia e Reabilitação", short: "Neuro", icon: Activity, nav: "area-04", tagline: "Avaliação cognitiva e reabilitação funcional." },
  "05": { name: "Terapias Complementares", short: "Terapias", icon: Sparkles, nav: "area-05", tagline: "Mindfulness, arteterapia e somatic experiencing." },
  "06": { name: "Consultoria Financeira", short: "Financeira", icon: DollarSign, nav: "area-06", tagline: "Saúde financeira pessoal e corporativa." },
  "07": { name: "Consultoria Empresarial", short: "Empresarial", icon: Briefcase, nav: "area-07", tagline: "Estratégia, processos e transformação." },
  "08": { name: "Direito e Gestão RH", short: "Jurídico", icon: Scale, nav: "area-08", tagline: "Compliance laboral e gestão de pessoas." },
  "09": { name: "Tecnologia da Informação", short: "TI", icon: Cpu, nav: "area-09", tagline: "Soluções digitais e automação segura." },
  "10": { name: "Formação Executiva", short: "Formação", icon: GraduationCap, nav: "area-10", tagline: "Capacitação certificada para líderes e equipas." },
  "11": { name: "Psicologia Social Comunitária", short: "Social", icon: HeartHandshake, nav: "area-11", tagline: "Intervenções comunitárias com impacto real." },
  "12": { name: "Voluntariado e Responsabilidade Social", short: "Voluntariado", icon: HandHeart, nav: "area-12", tagline: "Programas de RSC e voluntariado estruturado." },
};

const ALL = "__all__";

const formatPrice = (price: number | null, currency: string | null) => {
  if (!price || price === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(price) + ` ${currency || "MZN"}`;
};

interface CardProps {
  s: CatalogService;
  onProposal: (s: CatalogService) => void;
}

const ServiceCard = ({ s, onProposal }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -6 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    <Card className="group h-full flex flex-col border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="secondary" className="text-xs">{s.area_name}</Badge>
          <span className="text-sm font-bold text-primary whitespace-nowrap">{formatPrice(s.price_from, s.currency)}</span>
        </div>
        <Link to={`/services/${s.slug}`} className="block group/title">
          <h4 className="text-xl font-bold text-foreground leading-tight mb-2 group-hover/title:text-primary transition-colors">{s.title}</h4>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{s.short_description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(s.modalities || []).map((m) => (
            <Badge key={m} variant="outline" className="text-[10px] font-medium">{m}</Badge>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              onClick={() => onProposal(s)}
              className="w-full text-white shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: "#00A859" }}
            >
              Proposta Formal 60s
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          <Link to={`/services/${s.slug}`}>
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Ver detalhes completos →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TRUST_STATS = [
  { icon: Users, value: "12+", label: "Áreas de actuação" },
  { icon: Award, value: "ISO 27001", label: "Compliance" },
  { icon: Clock, value: "24h", label: "Resposta garantida" },
  { icon: Shield, value: "100%", label: "Confidencialidade" },
];

const Services = () => {
  const mainServices = [
    {
      icon: Brain,
      title: "Psicoterapia & Saúde Mental",
      description: "Serviços psicológicos integrados para promoção de saúde mental, prevenção e intervenção em crises.",
      link: "/services/psicoterapia",
      services: [
        "Psicoterapia Clínica, Social e Organizacional",
        "Avaliação Psicológica e Diagnóstico Funcional",
        "Terapia Individual, Familiar e de Grupo",
        "Intervenção em Crises e Trauma",
      ]
    },
    {
      icon: Building2,
      title: "Gestão Empresarial & de Negócios",
      description: "Consultoria estratégica e operativa para organizações, ONGs e PME, com foco em crescimento sustentável.",
      link: "/services/gestao",
      services: [
        "Gestão Empresarial e Diagnóstico Organizacional",
        "Planeamento Estratégico e Gestão de Mudança",
        "Gestão de Negócios e Modelagem de Negócio",
        "Gestão de Recursos Humanos e Clima Organizacional",
      ]
    },
    {
      icon: GraduationCap,
      title: "Formação & Desenvolvimento",
      description: "Programas de formação, capacitação e estágios supervisionados para profissionais e organizações.",
      link: "/services/formacao",
      services: [
        "Cursos Técnicos, Psicológicos e Organizacionais",
        "Programa de Primeiros Socorros Psicológicos (PSP)",
        "Estágios Supervisionados (incl. PEP)",
        "Monitoria e Avaliação de Projetos (M&E)",
      ]
    },
    {
      icon: UsersRound,
      title: "Comunidade & Responsabilidade Social",
      description: "Intervenções comunitárias, programas de responsabilidade social e apoio psicossocial em contextos vulneráveis.",
      link: "/services/comunidade",
      services: [
        "Programas de Responsabilidade Social e Sustentabilidade",
        "Outreach e Suporte Comunitário",
        "Voluntariado Estruturado e Campanhas de Sensibilização",
        "Pesquisa Aplicada em Políticas Sociais",
      ]
    }
  ];

  const comprehensiveServices = [
    {
      category: "Saúde Mental, Terapias e Reabilitação",
      icon: Stethoscope,
      services: [
        "Psicologia Clínica, Social e Organizacional",
        "Terapia da Fala",
        "Terapia da Fala em Língua Gestual",
        "Terapia Ocupacional",
        "Apoio Psicológico em Crises",
        "Programa de Primeiros Socorros Psicológicos (PSP)",
      ]
    },
    {
      category: "Gestão Empresarial, Negócios & Economia",
      icon: TrendingUp,
      services: [
        "Gestão Empresarial",
        "Gestão de Negócios",
        "Consultoria em Negócios",
        "Gestão e Administração de Recursos Humanos",
        "Planeamento de Recursos Humanos",
        "Gestão de Clima Organizacional",
        "Análise Económica Aplicada",
        "Economia de Recursos Humanos",
      ]
    },
    {
      category: "Financeiro, Fiscalidade & Jurídico",
      icon: Wallet,
      services: [
        "Contabilidade e Auditoria",
        "Fiscalidade Corporativa e Planeamento Fiscal",
        "Jurisprudência Aplicada e Pareceres Jurídicos",
        "Assessoria Empresarial e Institucional",
        "Governação, Compliance e Gestão de Risco",
      ]
    },
    {
      category: "Tecnologia, Inovação & Dados",
      icon: Laptop,
      services: [
        "Tecnologias de Informação (TI)",
        "Desenvolvimento de Soluções Digitais para Saúde e Gestão",
        "Gestão de Segurança de Dados e Privacidade",
        "Plataformas de Gestão de Projetos e M&E",
      ]
    },
    {
      category: "Formação, P&D & Educação",
      icon: Book,
      services: [
        "Cursos e Treinamentos Técnicos e Psicológicos",
        "Programa de Primeiros Socorros Psicológicos (PSP)",
        "Estágios Supervisionados em Psicologia, Terapia da Fala e Ocupacional",
        "Programas de Estágio Profissional (PEP)",
        "Monitoria e Avaliação de Projetos (M&E)",
        "Pesquisa e Desenvolvimento (P&D) Aplicada",
      ]
    },
    {
      category: "Consultoria Estratégica & Organizacional",
      icon: Target,
      services: [
        "Consultoria Psicológica Organizacional",
        "Consultoria Científica e Técnica",
        "Consultoria em Gestão de Projetos Sociais",
        "Coaching Executivo e Individual",
        "Mentoria e Reciclagem Profissional",
      ]
    },
    {
      category: "Administração, Operações & Projetos",
      icon: FileText,
      services: [
        "Gestão Completa de Projetos Sociais e de Saúde",
        "Administração e Operações Institucionais",
        "Gestão de Processos e Documentação",
        "Parcerias e Colaborações Estratégicas",
      ]
    },
    {
      category: "Responsabilidade Social & Comunidade",
      icon: Heart,
      services: [
        "Programas de Sustentabilidade Organizacional",
        "Responsabilidade Social e Impacto Social Medido",
        "Outreach e Suporte Comunitário",
        "Voluntariado Estruturado e Campanhas de Apoio",
      ]
    },
    {
      category: "Comunicação, Publicações & Mídia",
      icon: Newspaper,
      services: [
        "Publicações Técnicas, Relatórios e Estudos",
        "Produção de Conteúdos Educativos e de Sensibilização",
        "Gestão de Comunicação Institucional e Mídia",
      ]
  const { data: services = [], isLoading } = useServicesCatalog();
  const [modality, setModality] = useState<string>(ALL);
  const [audience, setAudience] = useState<string>(ALL);
  const [showTop, setShowTop] = useState(false);
  const [proposalService, setProposalService] = useState<CatalogService | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openProposal = (s: CatalogService) => {
    setProposalService(s);
    setProposalOpen(true);
  };

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (modality !== ALL && !(s.modalities || []).includes(modality)) return false;
      if (audience !== ALL && !(s.target_audience || []).includes(audience)) return false;
      return true;
    });
  }, [services, modality, audience]);

  const grouped = useMemo(() => {
    const groups = new Map<string, CatalogService[]>();
    for (const s of filtered) {
      const arr = groups.get(s.area_code) || [];
      arr.push(s);
      groups.set(s.area_code, arr);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Serviços Tikvah Psycem",
    "itemListElement": services.map((s, i) => ({
      "@type": "Service",
      "position": i + 1,
      "name": s.title,
      "description": s.short_description,
      "category": s.area_name,
      "provider": { "@type": "Organization", "name": "Tikvah Psycem" },
      "areaServed": "Maputo, Moçambique",
      "url": `https://tikvahpsycem.lovable.app/services/${s.slug}`,
      ...(s.price_from && s.price_from > 0 ? {
        "offers": { "@type": "Offer", "price": s.price_from, "priceCurrency": s.currency || "MZN" },
      } : {}),
    })),
  }), [services]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tikvah Psycem — 12 Áreas de Excelência Multidisciplinar</title>
        <meta name="description" content="12 áreas executivas: Clínica, Empresarial, Financeira, TI, Jurídico, Formação e mais. Soluções mensuráveis para PMEs, ONGs e profissionais em Moçambique." />
        <link rel="canonical" href="https://tikvahpsycem.lovable.app/services" />
        <meta property="og:title" content="Tikvah Psycem — 12 Áreas de Excelência" />
        <meta property="og:description" content="Transformação mensurável para PMEs, ONGs, profissionais liberais e comunidades." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="services-hero relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${consultoriaNegocios})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Serviços <span className="text-gradient-accent">Tikvah</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Ecossistema Estratégico de Apoio e Crescimento
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mt-4">
              A Tikvah integra saúde mental, gestão empresarial, recursos humanos, fiscalidade, tecnologia, responsabilidade social e comunidade num modelo de intervenção 360°, com foco em resultados mensuráveis e sustentáveis.
            </p>

      {/* Sticky Executive Nav */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap">
            <span className="text-xs font-semibold text-muted-foreground mr-2 hidden md:inline">Áreas:</span>
            {Object.entries(AREA_META).map(([code, meta]) => (
              <a
                key={code}
                href={`#${meta.nav}`}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all hover:scale-105"
              >
                {meta.short}
              </a>
            ))}
            <Link to="/contact" className="ml-auto pl-3">
              <Button size="sm" variant="outline" className="text-xs">Contato</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Services */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Serviços <span className="text-gradient-primary">Principais</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nossos eixos centrais de intervenção, integrados num modelo de apoio contínuo a pessoas, organizações e comunidades.
            </p>
          </div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/95 via-primary to-primary/80 text-white py-16 md:py-24 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            Tikvah Psycem — 12 Áreas de Excelência Multidisciplinar
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-white/90 max-w-4xl mx-auto mb-8"
          >
            Transformação Mensurável para PMEs, ONGs, Profissionais Liberais e Comunidades
          </motion.h2>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            {TRUST_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4"
                >
                  <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-white/80">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-card/50 sticky top-[104px] z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-foreground">Filtros:</span>
          <Select value={modality} onValueChange={setModality}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Modalidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas modalidades</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Público-Alvo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os públicos</SelectItem>
              <SelectItem value="PME">PME</SelectItem>
              <SelectItem value="ONG">ONG</SelectItem>
              <SelectItem value="Estudantes">Estudantes</SelectItem>
              <SelectItem value="Público">Público Geral</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} serviços</span>
        </div>
      </section>

      {/* Areas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
            </div>
          )}

          {!isLoading && grouped.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Nenhum serviço corresponde aos filtros.</p>
          )}

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Qualidade Certificada</h4>
                <p className="text-sm text-muted-foreground">
                  Serviços baseados em padrões internacionais de qualidade e avaliação de impacto.
                </p>
              </div>
              
              <div className="text-center">
                <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Abordagem Personalizada</h4>
                <p className="text-sm text-muted-foreground">
                  Soluções adaptadas às necessidades específicas de cada cliente e contexto organizacional.
                </p>
              </div>
              
              <div className="text-center">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Inovação Contínua</h4>
                <p className="text-sm text-muted-foreground">
                  Constantemente atualizados com as últimas metodologias em psicologia, gestão, economia e tecnologia.
                </p>
              </div>
            </div>
          {grouped.map(([code, items]) => {
            const meta = AREA_META[code];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <motion.div
                key={code}
                id={meta.nav}
                className="scroll-mt-32"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="flex items-center gap-3 mb-2 pb-3 border-b border-border">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-primary tracking-widest">ÁREA {code}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">{meta.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic mb-6 ml-15">{meta.tagline}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((s) => <ServiceCard key={s.id} s={s} onProposal={openProposal} />)}
                </div>
              </motion.div>
            );
          })}

          {/* Final CTA Block */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white p-8 md:p-12 text-center mt-16"
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl md:text-4xl font-bold mb-3">Não encontra o que procura?</h3>
              <p className="text-white/90 max-w-2xl mx-auto mb-6">
                A nossa equipa desenha planos sob medida para empresas, ONGs e profissionais em Moçambique. Resposta em 24h.
              </p>
              <Link to="/contact">
                <Button size="lg" className="text-white shadow-xl" style={{ backgroundColor: "#00A859" }}>
                  Falar com consultor <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Ecossistema Tikvah — modelo de intervenção 360° (documento institucional) */}
      <TikvahEcosystem />


      {/* Sticky Footer Bar */}
      <div className="sticky bottom-0 z-40 bg-primary text-white border-t border-primary/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+258827592980" className="flex items-center gap-1.5 hover:text-accent">
              <Phone className="w-3.5 h-3.5" /> +258 82 759 2980
            </a>
            <a href="mailto:suporte.oficina.psicologo@proton.me" className="hidden md:flex items-center gap-1.5 hover:text-accent">
              <Mail className="w-3.5 h-3.5" /> suporte.oficina.psicologo@proton.me
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <span>BCI</span><span>•</span><span>m-Pesa</span><span>•</span><span>E-mola</span><span>•</span><span>CIVA 17%</span>
          </div>
        </div>
      </div>

      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <ProposalModal
        open={proposalOpen}
        onOpenChange={setProposalOpen}
        service={proposalService ? {
          slug: proposalService.slug,
          title: proposalService.title,
          area_code: proposalService.area_code,
          area_name: proposalService.area_name,
        } : null}
      />

      <Footer />
    </div>
  );
};

export default Services;
>>>>>>> a861c0b3b9ddfa91d07dcbf633b72e20d3991424
