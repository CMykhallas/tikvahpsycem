import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Building2,
  MessageCircle,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

// Import professional images
import escritorioCentral from "@/assets/escritorio-central-mozambique.jpg";
import ceoportraitsenior from "@/assets/ceo-portrait-senior.jpg";

const Administration = () => {
  const contacts = {
    emails: [
      {
        email: "suporte.oficina.psicologo@proton.me",
        description: "Gestão de questões gerais e suporte técnico ao cliente",
        icon: <Mail className="w-5 h-5 text-primary" />
      },
      {
        email: "geral.consultoriotekvah@gmail.com",
        description: "Correspondência administrativa e agendamento de compromissos",
        icon: <Building2 className="w-5 h-5 text-accent" />
      },
      {
        email: "ceo.consultoriotekvah@gmail.com",
        description: "Comunicação institucional de alto nível e propostas de parcerias estratégicas",
        icon: <Users className="w-5 h-5 text-primary" />
      }
    ],
    phones: [
      { number: "+258 82 892 6020", description: "Linha de atendimento (Chamadas/SMS)", href: "tel:+258828926020" },
      { number: "+258 82 759 2980", description: "WhatsApp Business", href: "https://wa.me/258827592980" }
    ],
    addresses: [
      {
        name: "Escritório Central",
        address: "Avenida 24 de Julho N. 767",
        location: "Bairro Polana Cimento 'B'",
        city: "Cidade de Maputo, Maputo - Moçambique",
        description: "Sede Principal"
      },
      {
        name: "Escritório Técnico",
        address: "Avenida Vlademir Lenine N. 4650",
        location: "Bairro Maxaquene 'C'",
        city: "Cidade de Maputo, Maputo - Moçambique",
        description: "Atendimento Especializado"
      }
    ],
    social: [
      { platform: "Facebook", url: "https://www.facebook.com/consultoriotikvah", handle: "consultoriotikvah" },
      { platform: "Instagram", url: "https://instagram.com/opm_moz", handle: "@opm_moz" },
      { platform: "Twitter", url: "https://twitter.com/opm_moz", handle: "@opm_moz" },
      { platform: "TikTok", url: "https://tiktok.com/@opm_moz", handle: "@opm_moz" },
      { platform: "LinkedIn", url: "https://www.linkedin.com/company/tikvah-psycem/?viewAsMember=true", handle: "Tikvah Psychological Center & Multiservice" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="admin-hero relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ceoportraitsenior})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Direção <span className="text-gradient-accent">Administrativa</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Canais Institucionais para Engajamento e Comunicação Formal
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              <span className="text-gradient-primary">Canais Oficiais</span> de Comunicação
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Para otimizar a eficiência operacional e assegurar a conformidade procedimental nas interações, a Tikvah Psycem disponibiliza os seguintes canais oficiais para engajamento institucional.
            </p>
          </div>

          {/* Email Contacts */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary mr-3" />
              Correio Eletrónico Corporativo
            </h3>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {contacts.emails.map((contact, index) => (
                <Card key={index} className="hover-elegant">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {contact.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      {contact.email}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {contact.description}
                    </p>
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                    >
                      <a href={`mailto:${contact.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Phone Contacts */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary mr-3" />
              Contacto Telefónico Corporativo
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {contacts.phones.map((phone, index) => (
                <Card key={index} className="hover-elegant text-center">
                  <CardContent className="p-6">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      <a 
                        href={phone.href} 
                        target={phone.href.startsWith('https') ? '_blank' : undefined}
                        rel={phone.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                        className="hover:text-primary transition-colors"
                      >
                        {phone.number}
                      </a>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {phone.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Physical Addresses */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary mr-3" />
              Endereços Físicos
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {contacts.addresses.map((address, index) => (
                <Card key={index} className="hover-elegant">
                  {index === 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={escritorioCentral} 
                        alt={address.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                      <div className="absolute bottom-4 left-6 text-white">
                        <h4 className="text-xl font-bold">{address.name}</h4>
                        <p className="text-white/90">{address.description}</p>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    {index !== 0 && (
                      <div className="flex items-center mb-4">
                        <Building2 className="w-6 h-6 text-primary mr-3" />
                        <h4 className="text-lg font-semibold text-foreground">{address.name}</h4>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{address.address}</p>
                          <p className="text-sm text-muted-foreground">{address.location}</p>
                          <p className="text-sm text-muted-foreground">{address.city}</p>
                        </div>
                      </div>
                      {index !== 0 && (
                        <p className="text-xs text-muted-foreground mt-2">{address.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center justify-center">
              <Globe className="w-8 h-8 text-primary mr-3" />
              Plataformas Digitais Oficiais
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {contacts.social.map((social, index) => (
                <Card key={index} className="hover-elegant text-center">
                  <CardContent className="p-6">
                    {social.platform === 'Facebook' && <Facebook className="w-8 h-8 text-blue-600 mx-auto mb-3" />}
                    {social.platform === 'Instagram' && <Instagram className="w-8 h-8 text-pink-600 mx-auto mb-3" />}
                    {social.platform === 'Twitter' && <Twitter className="w-8 h-8 text-blue-400 mx-auto mb-3" />}
                    {social.platform === 'TikTok' && <MessageCircle className="w-8 h-8 text-black mx-auto mb-3" />}
                    {social.platform === 'LinkedIn' && <Linkedin className="w-8 h-8 text-blue-700 mx-auto mb-3" />}
                    
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {social.platform}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {social.handle}
                    </p>
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visitar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="text-center">
            <Card className="hover-elegant bg-gradient-to-br from-green-500 to-green-600 text-white max-w-md mx-auto">
              <CardContent className="p-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-6" />
                <h4 className="text-2xl font-bold mb-4">WhatsApp Business</h4>
                <p className="text-white/90 mb-6">Atendimento direto e imediato</p>
                <p className="text-lg font-semibold mb-4"><a href="https://wa.me/258827592980" target="_blank" rel="noopener noreferrer" className="hover:underline">+258 82 759 2980</a></p>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-green-600"
                >
                  <a 
                    href="https://wa.me/258827592980?text=Olá! Gostaria de informações sobre os serviços do Centro Tikvah." 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Conversar via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Commitment Statement */}
          <div className="mt-20 text-center bg-card rounded-3xl p-12 border border-border">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Compromisso com a <span className="text-gradient-primary">Excelência</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Reiteramos o nosso compromisso inabalável com a excelência comunicacional e a capacidade de resposta célere às demandas, solidificando a nossa parceria estratégica para a consecução de objetivos de desenvolvimento e sucesso mútuos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/contact">
                <Button variant="gradient" size="lg">
                  Contactar-nos Agora
                </Button>
              </Link>
              <Link to="/appointment">
                <Button variant="outline" size="lg">
                  Agendar Consulta
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

export default Administration;