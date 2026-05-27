
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Home, Brain } from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const PSICOTERAPIA_SCHEMA = getService({
  name: "Psicoterapia em Maputo",
  description:
    "Atendimento psicoterapêutico individual, de casal e familiar com abordagens baseadas em evidência (TCC, ACT, MBSR) em Maputo, presencial e online.",
  path: "/services/psicoterapia",
  serviceType: "Psychotherapy",
});

const Psicoterapia = () => {
  const services = [
    {
      icon: Heart,
      title: "Psicoterapia Individual",
      description: "Atendimento personalizado para questões pessoais, ansiedade, depressão e desenvolvimento pessoal.",
      duration: "60 minutos"
    },
    {
      icon: Users,
      title: "Terapia de Casal",
      description: "Apoio especializado para casais que buscam melhorar sua comunicação e relacionamento.",
      duration: "90 minutos"
    },
    {
      icon: Home,
      title: "Terapia Familiar",
      description: "Intervenção sistêmica para famílias que enfrentam conflitos e desafios relacionais.",
      duration: "90 minutos"
    },
    {
      icon: Brain,
      title: "Avaliação Psicológica",
      description: "Avaliação completa para diagnóstico e orientação terapêutica personalizada.",
      duration: "120 minutos"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Serviços de <span className="text-teal-600">Psicoterapia</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Atendimento psicológico especializado com abordagens baseadas em evidência científica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
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
                      Agendar Consulta
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Precisa de mais informações?
          </h3>
          <p className="text-slate-600 mb-6">
            Nossa equipe está disponível para esclarecer suas dúvidas e ajudá-lo a escolher o melhor tratamento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/258827592980" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp: +258 82 759 2980
            </a>
            <a 
              href="mailto:suporte.oficina.psicologo@proton.me"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Email: suporte.oficina.psicologo@proton.me
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Psicoterapia;
