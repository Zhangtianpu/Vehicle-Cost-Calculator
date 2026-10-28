import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { enSeoRoutes } from "../src/data/seoRoutes.js";
import { createRouteSchema, SITE_URL } from "../src/data/routeSchema.js";

const routePaths = enSeoRoutes.map(({ path }) => path);
const knownPaths = new Set(routePaths.map((path) => path === "/" ? path : path.replace(/\/$/, "")));
const toolPaths = routePaths.filter((path) => path.startsWith("/tools/") && path !== "/tools/");
const articlePaths = routePaths.filter((path) => /^\/blog\/\d+\/$/.test(path));

assert.equal(enSeoRoutes.length, 25, "Expected 25 indexable routes");
assert.equal(new Set(routePaths).size, enSeoRoutes.length, "SEO routes must be unique");

const brokenLinks = [];

for (const route of enSeoRoutes) {
  const file = route.path === "/" ? "dist/index.html" : `dist${route.path}index.html`;
  const html = await readFile(file, "utf8");
  const canonical = `${SITE_URL}${route.path}`;
  const expectedTags = [
    `<title>${route.title}</title>`,
    `<meta name="description" content="${route.description}"`,
    `<meta name="robots" content="index, follow, max-image-preview:large"`,
    `<link rel="canonical" href="${canonical}"`,
    `<meta property="og:title" content="${route.title}"`,
    `<meta property="og:description" content="${route.description}"`,
    `<meta property="og:url" content="${canonical}"`,
    `<meta name="twitter:title" content="${route.title}"`,
    `<meta name="twitter:description" content="${route.description}"`,
  ];

  for (const tag of expectedTags) {
    assert.ok(html.includes(tag), `${route.path} is missing expected metadata: ${tag}`);
  }

  const schemaMatch = html.match(/<script id="route-schema" type="application\/ld\+json">(.*?)<\/script>/);
  assert.ok(schemaMatch, `${route.path} is missing route JSON-LD`);
  const actualSchema = JSON.parse(schemaMatch[1]);
  const expectedSchema = createRouteSchema({
    path: route.path,
    title: route.title,
    description: route.description,
    collectionPaths: route.path === "/tools/" ? toolPaths : route.path === "/blog/" ? articlePaths : [],
  });
  assert.deepEqual(actualSchema, expectedSchema, `${route.path} JSON-LD does not match the shared route schema`);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/assets/") || href === "/favicon.svg") continue;
    const linkedPath = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!knownPaths.has(linkedPath)) brokenLinks.push(`${route.path} -> ${href}`);
  }
}

assert.deepEqual([...new Set(brokenLinks)], [], "Generated pages contain broken internal links");

const sitemap = await readFile("dist/sitemap.xml", "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapDates = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
assert.deepEqual(sitemapUrls, routePaths.map((path) => `${SITE_URL}${path}`), "Sitemap URLs must match the shared SEO routes");
assert.equal(sitemapDates.length, enSeoRoutes.length, "Every sitemap URL must have a lastmod date");
assert.ok(sitemapDates.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)), "Sitemap lastmod values must use YYYY-MM-DD");

const robots = await readFile("dist/robots.txt", "utf8");
assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), "robots.txt must reference the canonical sitemap");

const notFound = await readFile("dist/404.html", "utf8");
assert.ok(notFound.includes('content="noindex, nofollow"'), "404 page must be noindex");
assert.ok(!notFound.includes('rel="canonical"'), "404 page must not declare a canonical URL");

console.log(`SEO output verification passed for ${enSeoRoutes.length} routes.`);
