import React from "react";
import { Link } from "react-router-dom";
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
  Clock,
  Camera as InstagramIcon, 
  Share2 as FacebookIcon, 
  X as XIcon, 
  Briefcase as LinkedinIcon, 
  Video as TiktokIcon, 
  ExternalLink,
  CheckCircle2,
  type LucideIcon 
} from "lucide-react";

// Importação das imagens institucionais
import escritorioCentral from "@/assets/escritorio-central-mozambique.jpg";
import ceoportraitsenior from "@/assets/ceo-portrait-senior.jpg";

interface ContactEmail {
  readonly email: string;
  readonly category: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

interface ContactPhone {
  readonly label: string;
  readonly number: string;
  readonly description: string;
  readonly href: string;
  readonly isWhatsApp: boolean;
}

interface ContactAddress {
  readonly name: string;
  readonly type: string;
  readonly address: string;
  readonly location: string;
  readonly city: string;
  readonly description: string;
}

interface SocialPlatform {
  readonly platform: string;
  readonly url: string;
  readonly handle: string;
}

interface WorkingHours {
  readonly days: string;
  readonly hours: string;
  readonly note: string;
}

const SOCIAL_ICON_MAP: Record<string, { icon: LucideIcon; colorClass: string }> = {
  Facebook: { icon: FacebookIcon, colorClass: "text-blue-600" },
  Instagram: { icon: InstagramIcon, colorClass: "text-pink-600" },
  X: { icon: XIcon, colorClass: "text-slate-900 dark:text-slate-100" },
  TikTok: { icon: TiktokIcon, colorClass: "text-slate-900 dark:text-slate-100" },
  LinkedIn: { icon: LinkedinIcon, colorClass: "text-blue-700" },
};

const workingHoursData: readonly WorkingHours[] = [
  { days: "Segunda-feira a Sexta-feira", hours: "08:00 - 18:00", note: "Atendimento presencial e consultas online" },
  { days: "Sábados", hours: "08:00 - 13:00", note: "Atendimento prioritário sob agendamento prévio" },
  { days: "Domingos e Feriados", hours: "Encerrado", note: "Suporte de emergência e canal contínuo via WhatsApp" },
];

const phonesData: readonly ContactPhone[] = [
  {
    label: "Linha Principal de Chamadas",
    number: "+258 82 892 6020",
    description: "Atendimento telefónico geral, suporte ao cliente e informações institucionais",
    href: "tel:+258828926020",
    isWhatsApp: false,
  },
  {
    label: "WhatsApp Business & Atendimento Direto",
    number: "+258 82 759 2980",
    description: "Linha direta para agendamento rápido de consultas, mensagens instantâneas e apoio ao cliente",
    href: "https://wa.me/258827592980",
    isWhatsApp: true,
  },
];

const emailsData: readonly ContactEmail[] = [
  {
    email: "suporte.oficina.psicologo@proton.me",
    category: "Suporte Técnico & Plataforma",
    description: "Gestão de questões técnicas, suporte ao utilizador e assistência de sistemas.",
    icon: <Mail className="w-5 h-5 text-primary" aria-hidden="true" />,
  },
  {
    email: "geral.consultoriotekvah@gmail.com",
    category: "Secretaria & Atendimento Geral",
    description: "Correspondência administrativa, agendamento de consultas e informações gerais.",
    icon: <Building2 className="w-5 h-5 text-accent" aria-hidden="true" />,
  },
  {
    email: "ceo.consultoriotekvah@gmail.com",
    category: "Gabinete do CEO & Direção Executiva",
    description: "Comunicação institucional de alto nível, propostas executivas e parcerias estratégicas.",
    icon: <Users className="w-5 h-5 text-primary" aria-hidden="true" />,
  },
];

const addressesData: readonly ContactAddress[] = [
  {
    name: "Escritório Central",
    type: "Sede Principal e Administrativa",
    address: "Avenida 24 de Julho N. 797, 1º Andar",
    location: "Bairro Polana Cimento 'A'",
    city: "Cidade de Maputo, Maputo - Moçambique",
    description: "Instalações centrais para gestão institucional, reuniões e atendimento presencial.",
  },
  {
    name: "Escritório Técnico",
    type: "Unidade de Atendimento Especializado",
    address: "Avenida Vladimir Lenine N. 4650",
    location: "Bairro Maxaquene 'C'",
    city: "Cidade de Maputo, Maputo - Moçambique",
    description: "Centro técnico direcionado para acompanhamento psicológico e intervenção especializada.",
  },
];

const socialData: readonly SocialPlatform[] = [
  { platform: "Facebook", url: "https://www.facebook.com/consultoriotikvah", handle: "@consultoriotikvah" },
  { platform: "Instagram", url: "https://instagram.com/tikvahpsycem", handle: "@tikvahpsycem" },
  { platform: "X", url: "https://x.com/tikvahpsycem", handle: "@tikvahpsycem" },
  { platform: "TikTok", url: "https://tiktok.com/@tikvahpsycem", handle: "@tikvahpsycem" },
  { platform: "WhatsApp", url: "https://wa.me/258827592980", handle: "+258 82 759 2980" },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/company/tikvah-psycem",
    handle: "Tikvah Psychological Center & Multiservice",
  },
];

