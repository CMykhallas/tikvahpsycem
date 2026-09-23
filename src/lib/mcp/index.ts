import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import getServiceCategoryTool from "./tools/get-service-category";
import listBlogPostsTool from "./tools/list-blog-posts";
import listAppointmentsTool from "./tools/list-appointments";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "tikvahpsycem",
  title: "tikvahpsycem",
  version: "0.1.0",
  instructions:
    "Ferramentas da Tikvah Psycem. Use `list_services` e `get_service_category` para o catálogo de serviços, `list_blog_posts` para artigos publicados e `list_appointments` para marcações acessíveis à conta autenticada.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServicesTool, getServiceCategoryTool, listBlogPostsTool, listAppointmentsTool],
});
