// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
//
// lastmod is filled automatically:
//   - Blog posts → datePublished/dateModified from src/data/blog-posts.ts
//   - Static pages → mtime of the corresponding page component file
//   - Fallback → today

import { writeFileSync, statSync, existsSync } from "fs";
import { resolve } from "path";
import { BLOG_POSTS } from "../src/data/blog-posts";

const BASE_URL = "https://tikvahpsycem.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().split("T")[0];

const fileMtime = (relPath: string): string | undefined => {
  const abs = resolve(relPath);
  if (!existsSync(abs)) return undefined;
  return statSync(abs).mtime.toISOString().split("T")[0];
};

// Map a route to the page file whose mtime represents its "last updated" date.
const ROUTE_TO_FILE: Record<string, string> = {
  "/": "src/pages/Index.tsx",
  "/about": "src/pages/About.tsx",
  "/mission": "src/pages/Mission.tsx",
  "/values": "src/pages/Values.tsx",
  "/approach": "src/pages/Approach.tsx",
  "/team": "src/pages/Team.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/location": "src/pages/Location.tsx",
  "/appointment": "src/pages/Appointment.tsx",
  "/career": "src/pages/Career.tsx",
  "/faq": "src/pages/FAQ.tsx",
  "/testimonials": "src/pages/Testimonials.tsx",
  "/feedback": "src/pages/Feedback.tsx",
  "/politica-de-privacidade": "src/pages/PoliticaPrivacidade.tsx",
  "/propostas/proximos-passos": "src/pages/ProximosPassos.tsx",
  "/services": "src/pages/Services.tsx",
  "/services/psicoterapia": "src/pages/services/Psicoterapia.tsx",
  "/services/consultoria": "src/pages/services/Consultoria.tsx",
  "/services/cursos": "src/pages/services/Cursos.tsx",
  "/services/workshops": "src/pages/services/Workshops.tsx",
  "/loja": "src/pages/Loja.tsx",
  "/blog": "src/pages/Blog.tsx",
};

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
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
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/services/psicoterapia", changefreq: "monthly", priority: "0.8" },
  { path: "/services/consultoria", changefreq: "monthly", priority: "0.8" },
  { path: "/services/cursos", changefreq: "monthly", priority: "0.8" },
  { path: "/services/workshops", changefreq: "monthly", priority: "0.8" },
  { path: "/loja", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
].map((e) => ({
  ...e,
  lastmod: fileMtime(ROUTE_TO_FILE[e.path] ?? "") ?? today,
}));

const blogEntries: SitemapEntry[] = BLOG_POSTS.map((post) => ({
  path: `/blog/${post.slug}`,
  changefreq: "monthly",
  priority: "0.7",
  lastmod: post.dateModified ?? post.datePublished,
}));

// Bump /blog lastmod to the most recent post update.
const latestBlog = blogEntries
  .map((e) => e.lastmod!)
  .sort()
  .at(-1);
if (latestBlog) {
  const blogIndex = staticEntries.find((e) => e.path === "/blog");
  if (blogIndex) blogIndex.lastmod = latestBlog;
}

const entries: SitemapEntry[] = [...staticEntries, ...blogEntries];

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
