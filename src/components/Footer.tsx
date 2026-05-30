import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

// Configuração centralizada para fácil manutenção
const COMPANY_INFO = {
  name: "Tikvah",
  tagline: "Psychological Center & Multiservice",
  description: "Centro de excelência em saúde mental e desenvolvimento organizacional, comprometido com o florescimento do capital humano através de práticas baseadas em evidências científicas.",
  foundedYear: 2024,
};

const CONTACT_INFO = {
  phones: [
    { number: "+258 82 892 6020", label: "Chamadas/SMS", href: "tel:+258828926020" },
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
};

const SOCIAL_LINKS = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/tikvah-psycem", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/consultoriotikvah", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/opm_moz", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/258827592980", label: "WhatsApp", primary: true },
];

const NAV_SECTIONS = {
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

const LEGAL_LINKS = [
  { to: "/politica-de-privacidade", label: "Política de Privacidade" },
  { to: "/terms", label: "Termos de Serviço" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Section - Brand & Navigation */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg tracking-tight">{COMPANY_INFO.name}</h2>
                  <p className="text-slate-400 text-xs">{COMPANY_INFO.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                {COMPANY_INFO.description}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      social.primary
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    }`}
                    title={social.label}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {Object.values(NAV_SECTIONS).map((section) => (
                  <div key={section.title}>
                    <h3 className="text-white font-medium text-sm mb-4 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="text-slate-400 hover:text-white text-sm transition-colors duration-200 inline-block"
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

            {/* Contact Column */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-white font-medium text-sm uppercase tracking-wider">
                Contacto
              </h3>

              {/* Phone */}
              <div className="space-y-2">
                {CONTACT_INFO.phones.map((phone) => (
                  <a
                    key={phone.number}
                    href={phone.href}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                  >
                    <Phone className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                    <span className="text-sm">{phone.number}</span>
                  </a>
                ))}
              </div>

              {/* Email */}
              <div className="space-y-2">
                {CONTACT_INFO.emails.map((email) => (
                  <a
                    key={email.address}
                    href={`mailto:${email.address}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                  >
                    <Mail className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                    <span className="text-sm truncate">{email.address}</span>
                  </a>
                ))}
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <address className="text-sm not-italic leading-relaxed">
                  {CONTACT_INFO.address.street}<br />
                  {CONTACT_INFO.address.district}<br />
                  {CONTACT_INFO.address.city}
                </address>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                <Link to="/appointment" className="flex items-center justify-center gap-2">
                  Agendar Consulta
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-slate-500 text-xs text-center sm:text-left">
              © {currentYear} {COMPANY_INFO.name} {COMPANY_INFO.tagline}. Todos os direitos reservados.
            </p>

            {/* Legal Links & Scroll to Top */}
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-4" aria-label="Legal">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                aria-label="Voltar ao topo"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};