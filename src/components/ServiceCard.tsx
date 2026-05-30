import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_minutes?: number;
  category: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  description,
  price,
  currency,
  duration_minutes,
  category
}) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Redirecionar para página de agendamento
    navigate('/appointment');
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {category}
            </Badge>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right"
            >
              <div className="text-2xl font-bold text-primary">
                {price.toLocaleString()} {currency}
              </div>
            </motion.div>
          </div>
          <CardTitle className="text-xl leading-tight">{name}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1">
          <p className="text-muted-foreground mb-4">{description}</p>
          
          {duration_minutes && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="w-4 h-4 mr-2" />
              {duration_minutes} minutos
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            Maputo, Moçambique
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
          >
            Agendar Agora
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
