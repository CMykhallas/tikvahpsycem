
import React from "react";
import { motion } from "framer-motion";
import { AnimatedImage } from "./AnimatedImage";
import { useBlogImages } from "@/hooks/useBlogImages";

interface BlogImageGalleryProps {
  blogSlug: string;
}

export const BlogImageGallery: React.FC<BlogImageGalleryProps> = ({ blogSlug }) => {
  const { data: images, isLoading } = useBlogImages(blogSlug);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 my-12"
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`${
            index % 2 === 0 ? "lg:pr-12" : "lg:pl-12 lg:ml-auto"
          } max-w-4xl`}
        >
          <AnimatedImage
            src={image.image_url}
            alt={image.alt_text}
            className="w-full h-64 md:h-80 lg:h-96"
            caption={image.alt_text}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
