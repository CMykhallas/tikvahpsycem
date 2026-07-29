/**
 * Logger centralizado.
 *
 * CORREÇÃO (Descoberta Baixa B — "Console Logging em Produção"):
 * `console.log/warn/debug/info` deixam de escrever na consola do browser em
 * produção (evita expor estrutura interna, IDs, fluxos de autenticação, etc.
 * a quem abrir as DevTools). `console.error` continua activo em produção
 * porque é útil para diagnosticar problemas reportados por utilizadores e
 * não deve, por si só, conter dados sensíveis (ver nota abaixo).
 *
 * Uso:
 *   import { logger } from "@/lib/logger";
 *   logger.log("mensagem de debug", { detalhe });
 *
 * IMPORTANTE: isto substitui apenas chamadas de log de diagnóstico/depuração.
 * Não é o mecanismo de auditoria de segurança — esse continua a ser o
 * `SecurityLogger` (server-side, persistido em `audit_log`/`security_incidents`)
 * já usado em `useContactForm`, `useAuth`, edge functions, etc. Nunca coloques
 * segredos, tokens completos, passwords ou dados sensíveis de clientes em
 * nenhum destes logs — mesmo em desenvolvimento.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  // Erros mantêm-se visíveis em produção para permitir diagnóstico,
  // mas nunca devem incluir segredos — ver nota acima.
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
