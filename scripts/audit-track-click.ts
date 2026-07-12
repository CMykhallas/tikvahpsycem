/**
 * audit-track-click.ts
 * --------------------
 * Static audit over src/**\/*.tsx to enforce:
 *   1. Every `data-track-click` value uses kebab-case (^[a-z0-9]+(-[a-z0-9]+)*$).
 *   2. No duplicate `data-track-click` value inside the same file.
 *   3. Minimum coverage: files under src/pages/services/ MUST have ≥ 1
 *      `data-track-click` attribute (proxy for CTA instrumentation).
 *
 * Exit codes: 0 = pass, 1 = at least one violation.
 * Also importable — `runAudit()` returns the report for Vitest.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ATTR_RE = /data-track-click\s*=\s*(?:"([^"]+)"|\{`([^`]+)`\}|\{"([^"]+)"\})/g;

export interface Violation {
  file: string;
  kind: "bad_case" | "duplicate" | "missing_coverage";
  value?: string;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

export function runAudit(): { violations: Violation[]; scanned: number } {
  const files = walk(join(ROOT, "src"));
  const violations: Violation[] = [];

  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const rel = relative(ROOT, f);
    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    ATTR_RE.lastIndex = 0;
    let count = 0;
    while ((match = ATTR_RE.exec(src)) !== null) {
      const raw = match[1] ?? match[2] ?? match[3] ?? "";
      // Skip template values with ${...}
      const value = raw.includes("${") ? raw.replace(/\$\{[^}]+\}/g, "X") : raw;
      count += 1;
      if (!KEBAB.test(value)) violations.push({ file: rel, kind: "bad_case", value });
      if (seen.has(value)) violations.push({ file: rel, kind: "duplicate", value });
      seen.add(value);
    }

    if (rel.includes("src/pages/services/") && count === 0 && !rel.endsWith("index.tsx")) {
      violations.push({ file: rel, kind: "missing_coverage" });
    }
  }
  return { violations, scanned: files.length };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const { violations, scanned } = runAudit();
  console.log(`[track-click-audit] scanned ${scanned} .tsx files`);
  if (violations.length === 0) {
    console.log("✓ no violations");
    process.exit(0);
  }
  for (const v of violations) {
    console.error(`✗ ${v.file}  [${v.kind}] ${v.value ?? ""}`);
  }
  process.exit(1);
}
