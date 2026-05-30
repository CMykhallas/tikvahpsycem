import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogService {
  id: string;
  slug: string;
  area_code: string;
  area_name: string;
  title: string;
  short_description: string | null;
  long_description: string | null;
  price_from: number | null;
  currency: string | null;
  duration_label: string | null;
  modalities: string[] | null;
  target_audience: string[] | null;
  hero_image_url: string | null;
  benefits: string[] | null;
  sort_order: number | null;
  active: boolean;
}

export const useServicesCatalog = () => {
  return useQuery({
    queryKey: ["services-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as CatalogService[];
    },
  });
};

export const useServiceBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["service-slug", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug as string)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as CatalogService | null;
    },
  });
};
