import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Heart, Users, BookOpen, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import bemEstarImage from "@/assets/bem-estar-psicologia.jpg";
import consultoriaImage from "@/assets/consultoria-negocios.jpg";
import formacaoImage from "@/assets/formacao-desenvolvimento.jpg";

const Obrigado = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setPaymentConfirmed(true);
    }
  }, [sessionId]);
  
  useEffect(() => {
    // Add noindex meta tag to prevent search engine indexing
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // Set page title
    document.title = "Obrigado - Tikvah | A Sua Jornada de Transformação Começa Aqui";

    // Cleanup on unmount
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  const services = [
    {
      title: "Bem-Estar e Psicologia",
      description: "Apoio psicológico especializado para o seu crescimento pessoal e bem-estar emocional.",
      image: bemEstarImage,
      icon: Heart,
      link: "/services/psicoterapia"
    },
    {
      title: "Consultoria e Negócios",
      description: "Estratégias empresariais inovadoras para elevar o sucesso da sua organização.",
      image: consultoriaImage,
      icon: Users,
      link: "/services/consultoria"
    },
    {
      title: "Formação e Desenvolvimento",
      description: "Programas de capacitação profissional para acelerar o seu desenvolvimento.",
      image: formacaoImage,
      icon: BookOpen,
      link: "/services/cursos"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {paymentConfirmed ? 'Pagamento Confirmado!' : 'Obrigado por nos Contactar.'}
            <span className="block text-primary mt-2">
              A Sua Jornada de Transformação Começa Aqui.
            </span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            {paymentConfirmed ? (
              <>
                O seu agendamento foi confirmado com sucesso e o pagamento foi processado via Stripe. 
                Receberá um email de confirmação com todos os detalhes da sua consulta.
              </>
            ) : (
              <>
                A sua mensagem foi recebida com sucesso. A nossa equipa está agora a analisar o seu pedido 
                com a máxima prioridade. Em breve, entraremos em contacto consigo para iniciar a sua 
                experiência com a Tikvah.
              </>
            )}
          </h2>
          
          <div className="bg-card border border-border rounded-lg p-6 max-w-3xl mx-auto shadow-sm">
            {paymentConfirmed && (
              <div className="flex items-center justify-center space-x-4 mb-4 pb-4 border-b border-border">
                <CreditCard className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-card-foreground">Pagamento Processado</h3>
                  <p className="text-sm text-muted-foreground">Transação segura via Stripe</p>
                </div>
              </div>
            )}
            <p className="text-lg text-card-foreground leading-relaxed">
              Valorizamos o seu tempo e a sua confiança em nós. Enquanto aguarda, convidamo-lo a 
              explorar como podemos continuar a apoiar o seu bem-estar, crescimento e sucesso, 
              seja a nível pessoal ou profissional.
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Descubra o Nosso Ecossistema Completo de Apoio e Crescimento
          </h3>
          
          <Link to="/services">
            <Button size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-all duration-300 shadow-lg">
              EXPLORE OS NOSSOS SERVIÇOS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 bg-primary/90 p-2 rounded-full">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link 
                    to={service.link}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Saiba Mais
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 rounded-lg p-8 max-w-4xl mx-auto">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              O Que Esperar a Seguir?
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  1
                </div>
                <p className="text-muted-foreground">
                  Análise detalhada do seu pedido pela nossa equipa especializada
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  2
                </div>
                <p className="text-muted-foreground">
                  Contacto directo para agendar a primeira consulta ou reunião
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold mb-2">
                  3
                </div>
                <p className="text-muted-foreground">
                  Início da sua jornada personalizada de transformação e crescimento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
          >
            Voltar à Página Principal
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Obrigado;