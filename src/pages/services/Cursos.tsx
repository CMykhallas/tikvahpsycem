
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, Users, MessageCircle, Trophy } from "lucide-react";
import { getService } from "@/lib/seo/jsonld";

const CURSOS_SCHEMA = getService({
  name: "Cursos de Psicologia e Desenvolvimento Humano",
  description:
    "Cursos certificados em psicologia aplicada, mindfulness, inteligência emocional e desenvolvimento humano em Maputo.",
  path: "/services/cursos",
  serviceType: "Educational Course",
});

const Cursos = () => {
  const courses = [
    {
      icon: Brain,
      title: "Inteligência Emocional",
      description: "Desenvolva suas competências emocionais para melhor relacionamento pessoal e profissional.",
      duration: "240 minutos",
      level: "Iniciante",
      modules: ["Autoconhecimento", "Autorregulação", "Empatia", "Habilidades Sociais"]
    },
    {
      icon: Users,
      title: "Liderança e Gestão",
      description: "Aprenda técnicas avançadas de liderança e gestão de equipes para maximizar resultados.",
      duration: "360 minutos",
      level: "Intermediário",
      modules: ["Estilos de Liderança", "Motivação", "Delegação", "Gestão de Conflitos"]
    },
    {
      icon: MessageCircle,
      title: "Comunicação Eficaz",
      description: "Melhore suas habilidades de comunicação para relacionamentos mais produtivos.",
      duration: "180 minutos",
      level: "Iniciante",
      modules: ["Comunicação Verbal", "Linguagem Corporal", "Escuta Ativa", "Feedback"]
    },
    {
      icon: Trophy,
      title: "Desenvolvimento Pessoal",
      description: "Programa completo para autodesenvolvimento e realização de objetivos pessoais.",
      duration: "300 minutos",
      level: "Todos os níveis",
      modules: ["Definição de Metas", "Produtividade", "Mindset", "Planejamento"]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Iniciante": return "bg-green-100 text-green-800";
      case "Intermediário": return "bg-yellow-100 text-yellow-800";
      case "Avançado": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Cursos de Psicologia e Desenvolvimento Humano | Tikvah Psycem"
        description="Cursos certificados em psicologia aplicada, mindfulness e desenvolvimento humano em Maputo."
        canonicalUrl="https://tikvahpsycem.lovable.app/services/cursos"
        structuredData={CURSOS_SCHEMA}
      />
      <Navbar />
      <BreadcrumbNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            <span className="text-teal-600">Cursos</span> de Formação
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Programas estruturados para desenvolvimento de competências pessoais e profissionais
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {courses.map((course, index) => {
            const IconComponent = course.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{course.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{course.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-2">Módulos do Curso:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="flex items-center text-sm text-slate-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          {module}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div>
                      <p className="text-sm text-slate-500">Duração Total</p>
                      <p className="font-semibold text-slate-700">{course.duration}</p>
                    </div>
                  </div>
                  
                  <Link to="/appointment">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Inscrever-se
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Cursos In-Company
          </h3>
          <p className="text-slate-600 mb-6">
            Oferecemos todos os nossos cursos no formato in-company, adaptados às necessidades da sua organização.
          </p>
          <Link to="/contact">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
              Solicitar Orçamento
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cursos;
