import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Clock, MapPin, Users, ArrowRight, Shield, Award, Zap, Target } from "lucide-react";
import { useServiceBySlug } from "@/hooks/useServicesCatalog";
import { ProposalModal } from "@/components/services/ProposalModal";

const formatPrice = (price: number | null, currency: string | null) => {
  if (!price || price === 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(price) + ` ${currency || "MZN"}`;
};

const PILLARS = [
  { icon: Shield, title: "Confidencialidade", text: "Sigilo profissional rigoroso (ISO 27001)." },
  { icon: Award, title: "Especialistas Certificados", text: "Equipa multidisciplinar com formação internacional." },
  { icon: Zap, title: "Resultados Mensuráveis", text: "Indicadores claros desde a 1.ª sessão." },
  { icon: Target, title: "Abordagem Personalizada", text: "Plano desenhado para o seu contexto." },
];

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useServiceBySlug(slug);
  const [proposalOpen, setProposalOpen] = useState(false);

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-xs font-semibold tracking-widest text-accent mb-2">
                ÁREA {service.area_code} · {service.area_name}
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{service.title}</h1>
              <p className="text-lg text-white/90 max-w-3xl">{service.short_description}</p>
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              {service.long_description && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Sobre este serviço</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
                </motion.div>
              )}

              {service.benefits && service.benefits.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Benefícios</h2>
                  <ul className="space-y-2">
                    {service.benefits.map((b, i) => (
                      <motion.li
                        key={b}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-foreground"
                      >
                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Pillars */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Porquê a Tikvah Psycem</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PILLARS.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -3 }}
                        className="border border-border rounded-lg p-4 bg-card"
                      >
                        <Icon className="w-6 h-6 text-primary mb-2" />
                        <h4 className="font-semibold mb-1">{p.title}</h4>
                        <p className="text-sm text-muted-foreground">{p.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Process */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Como funciona</h2>
                <ol className="space-y-3">
                  {[
                    { t: "Pedido em 60s", d: "Preencha o formulário rápido (modalidade, público, contacto)." },
                    { t: "Resposta em 24h", d: "Enviamos proposta formal personalizada por email." },
                    { t: "Sessão / Início", d: "Agendamento confirmado por SMS/Email com 100% privacidade." },
                  ].map((s, i) => (
                    <motion.li
                      key={s.t}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">{i + 1}</div>
                      <div>
                        <p className="font-semibold">{s.t}</p>
                        <p className="text-sm text-muted-foreground">{s.d}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
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

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="pt-2">
                    <Button
                      onClick={() => setProposalOpen(true)}
                      className="w-full text-white shadow-lg"
                      style={{ backgroundColor: "#00A859" }}
                    >
                      Proposta Formal 60s <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full">Falar com consultor</Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </main>

      <ProposalModal
        open={proposalOpen}
        onOpenChange={setProposalOpen}
        service={service ? { slug: service.slug, title: service.title, area_code: service.area_code, area_name: service.area_name } : null}
      />

      <Footer />
    </div>
  );
};

export default ServiceDetail;
