import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export const CartItems = () => {
  const { items, updateQuantity, removeItem } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-4">
                {item.discount_percentage > 0 && (
                  <span className="text-sm line-through text-muted-foreground">
                    {item.price.toLocaleString()} MZN
                  </span>
                )}
                <span className="text-xl font-bold text-primary">
                  {item.price_after_discount.toLocaleString()} MZN
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    updateQuantity(item.id, Math.max(1, value));
                  }}
                  className="w-20 text-center"
                  min="1"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
