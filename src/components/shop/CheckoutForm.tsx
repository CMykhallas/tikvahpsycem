import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Lock, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CheckoutForm = () => {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsProcessing(true);

    try {
      // Criar pedido
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          products: items,
          paymentMethod,
          userInfo: formData,
        },
      });

      if (error) throw error;

      // Armazenar token de acesso ao pedido
      const accessToken = data.order?.accessToken;
      
      if (paymentMethod === "stripe") {
        // Redirecionar para Stripe Checkout
        window.open(data.checkoutUrl, "_blank");
        toast.success("Redirecionando para pagamento...");
        setTimeout(() => {
          clearCart();
          navigate(`/success?order_id=${data.orderId}&token=${accessToken}`);
        }, 2000);
      } else if (paymentMethod === "mpesa") {
        // Processar M-Pesa
        const { data: mpesaData, error: mpesaError } = await supabase.functions.invoke(
          "process-mpesa-payment",
          {
            body: {
              phoneNumber: formData.phone,
              amount: getTotal(),
              orderId: data.orderId,
            },
          }
        );

        if (mpesaError) throw mpesaError;

        if (mpesaData.success) {
          toast.success("Pagamento M-Pesa processado com sucesso!");
          clearCart();
          navigate(`/success?order_id=${data.orderId}&token=${accessToken}`);
        } else {
          toast.error("Erro ao processar pagamento M-Pesa");
        }
      } else {
        // Transferência bancária
        toast.success("Pedido criado! Detalhes da transferência enviados por email.");
        clearCart();
        navigate(`/success?order_id=${data.orderId}&token=${accessToken}`);
      }
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: Smartphone,
      description: "Pagamento instantâneo via M-Pesa (Vodacom)",
    },
    {
      id: "stripe",
      name: "Cartão de Crédito/Débito",
      icon: CreditCard,
      description: "Visa, Mastercard e outros",
    },
    {
      id: "bank_transfer",
      name: "Transferência Bancária",
      icon: Building2,
      description: "BIM - Conta: 182479117",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados pessoais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Seus Dados</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="joao@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+258 84 123 4567"
                required
              />
              <p className="text-sm text-muted-foreground">
                Para M-Pesa, use o número da sua conta Vodacom
              </p>
            </div>
          </div>

          <Separator />

          {/* Método de pagamento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Método de Pagamento</h3>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-colors">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Icon className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Segurança */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">Pagamento Seguro</p>
                <p className="text-muted-foreground">
                  Seus dados são protegidos com criptografia de nível militar (TLS 1.3). Nunca armazenamos informações de cartão.
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              `Pagar ${getTotal().toLocaleString()} MZN`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
