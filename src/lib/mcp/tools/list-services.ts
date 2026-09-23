import { defineTool } from "@lovable.dev/mcp-js";
import { TIKVAH_CATEGORIES, TIKVAH_INTRO } from "@/data/tikvah-services";

export default defineTool({
  name: "list_services",
  title: "Listar categorias de serviços",
  description:
    "Lista as categorias do catálogo de serviços da Tikvah com um resumo de cada uma.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const categories = TIKVAH_CATEGORIES.map((category) => ({
      id: category.id,
      title: category.title,
      summary: category.summary,
      itemCount: category.items.length,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: `${TIKVAH_INTRO}\n\n${categories
            .map((c) => `- ${c.title} (${c.id}): ${c.summary}`)
            .join("\n")}`,
        },
      ],
      structuredContent: { categories },
    };
  },
});
