import { defineTool } from "@lovable.dev/mcp-js";
import { BLOG_POSTS } from "@/data/blog-posts";

export default defineTool({
  name: "list_blog_posts",
  title: "Listar artigos do blog",
  description: "Lista os artigos publicados no blog da Tikvah, com slug, título e data.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const posts = BLOG_POSTS.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      datePublished: post.datePublished,
      url: `https://tikvahpsycem.lovable.app/blog/${post.slug}`,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: posts.map((p) => `- ${p.datePublished} — ${p.title} (${p.url})`).join("\n"),
        },
      ],
      structuredContent: { posts },
    };
  },
});
