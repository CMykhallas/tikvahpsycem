import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
}

export const ProductGrid = ({ selectedCategory }: ProductGridProps) => {
  const { data: products, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (selectedCategory !== "Todos") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section
        role="alert"
        className="max-w-3xl mx-auto my-10 p-6 border border-amber-300 bg-amber-50 rounded-2xl shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Não foi possível carregar os produtos
            </h2>
            <p className="text-sm text-amber-900 mt-1">
              A loja está temporariamente indisponível. Por favor, tente novamente.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-3 px-3.5 py-2 text-sm font-bold rounded-md bg-amber-700 text-white hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 disabled:opacity-50 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          Nenhum produto encontrado nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
