import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CartButton = () => {
  const { items } = useCart();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          size="lg"
          onClick={() => navigate("/carrinho")}
          className="rounded-full shadow-2xl hover:shadow-primary/50 transition-all h-16 w-16 relative group"
        >
          <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <Badge 
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full flex items-center justify-center bg-destructive text-white"
          >
            {itemCount}
          </Badge>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
