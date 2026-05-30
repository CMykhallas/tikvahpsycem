import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Clock } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50">
        <CardHeader className="space-y-3">
          {product.featured && (
            <Badge className="w-fit bg-primary text-primary-foreground">
              ⭐ Destaque
            </Badge>
          )}
          
          {product.discount_percentage > 0 && (
            <Badge variant="destructive" className="w-fit">
              -{product.discount_percentage}% OFF
            </Badge>
          )}

          <h3 className="text-xl font-bold text-foreground line-clamp-2">
            {product.name}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <p className="text-muted-foreground line-clamp-3">
            {product.description}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>
            
            {product.duration_minutes && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{product.duration_minutes} minutos</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {product.discount_percentage > 0 && (
              <p className="text-sm line-through text-muted-foreground">
                {product.price.toLocaleString()} {product.currency}
              </p>
            )}
            <p className="text-3xl font-bold text-primary">
              {product.price_after_discount.toLocaleString()} {product.currency}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Link to={`/produto/${product.slug}`} className="w-full">
            <Button variant="outline" className="w-full">
              Ver Detalhes
            </Button>
          </Link>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
