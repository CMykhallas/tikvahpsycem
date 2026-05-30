import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { CheckoutSummary } from "@/components/shop/CheckoutSummary";
import { useCart } from "@/hooks/useCart";
import { Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { items } = useCart();

  if (items.length === 0) {
    return <Navigate to="/loja" replace />;
  }

  return (
    <>
      <SEOHead
        title="Finalizar Compra | Tikvah"
        description="Complete sua compra com segurança usando M-Pesa, cartão de crédito ou transferência bancária."
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Finalizar Compra
              </h1>
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-semibold">Pagamento 100% Seguro e Criptografado</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CheckoutForm />
              </div>
              <div>
                <CheckoutSummary />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
