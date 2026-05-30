import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard } from "lucide-react";

export const CartSummary = () => {
  const { items, getTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const discount = items.reduce((total, item) => {
    return total + ((item.price - item.price_after_discount) * item.quantity);
  }, 0);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{(subtotal + discount).toLocaleString()} MZN</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-primary font-semibold">
              <span>Desconto</span>
              <span>-{discount.toLocaleString()} MZN</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{subtotal.toLocaleString()} MZN</span>
        </div>

        <div className="space-y-2 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Pagamento 100% seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>M-Pesa, Cartão ou Transferência</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full"
          onClick={() => navigate("/checkout")}
        >
          Finalizar Compra
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/loja")}
        >
          Continuar Comprando
        </Button>
      </CardFooter>
    </Card>
  );
};
