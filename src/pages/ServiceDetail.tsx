import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useServiceBySlug } from "@/hooks/useServicesCatalog";

const formatPrice = (price: number | null, currency: string | null) => {
  if (!price || price === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(price) + ` ${currency || "MZN"}`;
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useServiceBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !service) return <Navigate to="/services" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.short_description,
    "category": service.area_name,
    "provider": { "@type": "Organization", "name": "Tikvah Psycem" },
    "areaServed": "Maputo, Moçambique",
    ...(service.price_from && service.price_from > 0 ? {
      "offers": { "@type": "Offer", "price": service.price_from, "priceCurrency": service.currency || "MZN" },
    } : {}),
  };

  const metaDesc = (service.short_description || service.title).slice(0, 155);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{`${service.title} — Tikvah Psycem`}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://tikvahpsycem.lovable.app/services/${service.slug}`} />
        <meta property="og:title" content={`${service.title} — Tikvah Psycem`} />
        <meta property="og:description" content={metaDesc} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/95 to-primary/70 text-white py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <Link to="/services" className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Todos os serviços
            </Link>
            <p className="text-xs font-semibold tracking-widest text-accent mb-2">
              ÁREA {service.area_code} · {service.area_name}
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{service.title}</h1>
            <p className="text-lg text-white/90 max-w-3xl">{service.short_description}</p>
          </div>
        </section>

        {/* Body */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {service.long_description && (
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Sobre este serviço</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
                </div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Benefícios</h2>
                  <ul className="space-y-2">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-foreground">
                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <Card className="sticky top-24 border-2">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Investimento</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(service.price_from, service.currency)}
                    </p>
                  </div>

                  {service.duration_label && (
                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div><span className="font-medium">Duração:</span> {service.duration_label}</div>
                    </div>
                  )}

                  {service.modalities && service.modalities.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {service.modalities.map((m) => <Badge key={m} variant="outline">{m}</Badge>)}
                      </div>
                    </div>
                  )}

                  {service.target_audience && service.target_audience.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {service.target_audience.map((a) => <Badge key={a} variant="secondary">{a}</Badge>)}
                      </div>
                    </div>
                  )}

                  <Link to="/appointment" className="block pt-2">
                    <Button className="w-full text-white" style={{ backgroundColor: "#00A859" }}>
                      Proposta Formal 60s <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full">Falar com consultor</Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
