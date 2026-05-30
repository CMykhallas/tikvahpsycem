
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Star, Users, Target, Lightbulb, Recycle } from "lucide-react";

const Values = () => {
  const values = [
    {
      icon: Shield,
      title: "Integridade Ética",
      description: "Mantemos os mais altos padrões éticos em todas as nossas ações e decisões."
    },
    {
      icon: Heart,
      title: "Compromisso com Desenvolvimento Humano Integral",
      description: "Focamos no desenvolvimento completo da pessoa, considerando todas as suas dimensões."
    },
    {
      icon: Star,
      title: "Excelência",
      description: "Buscamos a excelência em todos os serviços e processos que oferecemos."
    },
    {
      icon: Users,
      title: "Respeito Irrestrito",
      description: "Respeitamos a dignidade e individualidade de cada pessoa que atendemos."
    },
    {
      icon: Target,
      title: "Impacto Social",
      description: "Trabalhamos para gerar um impacto positivo e duradouro na sociedade."
    },
    {
      icon: Lightbulb,
      title: "Integração Estratégica de Saberes",
      description: "Combinamos conhecimentos de diferentes áreas para soluções mais eficazes."
    },
    {
      icon: Recycle,
      title: "Foco na Transformação Sustentável",
      description: "Promovemos mudanças duradouras e sustentáveis em indivíduos e organizações."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Nossos <span className="text-teal-600">Valores</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Os valores que guiam nossa missão e definem nossa identidade organizacional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Values;
