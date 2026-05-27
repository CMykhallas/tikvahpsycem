
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Compass, Zap, Users, Shield } from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const WORKSHOPS_SCHEMA = getService({
  name: "Workshops e Formações Práticas",
  description:
    "Workshops experienciais sobre liderança, gestão de stress, comunicação e bem-estar, conduzidos por psicólogos da Tikvah em Maputo.",
  path: "/services/workshops",
  serviceType: "Workshop",
});

const Workshops = () => {
  const workshops = [
    {
      icon: Compass,
      title: "Mindfulness e Bem-estar",
      description: "Técnicas práticas de mindfulness para redução do stress e melhoria da qualidade de vida.",
      duration: "180 minutos",
      participants: "8-12",
      topics: ["Meditação", "Respiração", "Atenção Plena", "Relaxamento"]
    },
    {
      icon: Zap,
      title: "Gestão de Stress",
      description: "Estratégias eficazes para identificar, compreender e gerir o stress no ambiente pessoal e profissional.",
      duration: "240 minutos",
      participants: "6-10",
      topics: ["Identificação do Stress", "Técnicas de Relaxamento", "Time Management", "Autocuidado"]
    },
    {
      icon: Users,
      title: "Trabalho em Equipe",
      description: "Desenvolva competências para colaboração eficaz e sinergia em equipas de trabalho.",
      duration: "300 minutos",
      participants: "8-15",
      topics: ["Comunicação", "Confiança", "Roles & Responsabilidades", "Dinâmicas de Grupo"]
    },
    {
      icon: Shield,
      title: "Resolução de Conflitos",
      description: "Aprenda técnicas de mediação e resolução construtiva de conflitos interpessoais.",
      duration: "240 minutos",
      participants: "6-12",
      topics: ["Mediação", "Negociação", "Comunicação Assertiva", "Gestão Emocional"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Workshops e Formações Práticas | Tikvah Psycem"
        description="Workshops experienciais sobre liderança, gestão de stress, comunicação e bem-estar em Maputo."
        canonicalUrl="https://tikvahpsycem.lovable.app/services/workshops"
        structuredData={WORKSHOPS_SCHEMA}
      />
      <Navbar />
      <BreadcrumbNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            <span className="text-teal-600">Workshops</span> Práticos
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experiências de aprendizado intensivo com foco na aplicação prática de conhecimentos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {workshops.map((workshop, index) => {
            const IconComponent = workshop.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      {workshop.participants} participantes
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{workshop.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{workshop.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-2">Tópicos Abordados:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {workshop.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center text-sm text-slate-600">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div>
                      <p className="text-sm text-slate-500">Duração</p>
                      <p className="font-semibold text-slate-700">{workshop.duration}</p>
                    </div>
                  </div>
                  
                  <Link to="/appointment">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      Participar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Workshops Customizados
          </h3>
          <p className="text-slate-600 mb-6">
            Desenvolvemos workshops específicos para as necessidades da sua equipe ou organização.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3">
                Solicitar Workshop
              </Button>
            </Link>
            <a 
              href="https://wa.me/258827592980" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="px-8 py-3">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Workshops;
