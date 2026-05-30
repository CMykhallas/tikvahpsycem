
import { Button } from "@/components/ui/button";
import { ArrowDown, Users, Award, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { LazyImage } from "./LazyImage";
import africanBusinessMeeting from "@/assets/african-business-meeting-maputo.jpg";
import africanPsychologist from "@/assets/african-psychologist-professional.jpg";
import africanCorporateTraining from "@/assets/african-corporate-training.jpg";
import africanFamilyTherapy from "@/assets/african-family-therapy-session.jpg";

export const Hero = () => {
  const stats = [
    { icon: Users, label: "Clientes", value: "1000+" },
    { icon: Award, label: "Anos", value: "5+" },
    { icon: Shield, label: "Certificações", value: "15+" },
    { icon: Star, label: "Satisfação", value: "98%" }
  ];

  return (
    <article className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-slate-100" aria-hidden="true"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <header className="text-center lg:text-left">
            <div className="space-y-8 animate-fade-in">

              {/* Main headline com H1 semântico */}
              <hgroup className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight">
                  <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Tikvah
                  </span>
                  <span className="text-3xl md:text-4xl text-slate-600 block mt-2">
                    Psychological Center
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                  Desenvolvimento humano integral através de metodologia científica híbrida proprietária em Maputo, Moçambique
                </p>
              </hgroup>

              {/* Call to action buttons */}
              <nav className="flex flex-wrap justify-center lg:justify-start items-center gap-3" aria-label="Ações principais">
                <Link to="/appointment" aria-describedby="cta-appointment">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    id="cta-appointment"
                  >
                    Agendar Consulta
                  </Button>
                </Link>
                <Link to="/services" aria-describedby="cta-services">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-full text-base font-semibold transition-all duration-300"
                    id="cta-services"
                  >
                    Nossos Serviços
                  </Button>
                </Link>
              </nav>

              {/* Statistics com lista semântica */}
              <section aria-labelledby="stats-heading" className="pt-8">
                <h2 id="stats-heading" className="sr-only">Estatísticas da Tikvah</h2>
                <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/80 rounded-xl shadow-lg mb-2">
                          <IconComponent className="w-6 h-6 text-teal-600" />
                        </div>
                        <dt className="text-2xl font-bold text-slate-800">{stat.value}</dt>
                        <dd className="text-sm text-slate-600 font-medium">{stat.label}</dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            </div>
          </header>

          {/* Professional African Images Section */}
          <section className="relative" aria-label="Ambientes profissionais">
            <div className="relative max-w-lg mx-auto">
              {/* Main Image - African Business Meeting */}
              <div className="relative z-20">
                <img
                  src={africanBusinessMeeting}
                  alt="Reunião profissional de negócios em Maputo com executivos africanos discutindo estratégias em ambiente corporativo moderno"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                  width={800}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              {/* Floating Professional Images */}
              <div className="absolute -top-6 -left-6 z-10 transform rotate-6">
                <LazyImage
                  src={africanPsychologist}
                  alt="Psicóloga africana profissional em consultório moderno de psicologia em Moçambique"
                  className="w-48 h-32 object-cover rounded-2xl shadow-xl border-4 border-white"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 z-10 transform -rotate-6">
                <LazyImage
                  src={africanCorporateTraining}
                  alt="Treinamento corporativo profissional com equipe africana em sala de conferências moderna"
                  className="w-48 h-32 object-cover rounded-2xl shadow-xl border-4 border-white"
                />
              </div>

              <div className="absolute top-1/2 -right-12 z-30 transform rotate-12 hidden xl:block">
                <LazyImage
                  src={africanFamilyTherapy}
                  alt="Sessão de terapia familiar em ambiente profissional de luxo em Maputo"
                  className="w-40 h-28 object-cover rounded-xl shadow-xl border-4 border-white"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>
          </section>
        </div>

        {/* Mission statement */}
        <section className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20 shadow-lg">
          <blockquote className="text-lg text-slate-700 italic text-center">
            <p>
              "Nossa missão é empoderar indivíduos, famílias e organizações para o autoconhecimento, 
              crescimento pessoal e transformação sustentável através de uma abordagem integrada e humanizada."
            </p>
            <cite className="sr-only">Tikvah Psychological Center</cite>
          </blockquote>
        </section>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" role="presentation" aria-hidden="true">
        <div className="animate-bounce">
          <ArrowDown className="w-6 h-6 text-slate-400" />
        </div>
      </div>
    </article>
  );
};
