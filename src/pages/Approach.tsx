import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Heart, 
  Users, 
  Target, 
  Lightbulb, 
  Shield,
  Compass,
  Sparkles,
  Award,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

// Import high-quality professional images
import consultoriaNegocios from "@/assets/consultoria-negocios.jpg";
import formacaoDesenvolvimento from "@/assets/formacao-desenvolvimento.jpg";
import bemEstarPsicologia from "@/assets/bem-estar-psicologia.jpg";

const Approach = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="approach-hero relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${consultoriaNegocios})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Nossa <span className="text-gradient-accent">Abordagem</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Integração Estratégica para o Desenvolvimento Integral do Capital Humano
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Paradigma Metodológico <span className="text-gradient-primary">Robusto</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Na Tikvah Psycem, nossa proposição de valor distintiva reside na implementação de um paradigma metodológico robusto e genuinamente interdisciplinar. Este paradigma foi concebido para reconhecer e atuar sobre a complexidade intrínseca do capital humano, compreendido integralmente em suas dimensões física, psico-emocional, social e espiritual.
            </p>
          </div>

          {/* Framework Operacional */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Brain className="w-8 h-8 text-primary mr-3" />
                Framework Operacional
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nosso framework operacional constitui uma síntese estratégica de saberes e práticas consolidadas, oriundas da psicologia clínica e organizacional, da filosofia (com particular atenção às contribuições de Platão e Aristóteles para a compreensão da psique e do florescimento humano), da sociologia aplicada e de um sólido corpus de valores ético-cristãos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Esta integração sinérgica estabelece a base de nossa abordagem holística, fundamental para a gestão eficaz da saúde mental e do bem-estar, resultando na optimização da performance tanto em nível individual quanto organizacional.
              </p>
            </div>
            <div className="relative">
              <img 
                src={formacaoDesenvolvimento} 
                alt="Desenvolvimento profissional e formação"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>

          {/* Fundamentação Filosófica */}
          <div className="bg-card rounded-3xl p-12 mb-20 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center">
              <Compass className="w-8 h-8 text-primary mr-3" />
              Fundamentação Filosófica
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover-elegant">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Lightbulb className="w-6 h-6 text-accent mr-2" />
                    Perspetiva Platónica
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    A perspetiva platónica sobre a alma, como epicentro das emoções e virtudes, informa nossa análise aprofundada da estrutura psíquica individual, direcionando a identificação de drivers comportamentais e o reconhecimento de alavancas de desenvolvimento intrínsecas.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-elegant">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Target className="w-6 h-6 text-accent mr-2" />
                    Ética Aristotélica
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    A ética aristotélica, centrada na busca pela eudaimonia (o florescimento pleno) e na relevância das virtudes práticas, configura um pilar essencial para o desenvolvimento de resiliência e para a promoção de uma existência com maior propósito e significado.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Princípios Axiológicos */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div className="relative">
              <img 
                src={bemEstarPsicologia} 
                alt="Bem-estar psicológico e valores cristãos"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Heart className="w-8 h-8 text-primary mr-3" />
                Princípios Axiológicos Cristãos
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A incorporação deliberada de princípios axiológicos cristãos, tais como compaixão, empatia e um respeito incondicional pela dignidade individual, não se configura como um elemento meramente retórico, mas como um componente integrador fundamental de nossas estratégias de engajamento e gestão de relacionamento com o cliente.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Estes valores são intrínsecos à nossa arquitetura de serviço, sendo aplicados de forma transversal em todos os pontos de contacto: no atendimento individualizado, nas dinâmicas de grupo e nas iniciativas de extensão comunitária.
              </p>
            </div>
          </div>

          {/* Análise Conjuntural */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                Análise Conjuntural
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                A análise conjuntural, alicerçada em teorias socio-filosóficas, constitui uma ferramenta indispensável que nos permite contextualizar as dinâmicas individuais dentro de seu ecossistema social e cultural.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover-elegant">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-3">Soluções Escaláveis</h4>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvimento de soluções que consideram o ambiente organizacional e cultural
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elegant">
                <CardContent className="p-6">
                  <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-3">Leitura Sistémica</h4>
                  <p className="text-sm text-muted-foreground">
                    Análise aprofundada que otimiza a precisão diagnóstica
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover-elegant">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-3">Assertividade Estratégica</h4>
                  <p className="text-sm text-muted-foreground">
                    Intervenções precisas baseadas em análise contextual
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Consultoria Organizacional */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Consultoria <span className="text-gradient-primary">Organizacional</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Aplicamos um modelo de diagnóstico e intervenção caracterizado por sua elevada dinamicidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-primary mb-6" />
                  <h4 className="text-xl font-semibold text-foreground mb-4">Auditoria Profunda</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Cultura corporativa
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Valores da liderança
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Práticas de gestão existentes
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover-elegant">
                <CardContent className="p-8">
                  <Compass className="w-12 h-12 text-accent mb-6" />
                  <h4 className="text-xl font-semibold text-foreground mb-4">Estratégias Customizadas</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Optimização do clima organizacional
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Incremento da produtividade
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Ambiente psicologicamente seguro
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-card rounded-3xl p-12 border border-border">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Transformação através da <span className="text-gradient-primary">Excelência</span>
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A integração equilibrada entre o rigor científico e a perspetiva espiritual define o cerne de nossa filosofia de trabalho.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="gradient" size="lg">
                  Falar com Especialista
                </Button>
              </Link>
              <Link to="/team">
                <Button variant="outline" size="lg">
                  Conheça Nossa Equipe
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

export default Approach;