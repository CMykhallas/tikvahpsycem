
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConsultoriaMenuBar } from "@/components/ConsultoriaMenuBar";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building, Users, TrendingUp, Target, Compass, Heart, Zap, 
  BarChart3, Briefcase, Lightbulb, Shield, ArrowRight, CheckCircle2,
  Star, Award, Layers
} from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const CONSULTORIA_SCHEMA = getService({
  name: "Consultoria Organizacional Premium em Maputo",
  description:
    "Consultoria organizacional de alto nível, gestão de RH, coaching executivo, consultoria estratégica e transformação digital para empresas em Moçambique.",
  path: "/services/consultoria",
  serviceType: "Business Consulting",
});

const Consultoria = () => {
  const mainServices = [
    {
      icon: Building,
      title: "Consultoria Organizacional",
      description: "Desenvolvimento e otimização de processos organizacionais para maior eficiência e produtividade.",
      duration: "120 minutos"
    },
    {
      icon: Users,
      title: "Gestão de Recursos Humanos",
      description: "Estratégias para recrutamento, desenvolvimento e retenção de talentos na sua organização.",
      duration: "90 minutos"
    },
    {
      icon: TrendingUp,
      title: "Coaching Executivo",
      description: "Desenvolvimento de lideranças para maximizar o potencial e performance executiva.",
      duration: "90 minutos"
    },
    {
      icon: Target,
      title: "Assessment Psicológico Organizacional",
      description: "Avaliação psicológica para seleção, desenvolvimento e posicionamento de colaboradores.",
      duration: "180 minutos"
    }
  ];

  const consultoriaClasses = [
    {
      icon: Briefcase,
      title: "Consultoria Estratégica e de Gestão",
      tagline: "Visão de Longo Prazo & Excelência Corporativa",
      description: "Definição de visão corporativa, objetivos de longo prazo e planos de ação estratégicos.",
      highlights: [
        "Reestruturação organizacional",
        "Expansão para novos mercados",
        "Adaptação a cenários macroeconômicos",
        "Arquitetura do futuro corporativo"
      ],
      benefits: "Alinhamento organizacional, otimização de recursos e ampliação de capacidade competitiva",
      audience: "Empresas em transformação, entrada em novos mercados ou reposicionamento estratégico"
    },
    {
      icon: BarChart3,
      title: "Consultoria de Operações",
      tagline: "Eficiência Máxima & Valor Otimizado",
      description: "Otimização de processos internos para máxima eficiência e eficácia operacional.",
      highlights: [
        "Reengenharia da cadeia de suprimentos",
        "Melhoria contínua da produção",
        "Automação de fluxos de trabalho",
        "Maximização de valor entregue"
      ],
      benefits: "Redução de custos operacionais, aumento de produtividade e elevação dos padrões de qualidade",
      audience: "Empresas que buscam reduzir custos e otimizar produtividade"
    },
    {
      icon: Users,
      title: "Consultoria de Recursos Humanos",
      tagline: "Capital Humano & Desenvolvimento de Talentos",
      description: "Gestão estratégica e desenvolvimento integral do capital humano organizacional.",
      highlights: [
        "Planejamento estratégico de talentos",
        "Recrutamento e seleção especializada",
        "Gestão de desempenho",
        "Desenvolvimento de lideranças"
      ],
      benefits: "Atração e retenção de talentos, clima organizacional saudável e lideranças robustas",
      audience: "Organizações que valorizam o desenvolvimento humano"
    },
    {
      icon: TrendingUp,
      title: "Consultoria Financeira",
      tagline: "Solidez Financeira & Crescimento Sustentável",
      description: "Orientação especializada na administração das finanças corporativas.",
      highlights: [
        "Planejamento financeiro estratégico",
        "Análise de viabilidade de investimentos",
        "Gestão de fluxo de caixa",
        "Otimização tributária"
      ],
      benefits: "Estabilidade financeira, decisões de investimento assertivas e rentabilidade maximizada",
      audience: "Empresas que buscam saúde financeira e crescimento responsável"
    },
    {
      icon: Lightbulb,
      title: "Consultoria de Marketing",
      tagline: "Visibilidade de Marca & Engajamento de Cliente",
      description: "Desenvolvimento de estratégias de marketing para fortalecer marca e impulsionar engajamento.",
      highlights: [
        "Análise de mercado aprofundada",
        "Posicionamento de marca estratégico",
        "Campanhas multicanal (digital e offline)",
        "Otimização de estratégias de vendas"
      ],
      benefits: "Ampla visibilidade de marca, melhoria de percepção e expansão de base de clientes",
      audience: "Negócios que buscam crescimento de vendas e fortalecer presença no mercado"
    },
    {
      icon: Shield,
      title: "Consultoria em Tecnologia da Informação",
      tagline: "Transformação Digital & Segurança Cibernética",
      description: "Estratégia, implementação e gestão de sistemas de informação e infraestrutura tecnológica.",
      highlights: [
        "Estratégia de transformação digital",
        "Soluções de software inovadoras",
        "Segurança cibernética robusta",
        "Otimização de infraestrutura"
      ],
      benefits: "Operações eficientes, seguras e inovadoras, promoção de transformação digital",
      audience: "Empresas em processo de transformação digital"
    }
  ];

  const differentials = [
    {
      icon: Compass,
      title: "Abordagem Holística",
      description: "Integramos rigor técnico com compreensão profunda da psicologia humana e organizacional"
    },
    {
      icon: Heart,
      title: "Foco no Potencial Humano",
      description: "Soluções que não apenas são eficientes, mas também sustentáveis e inspiradoras para sua equipe"
    },
    {
      icon: Zap,
      title: "Resultados Duradouros",
      description: "Consultoria que gera impacto real, transformando complexidades em oportunidades de sucesso"
    }
  ];

  const whyChooseTikvah = [
    {
      icon: Award,
      title: "Visão Estratégica Aprofundada",
      description: "Nossas análises vão além dos dados superficiais, mergulhando nas causas-raiz dos desafios"
    },
    {
      icon: Layers,
      title: "Expertise Multidisciplinar",
      description: "Equipe que integra psicologia, gestão, tecnologia e ciências comportamentais"
    },
    {
      icon: CheckCircle2,
      title: "Foco em Implementação",
      description: "Parceria na execução, assegurando que recomendações se traduzam em resultados tangíveis"
    },
    {
      icon: Star,
      title: "Abordagem Centrada no Ser Humano",
      description: "Otimizamos performance organizacional através do bem-estar e desenvolvimento"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-50 to-blue-50">
      <SEOHead
        title="Consultoria Organizacional Premium em Maputo | Tikvah Psychological Center"
        description="Consultoria organizacional de alto nível. Estratégia, RH, operações, financeira e transformação digital. Soluções humanizadas para crescimento sustentável em Moçambique."
        keywords="consultoria estratégica, gestão organizacional, consultoria RH, transformação digital, coaching executivo Maputo"
        canonicalUrl="https://tikvahpsycem.lovable.app/services/consultoria"
        structuredData={CONSULTORIA_SCHEMA}
      />
      <Navbar />
      <BreadcrumbNavigation />
      
      {/* Consultoria Menu Bar */}
      <ConsultoriaMenuBar />
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
              ✨ Consultoria de Alto Nível Premium
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Consultoria: <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Navegando na Complexidade</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-slate-700 font-semibold mb-4">
              Para Soluções Estratégicas e Crescimento Sustentável 🧭📈
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4 leading-relaxed">
              A Consultoria é um serviço especializado que fornece expertise, conhecimento e insights externos 
              para auxiliar indivíduos, organizações ou governos a resolver problemas, melhorar o desempenho 
              e alcançar objetivos específicos. Na Tikvah, transcendemos as fronteiras tradicionais, oferecendo 
              soluções holísticas que combinam rigor técnico com profunda compreensão do comportamento humano.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">12+</div>
              <div className="text-sm text-slate-600">Áreas de Especialização</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">6+</div>
              <div className="text-sm text-slate-600">Classes de Consultoria</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">100%</div>
              <div className="text-sm text-slate-600">Foco em Resultados</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">∞</div>
              <div className="text-sm text-slate-600">Impacto Sustentável</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">🧭</div>
              <div className="text-sm text-slate-600">Visão Estratégica</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur rounded-lg border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">💖</div>
              <div className="text-sm text-slate-600">Humanística</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* O que é Consultoria - Premium Section */}
        <section className="py-12 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="sticky top-20">
              <div className="inline-block mb-4 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                Fundamentos
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                O Que É Consultoria e Qual Seu Propósito? 💡🎯
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                A Consultoria tem como propósito central agregar valor através do aconselhamento especializado 
                e da implementação de soluções eficazes, transformando desafios em oportunidades estratégicas.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: "Diagnóstico de Problemas", desc: "Identificar a raiz de desafios e ineficiências em diversas áreas" },
                { title: "Desenvolvimento de Estratégias", desc: "Criar planos de ação claros e viáveis para alcançar metas" },
                { title: "Otimização de Processos", desc: "Aprimorar fluxos de trabalho, tecnologias e operações" },
                { title: "Transferência de Conhecimento", desc: "Capacitar clientes com novas habilidades e insights" },
                { title: "Gestão de Mudanças", desc: "Conduzir organizações através de transições importantes" },
                { title: "Identificação de Oportunidades", desc: "Explorar novos mercados, produtos ou abordagens" },
              ].map((item, idx) => (
                <div key={idx} className="group p-4 bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2 group-hover:scale-110 transition-transform" />
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Importância e Benefícios - Premium Section */}
        <section className="py-12 mb-16 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold mb-8 text-center">Para Que Serve e Qual Sua Importância? 🌟🚀</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📊", title: "Tomada de Decisão Informada", desc: "Insights e dados para escolhas estratégicas" },
              { icon: "🚀", title: "Aceleração do Crescimento", desc: "Novas ideias e metodologias para impulsionar avanço" },
              { icon: "⚡", title: "Melhoria da Eficiência", desc: "Otimiza processos e uso de recursos" },
              { icon: "🎯", title: "Resolução de Problemas Complexos", desc: "Aborda desafios que a organização não consegue resolver" },
              { icon: "💰", title: "Redução de Custos", desc: "Identifica desperdícios e ineficiências" },
              { icon: "🏆", title: "Vantagem Competitiva", desc: "Diferencia a organização no mercado" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-teal-50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Serviços Principais */}
        <section className="py-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Serviços Principais Integrados</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Soluções de alto nível especialmente desenhadas para sua organização</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 group border-2 border-slate-200 hover:border-teal-500">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6 flex items-center space-x-2 text-slate-500">
                      <span className="text-sm">⏱️ Duração:</span>
                      <span className="font-semibold text-slate-700">{service.duration}</span>
                    </div>
                    
                    <Link to="/appointment" className="w-full block">
                      <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold">
                        Solicitar Consultoria <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Classes de Consultoria - Premium Grid */}
        <section className="py-16 mb-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🏢 Ecossistema de Consultoria
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Outras Classes de Consultoria Existentes</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Um ecossistema vasto e diversificado de soluções estratégicas para os desafios multifacetados 
              que as organizações contemporâneas enfrentam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultoriaClasses.map((classe, idx) => {
              const IconComponent = classe.icon;
              return (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  
                  <Card className="relative h-full border-2 border-slate-200 hover:border-teal-500 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{classe.title}</h3>
                      <p className="text-sm text-teal-600 font-semibold mb-3 italic">{classe.tagline}</p>
                      
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{classe.description}</p>
                      
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destaques</p>
                        <ul className="space-y-1">
                          {classe.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start">
                              <span className="text-teal-600 mr-2">▸</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-200 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Agregado</p>
                        <p className="text-sm text-slate-700">{classe.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </section>

        {/* Diferencial Tikvah */}
        <section className="py-16 mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Nosso Diferencial: Consultoria Holística com Foco no Potencial Humano 💖🌟
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {differentials.map((diff, index) => {
              const IconComponent = diff.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-teal-500">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{diff.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{diff.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Por que escolher Tikvah */}
        <section className="py-16 mb-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-12 border-2 border-slate-200">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Por Que Escolher a Tikvah? 🏆
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {whyChooseTikvah.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg p-8 border-2 border-teal-200">
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              <strong>Na Tikvah Psychological Center & Multiservice</strong>, elevamos o conceito de consultoria. 
              Nossa abordagem integrativa e multidisciplinar nos permite transcender as fronteiras tradicionais das áreas de consultoria, 
              oferecendo soluções holísticas que combinam o rigor técnico e científico com uma profunda compreensão do comportamento humano 
              e das dinâmicas organizacionais.
            </p>
            <p className="text-slate-700 text-lg font-semibold text-teal-600">
              Não somos apenas consultores; somos catalisadores de transformação. ✨
            </p>
          </div>
        </section>

        {/* Urgência CTA */}
        <section className="py-16 mb-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Não Adie Mais o Sucesso! ⏳</h2>
            <p className="text-xl text-gray-200 mb-4 leading-relaxed">
              Não permita que oportunidades sejam perdidas! O cenário atual exige decisões ágeis e embasadas. 
              A Tikvah está preparada para ser o catalisador da sua transformação, fornecendo a clareza e a direção 
              que sua empresa necessita para prosperar.
            </p>
            <p className="text-lg text-teal-200 font-semibold mb-8">
              Sua empresa merece decisões embasadas e soluções que realmente funcionam. 🚀
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/appointment">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg font-bold">
                  Agendar Consulta Estratégica →
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-bold">
                  Solicitar Proposta Customizada →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section - Premium */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">
            Conecte-se com a Tikvah e Redefina o Sucesso do Seu Negócio! 📞📧
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            Sua jornada para a excelência começa agora. Fale com nossos especialistas e descubra como nossa consultoria 
            pode impulsionar seu diferencial competitivo e transformar seu potencial em realidade.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href="mailto:suporte.oficina.psicologo@proton.me" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-teal-500">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
                  <p className="text-teal-600 font-semibold group-hover:underline">
                    suporte.oficina.psicologo@proton.me
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="https://wa.me/258827592980" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-blue-500">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp</h3>
                  <p className="text-blue-600 font-semibold group-hover:underline">
                    +258 82 759 2980
                  </p>
                </CardContent>
              </Card>
            </a>

            <a href="tel:+258827785043" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-teal-500">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Telefone</h3>
                  <p className="text-teal-600 font-semibold group-hover:underline">
                    +258 82 778 5043
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          <div className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl p-8 border-2 border-teal-200">
            <p className="text-slate-700 font-semibold text-lg">
              Contacte-nos Hoje e Transforme Seu Potencial em Realidade! 🌟
            </p>
            <p className="text-slate-600 mt-2">
              Estamos preparados para guiá-lo com expertise e uma visão 360º, transformando complexidades em oportunidades de sucesso e inovação.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Consultoria;
