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
  ["/", "用车成本计算器｜油车与电车真实成本对比", "免费用车成本计算器，按油费或电费、保险、车贷、保养、停车与折旧，比较油车和电车的年度及多年总成本。", "weekly", "1.0"],
  ["/calculator/", "用车成本计算器｜计算每月与年度养车费用", "输入里程、油价或电价、车价、保险、车贷与停车等参数，快速计算真实用车成本。", "weekly", "0.9"],
  ["/compare/", "油车与电车成本对比｜1至10年总费用", "对比油车和电车的能源、保险、保养、折旧与多年累计成本，辅助购车决策。", "weekly", "0.9"],
  ["/blog/", "用车成本知识｜油车、电车与养车省钱指南", "阅读油电成本对比、车险选择、养车隐形支出与实用省钱指南。", "weekly", "0.8"],
  ["/blog/1/", "电车真的比油车省钱吗？5年成本对比｜用车成本计算器", "通过可调整示例比较油车和电车的能源、保险、保养与折旧成本。", "monthly", "0.8"],
  ["/blog/2/", "用车成本全解析：油费电费之外的隐形支出", "全面拆解保险、保养、停车、洗车、通行与车辆折旧等真实用车成本。", "monthly", "0.8"],
  ["/blog/3/", "如何降低用车成本？10个实用省钱技巧", "从保险、能耗、保养、停车和驾驶习惯等方面降低养车支出。", "monthly", "0.8"],
  ["/blog/4/", "车险怎么买更合适？险种选择与费用指南", "了解交强险、车损险、第三者责任险等险种的用途和预算方法。", "monthly", "0.8"],
  ["/faq/", "常见问题｜用车成本计算方法说明", "了解油电成本、保险折扣、车辆折旧、多年预测及计算器使用方法。", "monthly", "0.7"],
  ["/methodology/", "用车成本怎么算｜公式、假设与数据说明", "公开能耗、保险、贷款、折旧和多年用车成本的计算公式、默认假设与适用限制。", "monthly", "0.8"],
  ["/tools/", "免费用车计算工具｜油费、充电费、车贷与折旧", "免费计算油费、充电费、车贷月供、汽车折旧、每公里成本与油电回本里程；无需注册，数据仅在浏览器本地处理。", "weekly", "0.9"],
  ["/tools/cost-per-km/", "每公里用车成本计算器｜含折旧真实成本", "输入年度油费或电费、保险、保养、停车和折旧，计算每公里现金成本与完整用车成本。", "monthly", "0.9"],
  ["/tools/ev-break-even/", "油车电车回本里程计算器｜购车差价多久省回来", "根据油价、电价、能耗、年里程和购车差价，计算电车能源节省的预计回本年数与里程。", "monthly", "0.9"],
  ["/tools/fuel-cost/", "油费计算器｜算百公里油费、每公里油费和用油量", "输入行驶里程、百公里油耗和每升油价，立即计算预计用油量、总油费、每公里油费与百公里油费。", "monthly", "0.9"],
  ["/tools/depreciation/", "汽车折旧计算器｜车辆保值率与每公里折旧", "根据购车价、当前估值、持有年数和里程，计算汽车累计折旧、年均折旧、保值率与每公里折旧。", "monthly", "0.9"],
  ["/tools/charging-cost/", "新能源汽车充电费用计算器｜每公里与百公里电费", "输入里程、百公里电耗、综合充电电价和充电损耗，计算电网取电量、总充电费、每公里和百公里电费。", "monthly", "0.9"],
  ["/tools/car-loan/", "车贷月供计算器｜首付、利息与还款总额", "按车价、首付比例、贷款期限、年利率和还款方式，计算车贷月供、贷款金额、总利息和现金支出。", "monthly", "0.9"],
  ["/about/", "关于本站｜用车成本计算器", "了解用车成本计算器的目标、计算范围、数据处理方式和内容原则。", "yearly", "0.5"],
  ["/privacy/", "隐私政策｜用车成本计算器", "了解本站如何处理本地计算数据、Cookie、分析与广告相关信息。", "yearly", "0.4"],
  ["/disclaimer/", "免责声明｜用车成本计算器", "用车成本估算的适用范围、限制条件与用户决策责任说明。", "yearly", "0.4"],
  ["/contact/", "联系我们｜用车成本计算器", "就计算方法、内容纠错、隐私或合作问题联系本站。", "yearly", "0.4"],
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
    ...(schemaType === "WebApplication" ? { applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" } } : {}),
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
const notFound = renderPage("/404.html", "页面未找到｜用车成本计算器", "请求的页面不存在，请返回首页或浏览免费用车计算工具。")
  .replace('content="index, follow, max-image-preview:large"', 'content="noindex, nofollow"')
  .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, "");
await writeFile(new URL("404.html", distDir), notFound, "utf8");
await rm(prerenderDir, { recursive: true, force: true });
