import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartButton } from "@/components/shop/CartButton";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const Loja = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const { items } = useCart();

  const categories = [
    "Todos",
    "Psicoterapia",
    "Consultoria",
    "Cursos",
    "Workshops",
    "Avaliação",
    "Pacotes",
  ];

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <SEOHead
        title="Loja - Serviços de Psicologia | Tikvah"
        description="Explore nossos serviços de psicologia, consultoria, cursos e workshops com preços acessíveis em Maputo e Matola. Pagamento via M-Pesa, cartão ou transferência."
        keywords="loja psicologia maputo, serviços psicologia moçambique, consulta psicológica online, terapia casal preço"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        
        {/* Botão flutuante do carrinho */}
        <CartButton />

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Nossos Serviços de <span className="text-primary">Psicologia</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profissionais certificados em Maputo e Matola. Pagamento flexível via M-Pesa, cartão ou transferência bancária.
              </p>
            </div>

            {/* Filtros de categoria */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de Produtos */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <ProductGrid selectedCategory={selectedCategory} />
          </div>
        </section>

        {/* Seção de Confiança */}
        <section className="py-16 bg-primary/5 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Clientes Atendidos</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Taxa de Satisfação</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <p className="text-muted-foreground">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Loja;
