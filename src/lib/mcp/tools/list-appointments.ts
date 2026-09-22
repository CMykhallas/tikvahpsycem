import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_appointments",
  title: "Listar marcações",
  description:
    "Lista as marcações mais recentes a que o utilizador autenticado tem acesso. O acesso é controlado pelas regras de segurança da base de dados.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Número máximo de marcações a devolver (por omissão 10)."),
    status: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Filtrar por estado da marcação, por exemplo 'pending'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text" as const, text: "É necessário iniciar sessão." }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("appointments")
      .select("id, client_name, service_type, preferred_date, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text" as const, text: error.message }], isError: true };
    }
    const appointments = (data ?? []).map((row) => ({
      id: row.id,
      clientName: row.client_name,
      serviceType: row.service_type,
      preferredDate: row.preferred_date,
      status: row.status,
      createdAt: row.created_at,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: appointments.length
            ? appointments
                .map((a) => `- ${a.preferredDate} — ${a.clientName} (${a.serviceType}) [${a.status}]`)
                .join("\n")
            : "Sem marcações acessíveis para esta conta.",
        },
      ],
      structuredContent: { appointments },
    };
  },
});
