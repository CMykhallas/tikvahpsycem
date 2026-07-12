/**
 * Fails the pipeline when a CTA misses `data-track-click`, uses a non-kebab
 * value, or duplicates an existing id within the same file. Guards GA4/GTM
 * event consistency.
 */
import { describe, it, expect } from "vitest";
import { runAudit } from "../../scripts/audit-track-click";

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
