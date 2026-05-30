
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LazyImage } from "./LazyImage";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = "",
  caption
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <LazyImage
          src={src}
          alt={alt}
          className="w-full h-auto object-cover rounded-xl shadow-2xl"
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlay com gradiente elegante */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"
        />
        
        {/* Efeito de brilho ao hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
          }}
        />
      </motion.div>
      
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-muted-foreground italic text-center"
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  );
};
