import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

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

const routes = [
  ["/", "Vehicle Cost Calculator | Gas Car vs EV Ownership Cost", "Free vehicle cost calculator for fuel, charging, insurance, loans, maintenance, parking and depreciation. Compare gas cars and EVs over 1–10 years.", "weekly", "1.0"],
  ["/calculator/", "Vehicle Cost Calculator | Monthly & Annual Ownership Cost", "Estimate your monthly and annual vehicle costs, including energy, insurance, financing, maintenance, parking and depreciation.", "weekly", "0.9"],
  ["/compare/", "Gas Car vs EV Cost Comparison | 1–10 Year Total Cost", "Compare gas-car and electric-vehicle energy, insurance, maintenance, depreciation and cumulative ownership costs over 1–10 years.", "weekly", "0.9"],
  ["/blog/", "Vehicle Ownership Cost Guides | Gas Cars and EVs", "Practical guides to vehicle ownership costs, EV savings, insurance, depreciation and ways to spend less on driving.", "weekly", "0.8"],
  ["/blog/1/", "Are EVs Cheaper Than Gas Cars? Build a 5-Year Comparison", "Compare an EV and gas car with the same mileage, local energy prices, insurance quotes, maintenance, financing and resale scenarios.", "monthly", "0.8"],
  ["/blog/2/", "The True Cost of Car Ownership: Complete Budget Checklist", "Build a complete vehicle budget covering upfront, recurring, usage-based and resale costs without double-counting financing or depreciation.", "monthly", "0.8"],
  ["/blog/3/", "10 Practical Ways to Lower Car Ownership Costs", "Lower vehicle expenses with measurable changes to insurance, efficiency, maintenance, financing, subscriptions, parking and replacement timing.", "monthly", "0.8"],
  ["/blog/4/", "How to Choose Car Insurance Coverage Without Guessing", "Compare liability, collision, comprehensive, deductibles and optional protection using consistent local quotes and a practical checklist.", "monthly", "0.8"],
  ["/faq/", "Vehicle Cost Calculator FAQ | Methods and Assumptions", "Answers about fuel and charging costs, insurance, depreciation, multi-year forecasts and calculator use.", "monthly", "0.7"],
  ["/methodology/", "Vehicle Cost Methodology | Formulas, Assumptions and Limits", "Review the formulas, default assumptions and limitations behind our energy, insurance, loan, depreciation and total-cost estimates.", "monthly", "0.8"],
  ["/editorial-policy/", "Editorial & Content Policy | Vehicle Cost Calculator", "Learn who maintains this site and how its calculators, articles, sources, corrections, AI assistance and commercial independence are handled.", "yearly", "0.6"],
  ["/tools/", "Free Car Cost Calculators | US and Metric Units", "Calculate gas, EV charging, loans, depreciation, cost per mile or kilometer and EV break-even. Free, private and no sign-up required.", "weekly", "0.9"],
  ["/tools/cost-per-km/", "Vehicle Cost per Mile Calculator | Full Ownership Cost", "Enter annual energy, insurance, maintenance, parking and depreciation to calculate cash and full ownership cost per mile or kilometer.", "monthly", "0.9"],
  ["/tools/ev-break-even/", "EV Break-Even Calculator | Miles, MPG and Payback", "Use miles, MPG, charging consumption, local prices and purchase premium to estimate EV break-even distance and years; metric mode included.", "monthly", "0.9"],
  ["/tools/fuel-cost/", "Gas Cost Calculator | Miles, MPG and Trip Cost", "Calculate trip gas cost from miles, MPG and price per gallon, or use kilometers, L/100 km and price per liter.", "monthly", "0.9"],
  ["/tools/depreciation/", "Car Depreciation Calculator | Cost per Mile and Resale Value", "Use purchase price, current value, years and mileage to calculate depreciation per mile or kilometer and retained value.", "monthly", "0.9"],
  ["/tools/charging-cost/", "EV Charging Cost Calculator | Cost per Mile", "Use miles and kWh per 100 miles, electricity price and charging loss to calculate EV charging cost; metric mode included.", "monthly", "0.9"],
  ["/tools/car-loan/", "Car Loan Calculator | Monthly Payment and Total Interest", "Estimate a car loan payment, principal, total interest and total cash outlay from price, down payment, term and APR.", "monthly", "0.9"],
  ["/about/", "About | Vehicle Cost Calculator", "Learn about the Vehicle Cost Calculator's purpose, calculation scope, data handling and editorial principles.", "yearly", "0.5"],
  ["/privacy/", "Privacy Policy | Vehicle Cost Calculator", "Learn how this site handles local calculator inputs, cookies, analytics and advertising-related data.", "yearly", "0.4"],
  ["/disclaimer/", "Disclaimer | Vehicle Cost Calculator", "Review the scope and limitations of our estimates and your responsibility when making financial decisions.", "yearly", "0.4"],
  ["/contact/", "Contact | Vehicle Cost Calculator", "Contact us about calculation methods, corrections, privacy questions or partnerships.", "yearly", "0.4"],
];

function renderPage(path, title, description) {
  const canonical = `${siteUrl}${path}`;
  const pathname = path === "/" ? path : path.replace(/\/$/, "");
  const appHtml = render(pathname);
  const schemaType = /^\/blog\/\d+\/$/.test(path)
    ? "Article"
    : path === "/tools/"
      ? "CollectionPage"
      : path === "/" || path.startsWith("/tools/")
        ? "WebApplication"
        : "WebPage";
  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    headline: schemaType === "Article" ? title : undefined,
    url: canonical,
    isAccessibleForFree: true,
    ...(schemaType === "Article" ? { datePublished: "2024-01-15", dateModified: "2026-10-23", author: { "@type": "Person", name: "Zhangtianpu", url: "https://github.com/Zhangtianpu" }, publisher: { "@type": "Organization", name: "Vehicle Cost Calculator", url: `${siteUrl}/` }, mainEntityOfPage: canonical } : {}),
    ...(schemaType === "WebApplication" ? { applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } } : {}),
  };
  const schemaScript = `<script id="route-schema" type="application/ld+json">${JSON.stringify(schema)}</script>`;
  return template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace("  </head>", `    ${schemaScript}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

for (const [path, title, description] of routes) {
  const destination = join(new URL(distDir).pathname, path, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, renderPage(path, title, description), "utf8");
}

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([path, , , changefreq, priority]) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`).join("\n")}
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
