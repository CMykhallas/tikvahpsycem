
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ChatbotTriagem } from "@/components/ChatbotTriagem";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SEOHead } from "@/components/SEOHead";
import { AccessibilityEnhancer } from "@/components/AccessibilityEnhancer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const Index = () => {
  // Structured data para melhor indexação por IA
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Tikvah Psychological Center & Multiservice",
    "description": "Centro psicológico especializado em desenvolvimento humano integral em Maputo, Moçambique",
    "url": "https://tikvahpsycem-mz.lovable.app",
    "logo": "/tikvah-logo.jpg",
    "image": "https://tikvahpsycem-mz.lovable.app/og-image.jpg",
    "telephone": "+258828926020",
    "email": "suporte.oficina.psicologo@proton.me",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cidade de Maputo",
      "addressLocality": "Maputo",
      "addressRegion": "Maputo",
      "postalCode": "1000",
      "addressCountry": "MZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-25.9655",
      "longitude": "32.5832"
    },
    "openingHours": "Mo-Fr 08:00-17:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "Place",
      "name": "Maputo, Moçambique"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços Psicológicos",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Psicoterapia Individual",
            "description": "Atendimento psicológico personalizado"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoria Organizacional",
            "description": "Desenvolvimento organizacional e liderança"
          }
        }
      ]
    },
    "sameAs": [
      "https://facebook.com/TikvahCenter",
      "https://instagram.com/tikvah_center"
    ]
  };

  return (
    <>
      <SEOHead 
        title="Tikvah Center - Psicologia & Desenvolvimento Humano"
        description="Centro psicológico e multiservice em Maputo. Psicoterapia, consultoria e desenvolvimento humano integral com valores cristãos."
        keywords="psicologia Maputo, terapia Moçambique, consultoria psicológica, desenvolvimento humano, saúde mental"
        canonicalUrl="https://tikvahpsycem-mz.lovable.app"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Skip to main content - Acessibilidade */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
          aria-label="Pular para conteúdo principal"
        >
          Pular para conteúdo principal
        </a>

        <ScrollProgress />
        
        <header role="banner">
          <Navbar />
        </header>

        <BreadcrumbNavigation />

        <main id="main-content" role="main">
          {/* H1 Principal da página */}
          <section aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="sr-only">
              Tikvah Psychological Center - Centro de Psicologia e Desenvolvimento Humano em Maputo
            </h1>
            <Hero />
          </section>

          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="sr-only">Sobre Nós</h2>
            <About />
          </section>

          <section aria-labelledby="services-heading">
            <h2 id="services-heading" className="sr-only">Nossos Serviços</h2>
            <Services />
          </section>

          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="sr-only">Entre em Contato</h2>
            <Contact />
          </section>
        </main>

        <footer role="contentinfo">
          <Footer />
        </footer>

        {/* Componentes auxiliares */}
        <BackToTop />
        <WhatsAppFloat />
        <ChatbotTriagem />
        <AccessibilityEnhancer />
        <PerformanceMonitor />
      </div>
    </>
  );
};

export default Index;
