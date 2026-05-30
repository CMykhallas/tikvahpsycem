import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderData {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  metadata: {
    customer_name: string;
    customer_email: string;
  };
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Limpar carrinho se chegou aqui
    localStorage.removeItem("tikvah-cart");
    
    // Buscar dados do pedido com token de acesso
    const fetchOrderData = async () => {
      if (!orderId || !token) {
        setIsLoading(false);
        return;
      }

      try {
        // Use secure database function that validates token server-side
        const { data, error } = await supabase
          .rpc('get_order_by_token', { 
            p_order_id: orderId, 
            p_token: token 
          })
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar pedido:', error);
          toast.error('Não foi possível carregar os detalhes do pedido');
        } else if (data) {
          setOrderData({
            ...data,
            metadata: data.metadata as { customer_name: string; customer_email: string }
          } as OrderData);
        }
      } catch (error) {
        console.error('Erro ao buscar pedido:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, token]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-primary/20 shadow-2xl">
                <CardContent className="p-12 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-24 h-24 text-primary mx-auto mb-6" />
                  </motion.div>

                  <div className="space-y-3">
                    <h1 className="text-4xl font-bold text-foreground">
                      Pagamento Confirmado!
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Obrigado pela sua compra. Seu pedido foi processado com sucesso.
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : orderData ? (
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Número do Pedido:</p>
                        <p className="text-lg font-mono font-bold text-foreground">{orderData.id}</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 border border-border text-left">
                        <h3 className="font-semibold text-foreground mb-3">Detalhes do Pedido</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cliente:</span>
                            <span className="font-medium text-foreground">{orderData.metadata?.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium text-foreground">{orderData.metadata?.customer_email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold text-foreground">{(orderData.amount / 100).toLocaleString()} MZN</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Método de Pagamento:</span>
                            <span className="font-medium text-foreground capitalize">{orderData.payment_method.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium text-foreground capitalize">{orderData.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : orderId && (
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Número do Pedido:</p>
                      <p className="text-lg font-mono font-bold text-foreground">{orderId}</p>
                    </div>
                  )}

                  <div className="space-y-4 pt-6">
                    <p className="text-muted-foreground">
                      Em breve você receberá um email de confirmação com todos os detalhes do seu agendamento.
                    </p>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-2">Próximos Passos:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 text-left">
                        <li>✅ Aguarde nosso email de confirmação</li>
                        <li>✅ Entraremos em contato via WhatsApp para agendar</li>
                        <li>✅ Guarde o número do pedido para referência</li>
                      </ul>
                    </div>

                    {token && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <span className="font-semibold">🔒 Link Seguro:</span> Guarde este link para acompanhar seu pedido. Ele expira em 30 dias.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 justify-center pt-6">
                    <Button
                      size="lg"
                      onClick={() => navigate("/")}
                      className="gap-2"
                    >
                      <Home className="w-5 h-5" />
                      Voltar ao Início
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/loja")}
                      className="gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Continuar Comprando
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Success;
