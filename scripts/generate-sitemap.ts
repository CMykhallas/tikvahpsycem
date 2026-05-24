// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// To add/remove routes from the sitemap, edit the `entries` array below.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://tikvahpsycem.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().split("T")[0];

const entries: SitemapEntry[] = [
  // Core
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/mission", changefreq: "monthly", priority: "0.6" },
  { path: "/values", changefreq: "monthly", priority: "0.6" },
  { path: "/approach", changefreq: "monthly", priority: "0.6" },
  { path: "/team", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/location", changefreq: "yearly", priority: "0.5" },
  { path: "/appointment", changefreq: "monthly", priority: "0.8" },
  { path: "/career", changefreq: "weekly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/testimonials", changefreq: "monthly", priority: "0.6" },
  { path: "/feedback", changefreq: "monthly", priority: "0.5" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/propostas/proximos-passos", changefreq: "monthly", priority: "0.5" },

  // Services
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/services/psicoterapia", changefreq: "monthly", priority: "0.8" },
  { path: "/services/consultoria", changefreq: "monthly", priority: "0.8" },
  { path: "/services/cursos", changefreq: "monthly", priority: "0.8" },
  { path: "/services/workshops", changefreq: "monthly", priority: "0.8" },

  // Shop
  { path: "/loja", changefreq: "weekly", priority: "0.9" },

  // Blog index + posts
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/blog/act-terapia-contextos-africanos", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/mbsr-meta-analise-eficacia", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/psicologia-organizacional-transformacao-digital", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/trauma-cultural-resiliencia-pos-colonial", changefreq: "monthly", priority: "0.7" },
];

function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`✓ sitemap.xml written (${entries.length} entries) — ${BASE_URL}`);
