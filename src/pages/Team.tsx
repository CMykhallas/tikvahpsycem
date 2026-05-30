import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Brain, 
  Heart, 
  GraduationCap,
  Building2,
  Stethoscope,
  UserCheck,
  Briefcase,
  Award,
  Target,
  Lightbulb,
  Shield,
  Globe,
  Zap,
  TreePine,
  Wrench,
  Code,
  PenTool,
  TrendingUp,
  DollarSign,
  Scale,
  HeadphonesIcon
} from "lucide-react";
import { Link } from "react-router-dom";

// Import professional images
import corporateWorkshopSenior from "@/assets/corporate-workshop-senior.jpg";
import psychologistSeniorMaputo from "@/assets/psychologist-senior-maputo.jpg";

const Team = () => {
  const specializations = [
    {
      title: "Especialistas em Saúde Mental e Apoio Psico-emocional",
      description: "Profissionais dedicados ao cuidado emocional e tratamento psicológico",
      icon: <Brain className="w-8 h-8 text-primary" />,
      specialists: [
        "Psicólogos Clínicos",
        "Psicoterapeutas",
        "Psicanalistas", 
        "Psicoterapeutas Familiares",
        "Psicólogos do Desporto",
        "Psicoterapeutas Infantil e Adolescente"
      ],
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Profissionais em Contextos Aplicados",
      description: "Especialistas em ambientes educacionais, organizacionais e de saúde",
      icon: <Building2 className="w-8 h-8 text-primary" />,
      specialists: [
        "Psicólogos Organizacionais",
        "Psicólogos Educacionais", 
        "Psicólogos da Saúde"
      ],
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Suporte Terapêutico e Social",
      description: "Profissionais de apoio social e reabilitação",
      icon: <Heart className="w-8 h-8 text-primary" />,
      specialists: [
        "Assistentes Sociais",
        "Terapeutas Ocupacionais",
        "Terapeutas de Fala",
        "Terapeuta Pastoral"
      ],
      color: "from-pink-500 to-purple-500"
    }
  ];

  const consultants = [
    {
      category: "Saúde e Bem-estar",
      icon: <Stethoscope className="w-6 h-6 text-primary" />,
      specialists: ["Saúde"]
    },
    {
      category: "Agropecuária e Ambiente",
      icon: <TreePine className="w-6 h-6 text-green-600" />,
      specialists: ["Agropecuária", "Agrónomos"]
    },
    {
      category: "Engenharia e Tecnologia",
      icon: <Wrench className="w-6 h-6 text-blue-600" />,
      specialists: ["Eletricidade e Recursos Petrolíferos", "Engenheiros", "TIs (Tecnologia da Informação)", "Help-Desks"]
    },
    {
      category: "Projetos e Desenvolvimento Social",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      specialists: ["Projetos Sociais e Voluntariado", "Especialistas em Monitoria e Avaliação"]
    },
    {
      category: "Segurança e Auditoria",
      icon: <Shield className="w-6 h-6 text-red-600" />,
      specialists: ["Segurança Eletrônica", "Auditores"]
    },
    {
      category: "Educação e Formação",
      icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
      specialists: ["Professores e Pedagogos", "Facilitadores de Workshops"]
    },
    {
      category: "Design e Comunicação",
      icon: <PenTool className="w-6 h-6 text-pink-600" />,
      specialists: ["Designers Gráficos", "Especialistas de Marketing e Publicidade"]
    },
    {
      category: "Gestão e Finanças",
      icon: <DollarSign className="w-6 h-6 text-yellow-600" />,
      specialists: ["Financeiros", "Gestores Empresariais e de Recursos Humanos", "Administradores", "Economistas"]
    },
    {
      category: "Recursos Humanos e Recrutamento",
      icon: <UserCheck className="w-6 h-6 text-teal-600" />,
      specialists: ["Recrutadores"]
    },
    {
      category: "Jurídico",
      icon: <Scale className="w-6 h-6 text-gray-700" />,
      specialists: ["Advogados e Juristas"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="team-hero relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${corporateWorkshopSenior})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Direção <span className="text-gradient-accent">Administrativa</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Equipe multidisciplinar de profissionais altamente qualificados
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              O Coletivo de <span className="text-gradient-primary">Profissionais</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Na Tikvah Psycem, a excelência de nossos serviços e a profundidade de nosso impacto residem na qualidade e na dedicação de nossa equipa. Somos um coletivo de profissionais altamente qualificados, cuja diversidade de especializações e experiência é o alicerce que nos permite oferecer um atendimento verdadeiramente abrangente, eficaz e humanizado.
            </p>
          </div>

          {/* Core Team Image */}
          <div className="relative mb-20">
            <img 
              src={psychologistSeniorMaputo} 
              alt="Equipe de psicólogos profissionais em Maputo"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent rounded-3xl" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Compromisso com a Excelência</h3>
              <p className="text-white/90">Cada membro compartilha o compromisso genuíno em promover o bem-estar</p>
            </div>
          </div>

          {/* Main Specializations */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 text-center">
              Especialidades <span className="text-gradient-primary">Principais</span>
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {specializations.map((spec, index) => (
                <Card key={index} className="hover-elegant overflow-hidden">
                  <div className={`bg-gradient-to-r ${spec.color} p-6 text-white`}>
                    <div className="flex items-center mb-4">
                      {spec.icon}
                      <h4 className="text-lg font-bold ml-3">{spec.title}</h4>
                    </div>
                    <p className="text-white/90 text-sm">{spec.description}</p>
                  </div>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {spec.specialists.map((specialist, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-foreground text-sm">{specialist}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Consultants and Specialists */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 text-center">
              Consultores e <span className="text-gradient-primary">Especialistas</span> Multisserviços
            </h3>
            <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Nossa equipa abrange um vasto leque de consultores em diversas áreas, refletindo a natureza multisserviços da Tikvah Psycem.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((category, index) => (
                <Card key={index} className="hover-elegant">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {category.icon}
                      <h4 className="text-lg font-semibold text-foreground ml-3">{category.category}</h4>
                    </div>
                    <ul className="space-y-2">
                      {category.specialists.map((specialist, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground text-sm">{specialist}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Philosophy */}
          <div className="bg-card rounded-3xl p-12 mb-20 border border-border">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Nossa <span className="text-gradient-primary">Filosofia</span> de Equipe
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                A sinergia entre estas diversas especializações garante que a equipa da Tikvah Psycem esteja equipada para atender a uma ampla gama de necessidades com profundidade e precisão.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Desenvolvimento Contínuo</h4>
                <p className="text-sm text-muted-foreground">
                  Investimos continuamente no desenvolvimento e atualização de nossos profissionais
                </p>
              </div>
              
              <div className="text-center">
                <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Intervenções Eficazes</h4>
                <p className="text-sm text-muted-foreground">
                  Conhecimento mais recente e melhores práticas para intervenções transformadoras
                </p>
              </div>
              
              <div className="text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-3">Cuidado Centrado na Pessoa</h4>
                <p className="text-sm text-muted-foreground">
                  Personalização das intervenções com cuidado genuíno centrado na pessoa
                </p>
              </div>
            </div>
          </div>

          {/* Management Excellence */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 mb-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary mr-3" />
                Gestão Estratégica da Equipe
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A gestão estratégica de nossa equipa de especialistas altamente qualificados constitui um pilar fundamental que garante a entrega consistente de serviços de alta performance. A adesão intransigente a padrões éticos rigorosos, a fundamentação contínua em pesquisa e a integração da perspetiva espiritual estruturam a governança clínica e operacional da organização.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-primary mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-3">Padrões Éticos Rigorosos</h4>
                  <p className="text-muted-foreground text-sm">
                    Compromisso inabalável com a ética profissional e a confidencialidade
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-accent mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-3">Capital Humano Estratégico</h4>
                  <p className="text-muted-foreground text-sm">
                    Nosso principal ativo na concretização da missão institucional
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Administrative Direction Team */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-12 text-center">
              Direção <span className="text-gradient-primary">Administrativa</span>
            </h3>
            <p className="text-muted-foreground text-center mb-12 max-w-4xl mx-auto">
              A nossa equipa da Direção Administrativa é liderada por profissionais altamente qualificados, totalmente à disposição para atender às necessidades dos clientes e para construir relações duradouras, pautadas na confiança, no profissionalismo e no compromisso inabalável com o desenvolvimento integral das crianças em Moçambique.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Coronel Thomas Mykhallas */}
              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mr-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Coronel Thomas Mykhallas</h4>
                      <p className="text-primary font-semibold">Diretor Executivo</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Psicólogo Especializado em Comportamento Organizacional, Conflitos laborais, Comportamento social (psicologia social), monitoria e avaliação de projetos, consultoria, Psicologia Forense, IT, Educação, negócios, gestão.
                  </p>
                </CardContent>
              </Card>

              {/* Maria de Lurdes Carlitos */}
              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Maria de Lurdes Carlitos</h4>
                      <p className="text-primary font-semibold">Gestora de Marketing e Publicidade</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Formada em ciências de comunicação e jornalismo, com larga experiência em secretariado executivo, comunicação, publicidade, gestão de redes sociais, produção e análise de informação, comportaria impecável.
                  </p>
                </CardContent>
              </Card>

              {/* Confiança Chicombo */}
              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                      <TreePine className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Confiança Chicombo</h4>
                      <p className="text-primary font-semibold">Conselheiro Estratégico</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Engenheiro agrónomo e consultor em agronegócio, agropecuária, desenvolvimento de projetos, microfinanças, educação e expertise em desenvolvimento comunitário e agrário.
                  </p>
                </CardContent>
              </Card>

              {/* Isabel Chicombo */}
              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                      <Scale className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Isabel Chicombo</h4>
                      <p className="text-primary font-semibold">Jurista e Gestora</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Com larga experiência em jurisprudência, direito empresarial, laboral, constitucional e comercial, gestora em microfinanças e microcrédito, especialista em seguros e negócios.
                  </p>
                </CardContent>
              </Card>

              {/* Eulalia Adolfo - spans full width */}
              <Card className="hover-elegant lg:col-span-2">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">Eulalia Adolfo</h4>
                      <p className="text-primary font-semibold">Gestora Financeira e de Comunicação</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Psicóloga e professora universitária, larga experiência em educação a distância, gestão e direção executiva de escritórios, secretaria executiva de ponta, especialista em educação assistida, empreendedora.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-card rounded-3xl p-12 border border-border">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Conheça Nossa <span className="text-gradient-primary">Equipe</span>
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Cada interação com um cliente é encarada como uma oportunidade estratégica singular para facilitar a transformação e o crescimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg">
                  Falar com Especialista
                </Button>
              </Link>
              <Link to="/approach">
                <Button variant="outline" size="lg">
                  Nossa Abordagem
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;