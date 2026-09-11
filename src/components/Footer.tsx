import React from "react";
import { Link } from "react-router-dom";
import {
  Share2 as FacebookIcon,
  Camera as InstagramIcon,
  Briefcase as LinkedinIcon,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ChevronUp,
  ExternalLink,
  X as TwitterIcon,
  Video as TiktokIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
  primary?: boolean;
}

interface NavItem {
  to: string;
  label: string;
}

interface NavSection {
  title: string;
  links: NavItem[];
}

const COMPANY_INFO = {
  name: "Tikvah Psycem",
  tagline: "Tikvah Psychological Center & Multiservice",
  description:
    "Centro de excelência em saúde mental e desenvolvimento organizacional, comprometido com o florescimento do capital humano através de práticas baseadas em evidências científicas.",
  foundedYear: 2024,
} as const;

const CONTACT_INFO = {
  phones: [
    { number: "+258 82 778 5043", label: "Chamadas/SMS", href: "tel:+258827785043" },
    { number: "+258 82 759 2980", label: "WhatsApp", href: "https://wa.me/258827592980" },
  ],
  emails: [
    { address: "suporte.oficina.psicologo@proton.me", label: "Suporte" },
    { address: "geral.consultoriotekvah@gmail.com", label: "Geral" },
  ],
  address: {
    street: "Av. 24 de Julho N. 797, 1º Andar",
    district: "Polana Cimento A",
    city: "Maputo, Moçambique",
  },
} as const;

const SOCIAL_LINKS: readonly SocialLink[] = [
  { icon: LinkedinIcon, href: "https://www.linkedin.com/company/tikvah-psycem", label: "LinkedIn" },
  { icon: FacebookIcon, href: "https://www.facebook.com/consultoriotikvah", label: "Facebook" },
  { icon: InstagramIcon, href: "https://instagram.com/@tikvahpsycem", label: "Instagram" },
  { icon: TwitterIcon, href: "https://twitter.com/@tikvahpsycem", label: "X (Twitter)" },
  { icon: TiktokIcon, href: "https://tiktok.com/@tikvahpsycem", label: "TikTok" },
  { icon: MessageCircle, href: "https://wa.me/258827592980", label: "WhatsApp", primary: true },
];

const NAV_SECTIONS: Record<string, NavSection> = {
  institutional: {
    title: "Institucional",
    links: [
      { to: "/about", label: "Sobre Nós" },
      { to: "/team", label: "Equipa" },
      { to: "/mission", label: "Missão & Visão" },
      { to: "/values", label: "Valores" },
      { to: "/career", label: "Carreiras" },
    ],
  },
  services: {
    title: "Serviços",
    links: [
      { to: "/services/psicoterapia", label: "Psicoterapia" },
      { to: "/services/consultoria", label: "Consultoria Empresarial" },
      { to: "/services/cursos", label: "Formação Profissional" },
      { to: "/services/workshops", label: "Workshops" },
    ],
  },
  resources: {
    title: "Recursos",
    links: [
      { to: "/blog", label: "Blog & Artigos" },
      { to: "/testimonials", label: "Testemunhos" },
      { to: "/faq", label: "FAQ" },
      { to: "/location", label: "Localização" },
    ],
  },
};

const LEGAL_LINKS: readonly NavItem[] = [
  { to: "/politica-de-privacidade", label: "Política de Privacidade" },
  { to: "/terms", label: "Termos de Serviço" },
];

export const Footer: React.FC = () => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();
  const copyrightYears =
    COMPANY_INFO.foundedYear === currentYear
      ? `${currentYear}`
      : `${COMPANY_INFO.foundedYear} - ${currentYear}`;

  return (
    <footer className="bg-slate-900 text-slate-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Coluna da Marca */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg" aria-hidden="true">
                    T
                  </span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg tracking-tight">{COMPANY_INFO.name}</h2>
                  <p className="text-slate-300 text-xs font-medium">{COMPANY_INFO.tagline}</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm font-normal leading-relaxed max-w-sm">
                {COMPANY_INFO.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap" aria-label="Redes Sociais">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        social.primary
                          ? "bg-green-700 hover:bg-green-800 text-white"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      }`}
                      title={social.label}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navegação */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {Object.values(NAV_SECTIONS).map((section) => (
                  <div key={section.title}>
                    <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contactos */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Contacto</h3>

              <div className="space-y-2">
                {CONTACT_INFO.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={phone.href}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium">{phone.number}</span>
                  </a>
                ))}
              </div>

              <div className="space-y-2">
                {CONTACT_INFO.emails.map((email) => (
                  <a
                    key={email.address}
                    href={`mailto:${email.address}`}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium truncate">{email.address}</span>
                  </a>
                ))}
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <address className="text-sm font-medium not-italic leading-relaxed">
                  {CONTACT_INFO.address.street}
                  <br />
                  {CONTACT_INFO.address.district}
                  <br />
                  {CONTACT_INFO.address.city}
                </address>
              </div>

              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-bold" size="sm">
                <Link to="/appointment" className="flex items-center justify-center gap-2">
                  Agendar Consulta
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-300 text-xs font-medium text-center sm:text-left">
              © {copyrightYears} {COMPANY_INFO.name} — {COMPANY_INFO.tagline}. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-4" aria-label="Links Legais">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-slate-300 hover:text-white text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Voltar ao topo da página"
              >
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
