import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-primary hover:bg-gradient-accent shadow-floating hover:shadow-primary transition-all duration-300 hover:scale-110"
      size="icon"
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="w-5 h-5 text-white" />
    </Button>
  );
};