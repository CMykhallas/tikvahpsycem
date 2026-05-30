import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { CartItems } from "@/components/shop/CartItems";
import { CartSummary } from "@/components/shop/CartSummary";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Carrinho = () => {
  const { items } = useCart();

  return (
    <>
      <SEOHead
        title="Carrinho de Compras | Tikvah"
        description="Revise seus serviços selecionados e finalize sua compra com segurança."
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <Link to="/loja">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar à Loja
                </Button>
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-8">
              Carrinho de Compras
            </h1>

            {items.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Seu carrinho está vazio
                  </h2>
                  <p className="text-muted-foreground">
                    Adicione serviços ao carrinho para continuar
                  </p>
                </div>
                <Link to="/loja">
                  <Button size="lg">
                    Explorar Serviços
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <CartItems />
                </div>
                <div>
                  <CartSummary />
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Carrinho;
