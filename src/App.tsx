import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SecurityProvider } from "@/components/SecurityProvider";

import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Team from "./pages/Team";
import Values from "./pages/Values";
import Mission from "./pages/Mission";
import Approach from "./pages/Approach";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import Career from "./pages/Career";
import Appointment from "./pages/Appointment";
import Feedback from "./pages/Feedback";
import Location from "./pages/Location";
import Administration from "./pages/Administration";
import Obrigado from "./pages/Obrigado";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import NotFound from "./pages/NotFound";
import ProximosPassos from "./pages/ProximosPassos";
import SecurityDashboard from "./pages/SecurityDashboard";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Psicoterapia from "./pages/services/Psicoterapia";
import Consultoria from "./pages/services/Consultoria";
import Cursos from "./pages/services/Cursos";
import Workshops from "./pages/services/Workshops";
import { EcosystemItemPage, EcosystemCategoryPage } from "./pages/EcosystemDetail";

import MBSRMetaAnalise from "./pages/blog/MBSRMetaAnalise";
import TraumaCulturalResiliencia from "./pages/blog/TraumaCulturalResiliencia";
import ACTTerapiaContextos from "./pages/blog/ACTTerapiaContextos";
import PsicologiaOrganizacional from "./pages/blog/PsicologiaOrganizacional";
import RedesSociaisOportunidadesConflitos from "./pages/blog/RedesSociaisOportunidadesConflitos";

import Loja from "./pages/Loja";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Success from "./pages/Success";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
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
                <Route path="/obrigado" element={<Obrigado />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/propostas/proximos-passos" element={<ProximosPassos />} />

                <Route path="/services/psicoterapia" element={<Psicoterapia />} />
                <Route path="/services/consultoria" element={<Consultoria />} />
                <Route path="/services/cursos" element={<Cursos />} />
                <Route path="/services/workshops" element={<Workshops />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />

                <Route path="/ecosistema/:categoryId" element={<EcosystemCategoryPage />} />
                <Route path="/ecosistema/:categoryId/:itemSlug" element={<EcosystemItemPage />} />

                <Route path="/loja" element={<Loja />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/produto/:slug" element={<ProductDetail />} />
                <Route path="/success" element={<Success />} />

                <Route path="/blog/mbsr-meta-analise-eficacia" element={<MBSRMetaAnalise />} />
                <Route path="/blog/trauma-cultural-resiliencia-pos-colonial" element={<TraumaCulturalResiliencia />} />
                <Route path="/blog/act-terapia-contextos-africanos" element={<ACTTerapiaContextos />} />
                <Route path="/blog/psicologia-organizacional-transformacao-digital" element={<PsicologiaOrganizacional />} />
                <Route path="/blog/redes-sociais-oportunidades-ou-conflitos" element={<RedesSociaisOportunidadesConflitos />} />

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

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
