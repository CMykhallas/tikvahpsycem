
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Users, Heart, TrendingUp, Award } from "lucide-react";

const Career = () => {
  const opportunities = [
    {
      title: "Psicólogo(a) Clínico",
      department: "Psicoterapia",
      type: "Tempo Integral",
      location: "Maputo",
      requirements: [
        "Licenciatura em Psicologia",
        "Experiência mínima de 2 anos",
        "Especialização em TCC preferencial",
        "Registro no conselho profissional"
      ],
      responsibilities: [
        "Atendimento psicológico individual",
        "Elaboração de relatórios",
        "Participação em reuniões de equipe",
        "Desenvolvimento profissional contínuo"
      ]
    },
    {
      title: "Consultor(a) Organizacional",
      department: "Consultoria",
      type: "Meio Período",
      location: "Maputo/Remoto",
      requirements: [
        "Formação em Psicologia Organizacional ou áreas afins",
        "Experiência em consultoria empresarial",
        "Conhecimentos em gestão de RH",
        "Habilidades de apresentação"
      ],
      responsibilities: [
        "Desenvolvimento de projetos de consultoria",
        "Facilitação de workshops",
        "Análise organizacional",
        "Relatórios e apresentações"
      ]
    },
    {
      title: "Facilitador(a) de Cursos",
      department: "Formação",
      type: "Freelancer",
      location: "Maputo",
      requirements: [
        "Experiência em formação corporativa",
        "Conhecimento em desenvolvimento humano",
        "Habilidades de comunicação",
        "Disponibilidade para fins de semana"
      ],
      responsibilities: [
        "Facilitação de cursos e workshops",
        "Preparação de materiais didáticos",
        "Avaliação de participantes",
        "Feedback e relatórios"
      ]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Ambiente Acolhedor",
      description: "Trabalhe em um ambiente que valoriza o bem-estar e desenvolvimento pessoal"
    },
    {
      icon: TrendingUp,
      title: "Crescimento Profissional",
      description: "Oportunidades contínuas de desenvolvimento e especialização"
    },
    {
      icon: Users,
      title: "Equipe Multidisciplinar",
      description: "Colabore com profissionais experientes de diversas áreas"
    },
    {
      icon: Award,
      title: "Reconhecimento",
      description: "Valorização do trabalho e contribuições de cada membro da equipe"
    },
    {
      icon: GraduationCap,
      title: "Formação Contínua",
      description: "Investimento em formação e atualização profissional"
    },
    {
      icon: Briefcase,
      title: "Projetos Inovadores",
      description: "Participe de projetos pioneiros em desenvolvimento humano"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tempo Integral": return "bg-green-100 text-green-800";
      case "Meio Período": return "bg-blue-100 text-blue-800";
      case "Freelancer": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Carreiras na <span className="text-teal-600">Tikvah</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Junte-se à nossa equipe e faça parte de uma organização que transforma vidas
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Por que trabalhar conosco?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Job Opportunities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Oportunidades Atuais
          </h2>
          <div className="space-y-6">
            {opportunities.map((job, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{job.department}</Badge>
                        <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                        <Badge variant="outline">{job.location}</Badge>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 mt-4 lg:mt-0">
                      Candidatar-se
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Requisitos:</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start text-slate-600">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Responsabilidades:</h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className="flex items-start text-slate-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Não encontrou a vaga ideal?
          </h3>
          <p className="text-slate-600 mb-6">
            Envie seu currículo e carta de apresentação. Entraremos em contato quando surgir uma oportunidade adequada ao seu perfil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:carreiras@tikvah.co.mz" 
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-colors"
            >
              Enviar Currículo
            </a>
            <a 
              href="https://wa.me/258827592980" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Career;
