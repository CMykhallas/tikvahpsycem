
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConsultoriaMenuBar } from "@/components/ConsultoriaMenuBar";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Users, TrendingUp, Target, Compass, TrendingUpIcon, Heart, Zap } from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const CONSULTORIA_SCHEMA = getService({
  name: "Consultoria Organizacional em Maputo",
  description:
    "Consultoria organizacional, gestão de RH, coaching executivo e assessment psicológico para empresas em Moçambique.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Consultoria Organizacional em Maputo | Tikvah Psycem"
        description="Consultoria organizacional, gestão de RH e coaching executivo para empresas em Moçambique. Soluções estratégicas humanizadas."
        canonicalUrl="https://tikvahpsycem.lovable.app/services/consultoria"
        structuredData={CONSULTORIA_SCHEMA}
      />
      <Navbar />
      <BreadcrumbNavigation />
      
      {/* Consultoria Menu Bar */}
      <ConsultoriaMenuBar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Consultoria: <span className="text-teal-600">Navegando na Complexidade</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            Para Soluções Estratégicas e Crescimento Sustentável 🧭📈
          </p>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            A Consultoria é um serviço especializado que fornece expertise, conhecimento e insights externos 
            para auxiliar indivíduos, organizações ou governos a resolver problemas, melhorar o desempenho 
            e alcançar objetivos específicos.
          </p>
        </div>

        {/* O que é Consultoria */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">O Que É Consultoria e Qual Seu Propósito? 💡🎯</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Seus Objetivos Centrais:</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Diagnóstico de Problemas:</strong> Identificar a raiz de desafios e ineficiências</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Desenvolvimento de Estratégias:</strong> Criar planos de ação claros e viáveis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Otimização de Processos:</strong> Aprimorar fluxos de trabalho e operações</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-teal-600 mb-4">Mais Objetivos:</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Transferência de Conhecimento:</strong> Capacitar clientes para sustentabilidade</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Gestão de Mudanças:</strong> Conduzir organizações através de transições importantes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span><strong>Identificação de Oportunidades:</strong> Explorar novos mercados e abordagens</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Serviços Principais */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Nossos Serviços Integrados em Consultoria</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{service.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6">
                      <div>
                        <p className="text-sm text-slate-500">Duração</p>
                        <p className="font-semibold text-slate-700">{service.duration}</p>
                      </div>
                    </div>
                    
                    <Link to="/appointment">
                      <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                        Solicitar Consultoria
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Importância e Benefícios */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Para Que Serve e Qual Sua Importância? 🌟🚀</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Benefícios Principais:</h3>
              <ul className="space-y-2">
                <li>✓ Tomada de Decisão Informada com insights estratégicos</li>
                <li>✓ Aceleração do Crescimento e Inovação</li>
                <li>✓ Melhoria da Eficiência e Produtividade</li>
                <li>✓ Resolução de Problemas Complexos</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Mais Benefícios:</h3>
              <ul className="space-y-2">
                <li>✓ Redução de Custos Operacionais</li>
                <li>✓ Aumento da Vantagem Competitiva</li>
                <li>✓ Desenvolvimento de Lideranças</li>
                <li>✓ Sustentabilidade a Longo Prazo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Por Que Escolher */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Nosso Diferencial: Consultoria Holística com Foco no Potencial Humano 💖🌟
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {differentials.map((diff, index) => {
              const IconComponent = diff.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">{diff.title}</h3>
                    <p className="text-slate-600">{diff.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quem deve escolher */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Quem Deve Escolher Serviços de Consultoria? 🤝</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">→</span>
                  <div>
                    <strong>Startups e PMEs</strong>
                    <p className="text-sm text-slate-600">Que buscam estruturar crescimento e otimizar operações</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">→</span>
                  <div>
                    <strong>Grandes Corporações</strong>
                    <p className="text-sm text-slate-600">Para reestruturação e entrada em novos mercados</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">→</span>
                  <div>
                    <strong>Organizações em Crise</strong>
                    <p className="text-sm text-slate-600">Que necessitam de diagnóstico e plano de recuperação</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-teal-600 font-bold">→</span>
                  <div>
                    <strong>Qualquer Gestor ou Empreendedor</strong>
                    <p className="text-sm text-slate-600">Que busque soluções inovadoras e competitividade</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Por Que Apostar na Nossa Consultoria? 🚀🏆
          </h3>
          <p className="text-teal-50 mb-6 max-w-2xl mx-auto text-lg">
            Apostar nos serviços de Consultoria da Tikvah é investir em soluções inteligentes e um crescimento que perdura. 
            Com expertise que vai do financeiro ao humano, garantimos impacto sustentável e transformação significativa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Link to="/appointment">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Agendar Consulta Estratégica
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg">
                Solicitar Proposta
              </Button>
            </Link>
          </div>
          <p className="text-teal-50">
            📞 +258 82 778 5043 | 📧 suporte.oficina.psicologo@proton.me | 📱 WhatsApp: +258 82 759 2980
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Consultoria;
