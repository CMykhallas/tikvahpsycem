import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { CreditCard, Smartphone, DollarSign, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckoutProps {
  service: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CheckoutOnline = ({ service, amount, currency, onSuccess, onCancel }: CheckoutProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "stripe",
      name: "Cartão de Crédito/Débito",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      enabled: true
    },
    {
      id: "mpesa",
      name: "M-Pesa Vodacom",
      icon: Smartphone,
      description: "Pagamento móvel M-Pesa",
      enabled: true,
      phone: "+258828926020" // WhatsApp link for M-Pesa
    },
    {
      id: "emola",
      name: "E-mola",
      icon: Smartphone,
      description: "Carteira digital E-mola",
      enabled: true
    }
  ];

  const handlePayment = async () => {
    if (!paymentMethod || !formData.email || !formData.phone || !formData.fullName) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "mpesa") {
        // For M-Pesa, redirect to WhatsApp with payment details
        const message = `Olá! Gostaria de efetuar pagamento via M-Pesa:\n\nServiço: ${service}\nValor: ${amount} ${currency}\nNome: ${formData.fullName}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\n\nPor favor, procedam com as instruções de pagamento.`;
        const whatsappUrl = `https://wa.me/258827592980?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Redirecionado para WhatsApp",
          description: "Complete o pagamento via M-Pesa através do WhatsApp.",
        });
      } else if (paymentMethod === "stripe") {
        // For Stripe, you would integrate with your backend here
        // This is a placeholder for the actual Stripe integration
        toast({
          title: "Redirecionando para pagamento seguro",
          description: "Você será redirecionado para completar o pagamento.",
        });
        
        // Simulate successful payment
        setTimeout(() => {
          toast({
            title: "Pagamento processado com sucesso!",
            description: "Você receberá uma confirmação por email.",
          });
          onSuccess?.();
        }, 2000);
      } else {
        // For other payment methods, redirect to WhatsApp
        const message = `Olá! Gostaria de efetuar pagamento via ${paymentMethods.find(p => p.id === paymentMethod)?.name}:\n\nServiço: ${service}\nValor: ${amount} ${currency}\nNome: ${formData.fullName}\nEmail: ${formData.email}\nTelefone: ${formData.phone}\n\nPor favor, procedam com as instruções de pagamento.`;
        const whatsappUrl = `https://wa.me/258827592980?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        toast({
          title: "Redirecionado para WhatsApp",
          description: "Complete o pagamento através do WhatsApp.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro. Tente novamente ou contacte o suporte.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-floating">
      <CardHeader className="bg-gradient-primary text-white">
        <CardTitle className="flex items-center font-heading">
          <Shield className="w-5 h-5 mr-2" />
          Checkout Seguro
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-secondary rounded-lg p-4">
          <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
          <div className="flex justify-between items-center">
            <span>{service}</span>
            <span className="font-bold">{amount} {currency}</span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Informações do Cliente</h3>
          
          <div>
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+258 84 123 4567"
              required
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="font-semibold">Método de Pagamento</h3>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value={method.id} id={method.id} disabled={!method.enabled} />
                <method.icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Security Notice */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">Pagamento 100% Seguro</p>
              <p className="text-xs text-success/80">
                Seus dados são protegidos com criptografia SSL e não armazenamos informações de cartão.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="flex-1 btn-primary-gradient"
          >
            {isProcessing ? "Processando..." : `Pagar ${amount} ${currency}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};