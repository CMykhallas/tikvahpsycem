import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Brain, Users, Stethoscope, Activity, Sparkles,
  DollarSign, Briefcase, Scale, Cpu, GraduationCap,
  HeartHandshake, HandHeart, ArrowUp, Phone, Mail, ArrowRight,
} from "lucide-react";
import { useServicesCatalog, type CatalogService } from "@/hooks/useServicesCatalog";

const AREA_META: Record<string, { name: string; short: string; icon: React.ComponentType<{ className?: string }>; nav: string }> = {
  "01": { name: "Psicoterapia Clínica", short: "Clínica", icon: Brain, nav: "area-01" },
  "02": { name: "Psicologia Organizacional", short: "Empresarial", icon: Users, nav: "area-02" },
  "03": { name: "Psiquiatria Integrativa", short: "Psiquiatria", icon: Stethoscope, nav: "area-03" },
  "04": { name: "Neuropsicologia e Reabilitação", short: "Neuro", icon: Activity, nav: "area-04" },
  "05": { name: "Terapias Complementares", short: "Terapias", icon: Sparkles, nav: "area-05" },
  "06": { name: "Consultoria Financeira", short: "Financeira", icon: DollarSign, nav: "area-06" },
  "07": { name: "Consultoria Empresarial", short: "Empresarial", icon: Briefcase, nav: "area-07" },
  "08": { name: "Direito e Gestão RH", short: "Jurídico", icon: Scale, nav: "area-08" },
  "09": { name: "Tecnologia da Informação", short: "TI", icon: Cpu, nav: "area-09" },
  "10": { name: "Formação Executiva", short: "Formação", icon: GraduationCap, nav: "area-10" },
  "11": { name: "Psicologia Social Comunitária", short: "Social", icon: HeartHandshake, nav: "area-11" },
  "12": { name: "Voluntariado e Responsabilidade Social", short: "Voluntariado", icon: HandHeart, nav: "area-12" },
};

const ALL = "__all__";

const formatPrice = (price: number | null, currency: string | null) => {
  if (!price || price === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(price) + ` ${currency || "MZN"}`;
};

const ServiceCard = ({ s }: { s: CatalogService }) => (
  <Card className="group h-full flex flex-col border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-primary/40">
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Badge variant="secondary" className="text-xs">{s.area_name}</Badge>
        <span className="text-sm font-bold text-primary whitespace-nowrap">{formatPrice(s.price_from, s.currency)}</span>
      </div>
      <h4 className="text-xl font-bold text-foreground leading-tight mb-2">{s.title}</h4>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{s.short_description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(s.modalities || []).map((m) => (
          <Badge key={m} variant="outline" className="text-[10px] font-medium">{m}</Badge>
        ))}
      </div>
      <Link to={`/services/${s.slug}`} className="mt-auto">
        <Button
          className="w-full text-white"
          style={{ backgroundColor: "#00A859" }}
        >
          Proposta Formal 60s
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const Services = () => {
  const { data: services = [], isLoading } = useServicesCatalog();
  const [modality, setModality] = useState<string>(ALL);
  const [audience, setAudience] = useState<string>(ALL);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (modality !== ALL && !(s.modalities || []).includes(modality)) return false;
      if (audience !== ALL && !(s.target_audience || []).includes(audience)) return false;
      return true;
    });
  }, [services, modality, audience]);

  const grouped = useMemo(() => {
    const groups = new Map<string, CatalogService[]>();
    for (const s of filtered) {
      const arr = groups.get(s.area_code) || [];
      arr.push(s);
      groups.set(s.area_code, arr);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Serviços Tikvah Psycem",
    "itemListElement": services.map((s, i) => ({
      "@type": "Service",
      "position": i + 1,
      "name": s.title,
      "description": s.short_description,
      "category": s.area_name,
      "provider": { "@type": "Organization", "name": "Tikvah Psycem" },
      "areaServed": "Maputo, Moçambique",
      "url": `https://tikvahpsycem.lovable.app/services/${s.slug}`,
      ...(s.price_from && s.price_from > 0 ? {
        "offers": { "@type": "Offer", "price": s.price_from, "priceCurrency": s.currency || "MZN" },
      } : {}),
    })),
  }), [services]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tikvah Psycem — 12 Áreas de Excelência Multidisciplinar</title>
        <meta name="description" content="12 áreas executivas: Clínica, Empresarial, Financeira, TI, Jurídico, Formação e mais. Soluções mensuráveis para PMEs, ONGs e profissionais em Moçambique." />
        <link rel="canonical" href="https://tikvahpsycem.lovable.app/services" />
        <meta property="og:title" content="Tikvah Psycem — 12 Áreas de Excelência" />
        <meta property="og:description" content="Transformação mensurável para PMEs, ONGs, profissionais liberais e comunidades." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      {/* Sticky Executive Nav */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap">
            <span className="text-xs font-semibold text-muted-foreground mr-2 hidden md:inline">Áreas:</span>
            {Object.entries(AREA_META).map(([code, meta]) => (
              <a
                key={code}
                href={`#${meta.nav}`}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {meta.short}
              </a>
            ))}
            <Link to="/contact" className="ml-auto pl-3">
              <Button size="sm" variant="outline" className="text-xs">Contato</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/95 via-primary to-primary/80 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Tikvah Psycem — 12 Áreas de Excelência Multidisciplinar
          </h1>
          <h2 className="text-lg md:text-2xl text-white/90 max-w-4xl mx-auto">
            Transformação Mensurável para PMEs, ONGs, Profissionais Liberais e Comunidades
          </h2>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-card/50 sticky top-[104px] z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-foreground">Filtros:</span>
          <Select value={modality} onValueChange={setModality}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Modalidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas modalidades</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Público-Alvo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os públicos</SelectItem>
              <SelectItem value="PME">PME</SelectItem>
              <SelectItem value="ONG">ONG</SelectItem>
              <SelectItem value="Estudantes">Estudantes</SelectItem>
              <SelectItem value="Público">Público Geral</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} serviços</span>
        </div>
      </section>

      {/* Areas */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
            </div>
          )}

          {!isLoading && grouped.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Nenhum serviço corresponde aos filtros.</p>
          )}

          {grouped.map(([code, items]) => {
            const meta = AREA_META[code];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <div key={code} id={meta.nav} className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary tracking-widest">ÁREA {code}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">{meta.name}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((s) => <ServiceCard key={s.id} s={s} />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky Footer Bar */}
      <div className="sticky bottom-0 z-40 bg-primary text-white border-t border-primary/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+258827592980" className="flex items-center gap-1.5 hover:text-accent">
              <Phone className="w-3.5 h-3.5" /> +258 82 759 2980
            </a>
            <a href="mailto:suporte.oficina.psicologo@proton.me" className="hidden md:flex items-center gap-1.5 hover:text-accent">
              <Mail className="w-3.5 h-3.5" /> suporte.oficina.psicologo@proton.me
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 text-white/80">
            <span>BCI</span><span>•</span><span>m-Pesa</span><span>•</span><span>E-mola</span><span>•</span><span>CIVA 17%</span>
          </div>
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Services;
