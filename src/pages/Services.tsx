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
} from "lucide-react";
import consultoriaNegocios from "@/assets/consultoria-negocios.jpg";
import formacaoDesenvolvimento from "@/assets/formacao-desenvolvimento.jpg";

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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
          </div>
        </div>
      </section>

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

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {mainServices.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover-elegant group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{category.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {category.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center text-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {service}
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={category.link}>
                      <Button variant="gradient" className="w-full">
                        Saiba Mais
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Training Image Banner */}
          <div className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={formacaoDesenvolvimento} 
              alt="Sessão de formação profissional em Maputo"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Formação de Excelência</h3>
              <p className="text-white/90">Desenvolvimento profissional contínuo para sua equipe</p>
            </div>
          </div>

          {/* Comprehensive Services */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 text-center">
              Ecossistema <span className="text-gradient-primary">Completo</span> de Serviços
            </h3>
            <p className="text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
              Nossa oferta abrangente de serviços especializados para atender todas as suas necessidades de desenvolvimento pessoal, profissional e organizacional.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {comprehensiveServices.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="hover-elegant">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <IconComponent className="w-6 h-6 text-primary mr-3" />
                        <h4 className="text-lg font-semibold text-foreground">{category.category}</h4>
                      </div>
                      <ul className="space-y-2">
                        {category.services.map((service, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground text-sm">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Service Quality Commitment */}
          <div className="bg-card rounded-3xl p-12 border border-border">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Compromisso com a <span className="text-gradient-primary">Excelência</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Todos os nossos serviços são desenvolvidos com base em evidências científicas, melhores práticas internacionais e adaptados à realidade moçambicana.
              </p>
            </div>

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

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/contact">
                <Button variant="gradient" size="lg">
                  Solicitar Orçamento
                </Button>
              </Link>
              <Link to="/appointment">
                <Button variant="outline" size="lg">
                  Agendar Consulta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