const Administration: React.FC = () => {
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de obter informações sobre os serviços do Centro Tikvah Psycem e agendar um atendimento."
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="admin-hero relative" aria-label="Apresentação da Direção">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${ceoportraitsenior})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" aria-hidden="true" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Direção <span className="text-gradient-accent">Administrativa</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Canais Institucionais Oficiais de Comunicação, Atendimento e Engajamento Corporativo
              </p>
            </div>
          </div>
        </section>

        {/* Secção Principal de Contactos */}
        <section className="py-16 md:py-24 bg-background" aria-label="Canais Oficiais e Informações de Contacto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Introdução */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                <span className="text-gradient-primary">Canais Oficiais</span> de Comunicação
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Para assegurar a eficiência operacional e a conformidade procedimental nas interações, a Tikvah Psycem disponibiliza canais oficiais sincronizados para atendimento, suporte e assuntos corporativos.
              </p>
            </div>

            {/* Secção 1: Horários de Atendimento */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <Clock className="w-7 h-7 text-primary mr-3" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-foreground">Horário de Funcionamento & Atendimento</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {workingHoursData.map((item) => (
                  <Card key={item.days} className="hover-elegant border-border">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                        <Clock className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <h4 className="font-bold text-foreground text-lg mb-2">{item.days}</h4>
                      <p className="text-xl font-extrabold text-primary mb-2">{item.hours}</p>
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secção 2: Contacto Telefónico e WhatsApp */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <Phone className="w-7 h-7 text-primary mr-3" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-foreground">Atendimento Telefónico & WhatsApp</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {phonesData.map((phone) => (
                  <Card key={phone.number} className="hover-elegant text-center border-border">
                    <CardContent className="p-6">
                      {phone.isWhatsApp ? (
                        <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-4" aria-hidden="true" />
                      ) : (
                        <Phone className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden="true" />
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                        {phone.label}
                      </span>
                      <h4 className="text-2xl font-bold text-foreground mb-3">
                        <a
                          href={phone.href}
                          target={phone.isWhatsApp ? "_blank" : undefined}
                          rel={phone.isWhatsApp ? "noopener noreferrer" : undefined}
                          className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {phone.number}
                        </a>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">{phone.description}</p>
                      <Button asChild variant={phone.isWhatsApp ? "default" : "outline"} size="sm" className={phone.isWhatsApp ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                        <a
                          href={phone.isWhatsApp ? `https://wa.me/258827592980?text=${whatsappMessage}` : phone.href}
                          target={phone.isWhatsApp ? "_blank" : undefined}
                          rel={phone.isWhatsApp ? "noopener noreferrer" : undefined}
                        >
                          {phone.isWhatsApp ? (
                            <>
                              <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                              Iniciar Conversa via WhatsApp
                            </>
                          ) : (
                            <>
                              <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                              Efetuar Chamada
                            </>
                          )}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secção 3: Emails Corporativos */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <Mail className="w-7 h-7 text-primary mr-3" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-foreground">Correio Eletrónico Corporativo</h3>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {emailsData.map((contact) => (
                  <Card key={contact.email} className="hover-elegant border-border">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">{contact.icon}</div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                        {contact.category}
                      </span>
                      <h4 className="text-base font-bold text-foreground mb-3 break-all">{contact.email}</h4>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{contact.description}</p>
                      <Button asChild variant="outline" size="sm" className="w-full focus-visible:ring-2 focus-visible:ring-primary">
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                          Enviar Mensagem
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secção 4: Endereços Físicos */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <MapPin className="w-7 h-7 text-primary mr-3" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-foreground">Endereços Físicos & Unidades</h3>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {addressesData.map((address, index) => (
                  <Card key={address.name} className="hover-elegant overflow-hidden border-border">
                    {index === 0 && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={escritorioCentral}
                          alt={`Instalações do ${address.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden="true" />
                        <div className="absolute bottom-4 left-6 text-white">
                          <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-black/40 px-2 py-0.5 rounded mb-1 inline-block">
                            {address.type}
                          </span>
                          <h4 className="text-xl font-bold">{address.name}</h4>
                        </div>
                      </div>
                    )}

                    <CardContent className="p-6">
                      {index !== 0 && (
                        <div className="mb-4">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                            {address.type}
                          </span>
                          <h4 className="text-xl font-bold text-foreground">{address.name}</h4>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                          <div>
                            <p className="font-semibold text-foreground">{address.address}</p>
                            <p className="text-sm text-muted-foreground">{address.location}</p>
                            <p className="text-sm text-muted-foreground">{address.city}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">{address.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Secção 5: Redes Sociais */}
            <div className="mb-16">
              <div className="flex items-center justify-center mb-8">
                <Globe className="w-7 h-7 text-primary mr-3" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-foreground">Plataformas Digitais Oficiais</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {socialData.map((social) => {
                  const mapped = SOCIAL_ICON_MAP[social.platform];
                  const Icon = mapped ? mapped.icon : Globe;
                  const colorClass = mapped ? mapped.colorClass : "text-primary";

                  return (
                    <Card key={social.platform} className="hover-elegant text-center border-border">
                      <CardContent className="p-6">
                        <Icon className={`w-8 h-8 mx-auto mb-3 ${colorClass}`} aria-hidden="true" />
                        <h4 className="text-base font-bold text-foreground mb-1">{social.platform}</h4>
                        <p className="text-xs text-muted-foreground mb-4 truncate">{social.handle}</p>
                        <Button asChild variant="outline" size="sm" className="w-full focus-visible:ring-2 focus-visible:ring-primary">
                          <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`Visitar página oficial no ${social.platform}`}>
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                            Visitar
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Banner de Compromisso e Ações */}
            <div className="mt-16 text-center bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Compromisso com a <span className="text-gradient-primary">Excelência Comunicacional</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 text-sm md:text-base">
                Reiteramos o nosso compromisso com a celeridade e transparência na resposta a solicitações institucionais, consultas clínicas e parcerias corporativas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    Formulário de Contacto
                  </Button>
                </Link>
                <Link to="/appointment">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Agendar Consulta Online
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Administration;