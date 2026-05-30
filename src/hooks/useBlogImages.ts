
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBlogImages = (blogSlug: string) => {
  return useQuery({
    queryKey: ["blog-images", blogSlug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blog_images")
        .select("*")
        .eq("blog_slug", blogSlug)
        .order("position");
      
      if (error) throw error;
      return data || [];
    },
  });
};
