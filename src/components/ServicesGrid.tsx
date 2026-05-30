
import React from "react";
import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { useServices } from "@/hooks/useServices";

export const ServicesGrid: React.FC = () => {
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-64 bg-muted rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {services?.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ServiceCard 
            id={service.id}
            name={service.title}
            description={service.description}
            price={1000}
            currency="MZN"
            category="Psicologia"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
