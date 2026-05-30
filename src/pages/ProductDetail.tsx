import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, MapPin, Clock, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      price_after_discount: product.price_after_discount,
      discount_percentage: product.discount_percentage,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="h-96 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-32 px-4 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate("/loja")}>Voltar à Loja</Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${product.name} | Tikvah`}
        description={product.description}
        keywords={`${product.name}, ${product.category}, psicologia maputo`}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Voltar */}
            <Button
              variant="ghost"
              onClick={() => navigate("/loja")}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à Loja
            </Button>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Imagem */}
              <div className="space-y-4">
                <Card className="overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🧠</div>
                      <p className="text-lg font-semibold text-muted-foreground">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Badges de confiança */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-sm font-semibold">Profissionais Certificados</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl mb-2">🔒</div>
                    <p className="text-sm font-semibold">100% Confidencial</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <p className="text-sm font-semibold">Alta Satisfação</p>
                  </Card>
                </div>
              </div>

              {/* Detalhes */}
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                  <div className="flex gap-2 mb-3">
                    <Badge>{product.category}</Badge>
                    {product.featured && (
                      <Badge className="bg-primary">⭐ Destaque</Badge>
                    )}
                    {product.discount_percentage > 0 && (
                      <Badge variant="destructive">
                        -{product.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                  
                  <p className="text-lg text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                {/* Preço */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-3">
                      {product.discount_percentage > 0 && (
                        <span className="text-2xl line-through text-muted-foreground">
                          {product.price.toLocaleString()} MZN
                        </span>
                      )}
                      <span className="text-5xl font-bold text-primary">
                        {product.price_after_discount.toLocaleString()} MZN
                      </span>
                    </div>
                    {product.discount_percentage > 0 && (
                      <p className="mt-2 text-primary font-semibold">
                        Economize {(product.price - product.price_after_discount).toLocaleString()} MZN
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Detalhes rápidos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{product.location}</span>
                  </div>
                  {product.duration_minutes && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{product.duration_minutes} minutos de atendimento</span>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleBuyNow}
                    className="flex-1"
                  >
                    Comprar Agora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    className="gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </Button>
                </div>

                <Separator />

                {/* Descrição completa */}
                {product.long_description && (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{product.long_description}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
