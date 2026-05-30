import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

export const CheckoutSummary = () => {
  const { items, getTotal } = useCart();

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
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-muted-foreground">Qtd: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {(item.price_after_discount * item.quantity).toLocaleString()} MZN
                </p>
                {item.discount_percentage > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    -{item.discount_percentage}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{(subtotal + discount).toLocaleString()} MZN</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-primary font-semibold">
              <span>Desconto Total</span>
              <span>-{discount.toLocaleString()} MZN</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total a Pagar</span>
          <span className="text-primary text-2xl">{subtotal.toLocaleString()} MZN</span>
        </div>

        <div className="space-y-2 pt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-semibold text-foreground">Incluso no Serviço:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Atendimento profissional certificado</li>
            <li>Ambiente confortável e privado</li>
            <li>Suporte pós-atendimento</li>
            <li>Material didático (quando aplicável)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
