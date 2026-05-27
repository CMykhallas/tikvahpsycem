
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Users, TrendingUp, Target } from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const CONSULTORIA_SCHEMA = getService({
  name: "Consultoria Organizacional em Maputo",
  description:
    "Consultoria organizacional, gestão de RH, coaching executivo e assessment psicológico para empresas em Moçambique.",
  path: "/services/consultoria",
  serviceType: "Business Consulting",
});

const Consultoria = () => {
  const services = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Serviços de <span className="text-teal-600">Consultoria</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Soluções estratégicas para desenvolvimento organizacional e otimização de recursos humanos
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
            Consultoria Personalizada
          </h3>
          <p className="text-slate-600 mb-6">
            Cada organização é única. Desenvolvemos soluções customizadas para suas necessidades específicas.
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
