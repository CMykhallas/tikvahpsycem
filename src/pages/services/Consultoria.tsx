import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Target,
  Lightbulb,
  FileText,
  BarChart3,
  Compass,
  Handshake,
  Globe,
} from "lucide-react";

const Consultoria = () => {
  const services = [
    {
      icon: Building,
      title: "Consultoria Organizacional & Gestão Estratégica",
      description: "Diagnóstico organizacional, alinhamento de processos, gestão de mudança e otimização de estrutura para maior eficiência, desempenho e sustentabilidade.",
      duration: "120 minutos"
    },
    {
      icon: Users,
      title: "Gestão de Recursos Humanos",
      description: "Desenho de sistemas de recrutamento, seleção, avaliação de desempenho, desenvolvimento de competências, plano de carreira e gestão de clima organizacional.",
      duration: "90 minutos"
    },
    {
      icon: TrendingUp,
      title: "Coaching Executivo & Desenvolvimento de Liderança",
      description: "Programas individuais de coaching para lideranças, com foco em tomada de decisão, gestão de conflitos, gestão de estresse e maximização de performance executiva.",
      duration: "90 minutos"
    },
    {
      icon: Target,
      title: "Assessment Psicológico Organizacional",
      description: "Avaliação psicológica estruturada para seleção, sucessão, posicionamento e desenvolvimento de talentos, com base em instrumentos validados e alinhados a objetivos estratégicos.",
      duration: "180 minutos"
    },
    {
      icon: Lightbulb,
      title: "Consultoria Científica & Técnica Organizacional",
      description: "Suporte em desenho, avaliação e acompanhamento de projetos de pesquisa, intervenção social e programas institucionais, com rigor metodológico e foco em resultados mensuráveis.",
      duration: "90 minutos"
    },
    {
      icon: Globe,
      title: "Consultoria em Negócios & Desenvolvimento de Modelo",
      description: "Análise de negócio, modelagem de modelo operacional, planeamento estratégico, gestão de risco e apoio à expansão de portfólio em contexto local e regional.",
      duration: "120 minutos"
    },
    {
      icon: Compass,
      title: "Gestão de Projetos & Monitoria de Impacto",
      description: "Suporte integral à gestão de projetos sociais, de saúde e educacionais, incluindo concepção, financiamento, execução, monitoria e avaliação de impacto.",
      duration: "90 minutos"
    },
    {
      icon: FileText,
      title: "Governação, Compliance & Políticas Internas",
      description: "Desenho de políticas internas, protocolos de governança, gestão de risco e conformidade regulatória, alinhados a standards internacionais e contexto local.",
      duration: "90 minutos"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Serviços de <span className="text-teal-600">Consultoria</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Soluções estratégicas de desenvolvimento organizacional, gestão de talentos e governança, construídas com base em evidência e adaptadas ao contexto moçambicano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Solicitar Consultoria
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Consultoria Personalizada e Integrada
          </h3>
          <p className="text-slate-600 mb-6">
            Cada organização é única. A Tikvah desenha soluções customizadas, integrando gestão estratégica, recursos humanos, psicologia organizacional, governança e ferramentas de monitoria e avaliação de impacto.
          </p>
          <Link to="/contact">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Consultoria;
