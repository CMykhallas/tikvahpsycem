import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SecurityProvider } from "@/components/SecurityProvider";

import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Team = lazy(() => import("./pages/Team"));
const Values = lazy(() => import("./pages/Values"));
const Mission = lazy(() => import("./pages/Mission"));
const Approach = lazy(() => import("./pages/Approach"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Career = lazy(() => import("./pages/Career"));
const Appointment = lazy(() => import("./pages/Appointment"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Location = lazy(() => import("./pages/Location"));
const Administration = lazy(() => import("./pages/Administration"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProximosPassos = lazy(() => import("./pages/ProximosPassos"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const SecurityIncidentsAdmin = lazy(() => import("./pages/admin/SecurityIncidents"));
const SecurityAnalytics = lazy(() => import("./pages/admin/SecurityAnalytics"));
const Auth = lazy(() => import("./pages/Auth"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

const Psicoterapia = lazy(() => import("./pages/services/Psicoterapia"));
const Consultoria = lazy(() => import("./pages/services/Consultoria"));
const Cursos = lazy(() => import("./pages/services/Cursos"));
const Workshops = lazy(() => import("./pages/services/Workshops"));
const EcosystemItemPage = lazy(() => import("./pages/EcosystemDetail").then((module) => ({ default: module.EcosystemItemPage })));
const EcosystemCategoryPage = lazy(() => import("./pages/EcosystemDetail").then((module) => ({ default: module.EcosystemCategoryPage })));

const MBSRMetaAnalise = lazy(() => import("./pages/blog/MBSRMetaAnalise"));
const TraumaCulturalResiliencia = lazy(() => import("./pages/blog/TraumaCulturalResiliencia"));
const ACTTerapiaContextos = lazy(() => import("./pages/blog/ACTTerapiaContextos"));
const PsicologiaOrganizacional = lazy(() => import("./pages/blog/PsicologiaOrganizacional"));
const RedesSociaisOportunidadesConflitos = lazy(() => import("./pages/blog/RedesSociaisOportunidadesConflitos"));

const Loja = lazy(() => import("./pages/Loja"));
const Carrinho = lazy(() => import("./pages/Carrinho"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Success = lazy(() => import("./pages/Success"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div role="status" aria-live="polite" className="min-h-screen flex items-center justify-center">A carregar página…</div>}>
              <Routes>
                {/* Rotas Públicas Principais */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/team" element={<Team />} />
                <Route path="/values" element={<Values />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/approach" element={<Approach />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/career" element={<Career />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/location" element={<Location />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
                <Route path="/obrigado" element={<Obrigado />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/propostas/proximos-passos" element={<ProximosPassos />} />

                {/* Rotas de Serviços Especializados */}
                <Route path="/services/psicoterapia" element={<Psicoterapia />} />
                <Route path="/services/consultoria" element={<Consultoria />} />
                <Route path="/services/cursos" element={<Cursos />} />
                <Route path="/services/workshops" element={<Workshops />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />

                {/* Rotas de Ecossistema */}
                <Route path="/ecosistema/:categoryId" element={<EcosystemCategoryPage />} />
                <Route path="/ecosistema/:categoryId/:itemSlug" element={<EcosystemItemPage />} />

                {/* Rotas de E-commerce / Loja */}
                <Route path="/loja" element={<Loja />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/produto/:slug" element={<ProductDetail />} />
                <Route path="/success" element={<Success />} />

                {/* Rotas de Artigos Científicos / Blog */}
                <Route path="/blog/mbsr-meta-analise-eficacia" element={<MBSRMetaAnalise />} />
                <Route path="/blog/trauma-cultural-resiliencia-pos-colonial" element={<TraumaCulturalResiliencia />} />
                <Route path="/blog/act-terapia-contextos-africanos" element={<ACTTerapiaContextos />} />
                <Route path="/blog/psicologia-organizacional-transformacao-digital" element={<PsicologiaOrganizacional />} />
                <Route path="/blog/redes-sociais-oportunidades-ou-conflitos" element={<RedesSociaisOportunidadesConflitos />} />

                {/* Rotas Administrativas e de Segurança Protegidas */}
                <Route
                  path="/administration"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Administration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/security"
                  element={
                    <ProtectedRoute requireAdmin>
                      <SecurityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security-incidents"
                  element={
                    <ProtectedRoute requireAdmin>
                      <SecurityIncidentsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/security-analytics"
                  element={
                    <ProtectedRoute requireAdmin>
                      <SecurityAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Tratamento de Rota Não Encontrada (404) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;