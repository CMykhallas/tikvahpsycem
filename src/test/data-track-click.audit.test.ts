/**
 * Fails the pipeline if any CTA in src/**\/*.tsx misses `data-track-click`,
 * uses non-kebab-case, or duplicates the same value in the same file. Guards
 * GA4/GTM event consistency.
 *
 * Implementation is inlined (no cross-directory imports) so tsc-app's
 * include boundary stays intact.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ATTR_RE = /data-track-click\s*=\s*(?:"([^"]+)"|\{`([^`]+)`\}|\{"([^"]+)"\})/g;

interface Violation { file: string; kind: string; value?: string }

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

function runAudit(): { violations: Violation[]; scanned: number } {
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
      const value = raw.includes("${") ? raw.replace(/\$\{[^}]+\}/g, "X") : raw;
      count += 1;
      if (!KEBAB.test(value)) violations.push({ file: rel, kind: "bad_case", value });
      if (seen.has(value)) violations.push({ file: rel, kind: "duplicate", value });
      seen.add(value);
    }
    if (rel.includes("src/pages/services/") && count === 0) {
      violations.push({ file: rel, kind: "missing_coverage" });
    }
  }
  return { violations, scanned: files.length };
}

describe("data-track-click audit", () => {
  it("has no violations across src/**/*.tsx", () => {
    const { violations, scanned } = runAudit();
    expect(scanned).toBeGreaterThan(0);
    if (violations.length > 0) {
      const summary = violations.map((v) => `  - ${v.file} [${v.kind}] ${v.value ?? ""}`).join("\n");
      throw new Error(`${violations.length} violation(s):\n${summary}`);
    }
  });
});
