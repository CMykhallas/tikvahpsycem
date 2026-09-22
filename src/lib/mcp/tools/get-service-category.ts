import { ToolError, defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TIKVAH_CATEGORIES } from "@/data/tikvah-services";

export default defineTool({
  name: "get_service_category",
  title: "Detalhe de uma categoria de serviços",
  description:
    "Devolve todos os serviços de uma categoria do catálogo Tikvah, a partir do seu id.",
  inputSchema: {
    category_id: z
      .string()
      .min(1)
      .describe("Id da categoria, por exemplo 'saude-mental'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category_id }) => {
    const category = TIKVAH_CATEGORIES.find((c) => c.id === category_id);
    if (!category) {
      throw new ToolError(
        `Categoria desconhecida: ${category_id}. Ids válidos: ${TIKVAH_CATEGORIES.map((c) => c.id).join(", ")}`,
      );
    }
    const detail = {
      id: category.id,
      title: category.title,
      summary: category.summary,
      items: category.items.map((item) => ({
        title: item.title,
        description: item.description,
      })),
    };
    return {
      content: [
        {
          type: "text" as const,
          text: `${detail.title}\n${detail.summary}\n\n${detail.items
            .map((i) => `- ${i.title}: ${i.description}`)
            .join("\n")}`,
        },
      ],
      structuredContent: { category: detail },
    };
  },
});
