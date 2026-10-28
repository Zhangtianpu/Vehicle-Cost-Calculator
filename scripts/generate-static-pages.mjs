import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { enSeoRoutes } from "../src/data/seoRoutes.js";

const siteUrl = "https://sidehustle.top";
const distDir = new URL("../dist/", import.meta.url);
const prerenderDir = new URL("../.prerender/", import.meta.url);
const { render } = await import(new URL("entry-server.js", prerenderDir).href);
const rawTemplate = await readFile(new URL("index.html", distDir), "utf8");
const adsenseClient = process.env.VITE_ADSENSE_CLIENT || "";
const publisherId = adsenseClient.replace(/^ca-/, "");
const hasAdsense = /^ca-pub-\d+$/.test(adsenseClient);
const adsenseHead = hasAdsense
  ? `    <meta name="google-adsense-account" content="${adsenseClient}" />\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}" crossorigin="anonymous"></script>\n`
  : "";
const template = rawTemplate.replace("  </head>", `${adsenseHead}  </head>`);

const routes = enSeoRoutes.map(({ path, title, description, changefreq, priority }) => [path, title, description, changefreq, priority]);

// Keep sitemap dates tied to meaningful content changes rather than deployment time.
// Google only uses lastmod when it is consistently accurate and verifiable.
const initialContentLastModified = "2026-10-23";
const routeLastModifiedOverrides = new Map([
  ["/", "2026-10-29"],
  ["/calculator/", "2026-10-29"],
  ["/compare/", "2026-10-29"],
  ["/blog/", "2026-10-29"],
  ["/blog/1/", "2026-10-28"],
  ["/blog/2/", "2026-10-28"],
  ["/blog/3/", "2026-10-28"],
  ["/blog/4/", "2026-10-28"],
  ["/tools/", "2026-10-29"],
  ["/tools/cost-per-km/", "2026-10-29"],
  ["/tools/ev-break-even/", "2026-10-29"],
  ["/tools/fuel-cost/", "2026-10-29"],
  ["/tools/depreciation/", "2026-10-29"],
  ["/tools/charging-cost/", "2026-10-29"],
  ["/tools/car-loan/", "2026-10-29"],
  ["/tools/monthly-car-cost/", "2026-10-29"],
  ["/tools/car-affordability/", "2026-10-29"],
  ["/tools/lease-vs-buy/", "2026-10-29"],
]);

const toolListItems = routes
  .filter(([path]) => path.startsWith("/tools/") && path !== "/tools/")
  .map(([path], index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}${path}`,
  }));
const articleListItems = routes
  .filter(([path]) => /^\/blog\/\d+\/$/.test(path))
  .map(([path], index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}${path}`,
  }));

function renderPage(path, title, description) {
  const canonical = `${siteUrl}${path}`;
  const pathname = path === "/" ? path : path.replace(/\/$/, "");
  const appHtml = render(pathname);
  const collectionItems = path === "/tools/" ? toolListItems : articleListItems;
  const isWebApplication = path === "/" || path === "/calculator/" || path === "/compare/" || (path.startsWith("/tools/") && path !== "/tools/");
  const schemaType = /^\/blog\/\d+\/$/.test(path)
    ? "Article"
    : path === "/tools/" || path === "/blog/"
      ? "CollectionPage"
      : isWebApplication
        ? "WebApplication"
        : "WebPage";
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    headline: schemaType === "Article" ? title : undefined,
    url: canonical,
    isAccessibleForFree: true,
    ...(schemaType === "Article" ? { image: `${siteUrl}/vehicle-cost-social-card.png`, datePublished: "2026-06-23T15:29:03+08:00", dateModified: "2026-10-28T18:02:36+08:00", author: { "@type": "Person", name: "Zhangtianpu", url: "https://github.com/Zhangtianpu" }, publisher: { "@type": "Organization", name: "Vehicle Cost Calculator", url: `${siteUrl}/` }, mainEntityOfPage: canonical } : {}),
    ...(schemaType === "WebApplication" ? { applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: 0 } } : {}),
    ...(schemaType === "CollectionPage" ? { isPartOf: { "@type": "WebSite", name: "Vehicle Cost Calculator", url: `${siteUrl}/` }, mainEntity: { "@type": "ItemList", numberOfItems: collectionItems.length, itemListElement: collectionItems } } : {}),
  };
  const schemaScript = `<script id="route-schema" type="application/ld+json">${JSON.stringify(schema)}</script>`;
  return template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type" content=".*?"\s*\/>/, `<meta property="og:type" content="${schemaType === "Article" ? "article" : "website"}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace("  </head>", `    ${schemaScript}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

for (const [path, title, description] of routes) {
  const destination = join(new URL(distDir).pathname, path, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, renderPage(path, title, description), "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([path, , , changefreq, priority]) => {
  const lastmod = routeLastModifiedOverrides.get(path) || initialContentLastModified;
  return `  <url><loc>${siteUrl}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}).join("\n")}
</urlset>
`;
await writeFile(new URL("sitemap.xml", distDir), sitemap, "utf8");
await writeFile(new URL("robots.txt", distDir), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, "utf8");
await writeFile(
  new URL("ads.txt", distDir),
  hasAdsense
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Add VITE_ADSENSE_CLIENT during deployment to generate the authorized seller record.\n",
  "utf8",
);

// Keep GitHub Pages from applying Jekyll processing and provide a real noindex 404 fallback.
await writeFile(new URL(".nojekyll", distDir), "", "utf8");
const notFound = renderPage("/404.html", "Page Not Found | Vehicle Cost Calculator", "The page you requested does not exist. Return home or explore our free vehicle cost tools.")
  .replace('content="index, follow, max-image-preview:large"', 'content="noindex, nofollow"')
  .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, "");
await writeFile(new URL("404.html", distDir), notFound, "utf8");
await rm(prerenderDir, { recursive: true, force: true });
