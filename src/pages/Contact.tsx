
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Building2,
  Users,
  Award,
  Shield,
  HeartHandshake,
  Star,
  CheckCircle
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

// Import ultra-realistic Mozambican context images
import escritorioCentral from "@/assets/escritorio-central-mozambique.jpg";
import psicologoProfissional from "@/assets/psicologo-profissional-mozambique.jpg";
import maputoAv24Julho from "@/assets/maputo-av-24-julho.jpg";

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!privacyAccepted) {
      toast.error("Por favor, aceite a Política de Privacidade para continuar.");
      return;
    }
    
    setIsSubmitting(true);
    
    toast.loading("Enviando mensagem...", { id: "contact-form" });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      toast.success("Mensagem enviada com sucesso! Nossa equipa entrará em contacto consigo brevemente.", { 
        id: "contact-form",
        duration: 5000 
      });
      
      const form = e.target as HTMLFormElement;
      form.reset();
      setPrivacyAccepted(false);
      navigate("/obrigado");
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.", { 
        id: "contact-form" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contacto — Tikvah Psychological Center, Maputo"
        description="Fale com a Tikvah em Maputo: telefone, WhatsApp, email e morada. Atendimento presencial e online com confidencialidade garantida."
        canonicalUrl="https://tikvahpsycem.lovable.app/contact"
      />
      <Navbar />
      
      
      {/* Ultra Professional Hero Section */}
      <section className="contact-hero relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${psicologoProfissional})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-85" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Entre em <span className="text-gradient-accent">Contacto</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Conecte-se connosco para transformar vidas através da excelência em cuidados psicológicos
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" className="animate-fade-in-delayed">
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button variant="outline" size="xl" className="animate-fade-in-delayed bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                <Phone className="w-5 h-5 mr-2" />
                Contacto Directo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information - Ultra Professional */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Location Cards */}
            <div className="space-y-8">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Nossos <span className="text-gradient-primary">Escritórios</span>
                </h2>
                <p className="text-muted-foreground">Localizações estratégicas em Maputo</p>
              </div>

              {/* Central Office */}
              <Card className="contact-card-premium">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={maputoAv24Julho} 
                    alt="Escritório Central - Av. 24 de Julho"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="text-xl font-bold">Escritório Central</h3>
                    <p className="text-white/90">Sede Principal</p>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Av. 24 de Julho, 767</p>
                        <p className="text-sm text-muted-foreground">B/ Polana Cimento, Maputo</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-accent mt-1" />
                      <div className="text-foreground">
                        <p><a href="tel:+258828926020" className="hover:text-primary transition-colors">+258 82 892 6020</a> (Chamadas/SMS)</p>
                        <p><a href="https://wa.me/258827592980" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+258 82 759 2980</a> (WhatsApp)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-accent mt-1" />
                      <div className="text-sm text-foreground">
                        <p>suporte.oficina.psicologo@proton.me</p>
                        <p>geral.consultoriotekvah@gmail.com</p>
                        <p>ceo.consultoriotekvah@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Office */}
              <Card className="contact-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Building2 className="w-6 h-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Escritório Técnico</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">Cidade de Maputo</p>
                    <p className="text-xs text-muted-foreground">Atendimento Especializado</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form - Ultra Professional */}
            <Card className="hover-elegant">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Envie uma <span className="text-gradient-primary">Mensagem</span>
                  </h3>
                  <p className="text-muted-foreground">Responderemos em até 24 horas</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Nome Completo *</label>
                      <Input 
                        type="text" 
                        required 
                        placeholder="Seu nome completo"
                        className="mt-1 h-11"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Telefone *</label>
                      <Input 
                        type="tel" 
                        required 
                        placeholder="+258 XX XXX XXXX"
                        className="mt-1 h-11"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input 
                      type="email" 
                      required 
                      placeholder="seu.email@exemplo.com"
                      className="mt-1 h-11"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Assunto *</label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="Como podemos ajudá-lo?"
                      className="mt-1 h-11"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Mensagem *</label>
                    <Textarea 
                      required 
                      rows={4}
                      placeholder="Descreva sua necessidade..."
                      className="mt-1 resize-none"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Privacy Policy Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-secondary/20 rounded-lg">
                    <input 
                      type="checkbox" 
                      id="privacy-consent" 
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                      disabled={isSubmitting}
                      required
                    />
                    <label htmlFor="privacy-consent" className="text-sm text-muted-foreground leading-relaxed">
                      Aceito a{" "}
                      <Link 
                        to="/politica-de-privacidade" 
                        target="_blank"
                        className="text-primary hover:text-primary/80 underline font-medium"
                      >
                        Política de Privacidade
                      </Link>
                      {" "}e autorizo o processamento dos meus dados pessoais para fins de contacto e prestação de serviços. *
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !privacyAccepted}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* WhatsApp Section */}
          <div className="mt-16 text-center">
            <Card className="hover-elegant bg-gradient-to-br from-green-500 to-green-600 text-white max-w-md mx-auto">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">WhatsApp Business</h4>
                <p className="text-white/90 mb-4">Atendimento rápido e directo</p>
                <Button 
                  asChild
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-green-600"
                >
                  <a 
                    href="https://wa.me/258827592980?text=Olá! Gostaria de informações sobre os serviços do Centro Tikvah." 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
