import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enSeoRoutes } from "@/data/seoRoutes.js";

const SITE_URL = "https://sidehustle.top";

type SeoEntry = { title: string; description: string; type?: "article" | "website" };

const zhPages: Record<string, SeoEntry> = {
  "/": { title: "用车成本计算器｜油车与电车真实成本对比", description: "免费用车成本计算器，按油费或电费、保险、车贷、保养、停车与折旧，比较油车和电车的年度及多年总成本。" },
  "/calculator": { title: "用车成本计算器｜美制 MPG 与公制单位", description: "支持英里、MPG、每加仑油价与公制单位，结合保险、车贷、保养、停车和折旧计算月度与年度用车成本。" },
  "/compare": { title: "油车与电车成本对比｜1至10年总费用", description: "对比油车和电车的能源、保险、保养、折旧与多年累计成本，辅助购车决策。" },
  "/blog": { title: "用车成本知识｜油车、电车与养车省钱指南", description: "阅读油电成本对比、车险选择、养车隐形支出与实用省钱指南。" },
  "/faq": { title: "常见问题｜用车成本计算方法说明", description: "了解油电成本、保险折扣、车辆折旧、多年预测及计算器使用方法。" },
  "/methodology": { title: "用车成本怎么算｜公式、假设与数据说明", description: "公开用车成本计算器的能耗、保险、贷款、折旧和多年成本公式、默认假设及适用限制。" },
  "/editorial-policy": { title: "编辑与内容政策｜用车成本计算器", description: "了解本站由谁维护、计算器和文章如何制作，以及来源、纠错、AI 辅助和商业独立性政策。" },
  "/tools": { title: "免费用车计算工具｜油费、充电费、车贷与折旧", description: "免费计算油费、充电费、车贷月供、汽车折旧、每公里成本与油电回本里程；无需注册，数据仅在浏览器本地处理。" },
  "/tools/cost-per-km": { title: "每公里用车成本计算器｜含折旧真实成本", description: "输入年度油费或电费、保险、保养、停车和折旧，计算每公里现金成本与完整用车成本。" },
  "/tools/ev-break-even": { title: "油车电车回本里程计算器｜购车差价多久省回来", description: "根据油价、电价、能耗、年里程和购车差价，计算电车能源节省的预计回本年数与里程。" },
  "/tools/fuel-cost": { title: "油费计算器｜算百公里油费、每公里油费和用油量", description: "输入行驶里程、百公里油耗和每升油价，立即计算预计用油量、总油费、每公里油费与百公里油费。" },
  "/tools/depreciation": { title: "汽车折旧计算器｜车辆保值率与每公里折旧", description: "根据购车价、当前估值、持有年数和里程，计算汽车累计折旧、年均折旧、保值率与每公里折旧。" },
  "/tools/charging-cost": { title: "新能源汽车充电费用计算器｜每公里与百公里电费", description: "输入里程、百公里电耗、综合充电电价和充电损耗，计算电网取电量、总充电费、每公里和百公里电费。" },
  "/tools/car-loan": { title: "车贷月供计算器｜首付、利息与还款总额", description: "按车价、首付比例、贷款期限、年利率和还款方式，计算车贷月供、贷款金额、总利息和现金支出。" },
  "/tools/monthly-car-cost": { title: "每月养车成本计算器｜现金预算与真实持有成本", description: "按里程、能源、保险、月供与利息、保养、停车、登记和折旧，分别计算每月现金预算与不重复计价的持有成本。" },
  "/tools/car-affordability": { title: "汽车购买力计算器｜按收入计算能买多少钱的车", description: "根据税后收入、完整养车预算、首付、置换、贷款利率、税费和期限，反算可承受的最高车价与月供。" },
  "/tools/lease-vs-buy": { title: "汽车租赁还是购买计算器｜比较真实净成本", description: "在相同周期内比较租赁总支出与购买净成本，计入月租、首付、税费、贷款余额、期末车辆价值和返还费用。" },
  "/about": { title: "关于本站｜用车成本计算器", description: "了解用车成本计算器的目标、计算范围、数据处理方式和内容原则。" },
  "/privacy": { title: "隐私政策｜用车成本计算器", description: "了解本站如何处理本地计算数据、Cookie、Google Analytics 与广告相关信息。" },
  "/disclaimer": { title: "免责声明｜用车成本计算器", description: "用车成本估算的适用范围、限制条件与用户决策责任说明。" },
  "/contact": { title: "联系我们｜用车成本计算器", description: "就计算方法、内容纠错、隐私或合作问题联系用车成本计算器。" },
};

const enPages: Record<string, SeoEntry> = Object.fromEntries(enSeoRoutes.map(({ path, title, description }) => [path === "/" ? path : path.replace(/\/$/, ""), { title, description }]));

const articleSeo = [
  { zh: "电车真的比油车省钱吗？5年成本对比" },
  { zh: "用车成本全解析：油费电费之外的隐形支出" },
  { zh: "如何降低用车成本？10个实用省钱技巧" },
  { zh: "车险怎么买更合适？险种选择与费用指南" },
];

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const { locale } = useLanguageStore();

  useEffect(() => {
    const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
    const articleMatch = normalizedPath.match(/^\/blog\/(\d+)$/);
    const article = articleMatch ? articleSeo[Number(articleMatch[1]) - 1] : undefined;
    const pages = locale === "zh" ? zhPages : enPages;
    const pageSeo = pages[normalizedPath];
    const isKnownPage = Boolean(article || pageSeo);
    const seo = article
      ? locale === "zh"
        ? {
            title: `${article.zh} | 用车成本计算器`,
            description: "基于可调整示例，拆解能源、保险、保养、折旧等成本；结果仅供预算参考，请以当地实际报价为准。",
            type: "article" as const,
          }
        : { ...pageSeo!, type: "article" as const }
      : pageSeo || {
          title: locale === "zh" ? "页面未找到｜用车成本计算器" : "Page Not Found | Vehicle Cost Calculator",
          description: locale === "zh" ? "请求的页面不存在，请返回首页或浏览免费用车计算工具。" : "The requested page does not exist. Return home or browse the free vehicle cost tools.",
        };
    const canonical = `${SITE_URL}${normalizedPath === "/" ? "/" : `${normalizedPath}/`}`;
    const toolPaths = Object.keys(pages).filter((path) => path.startsWith("/tools/"));
    const articlePaths = articleSeo.map((_, index) => `/blog/${index + 1}`);

    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: seo.type || "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: isKnownPage ? "index, follow, max-image-preview:large" : "noindex, nofollow" });

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (isKnownPage) {
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    } else {
      canonicalLink?.remove();
    }

    const schema = article
      ? { "@context": "https://schema.org", "@type": "Article", name: locale === "zh" ? article.zh : seo.title, headline: locale === "zh" ? article.zh : seo.title, description: seo.description, image: `${SITE_URL}/vehicle-cost-social-card.png`, url: canonical, isAccessibleForFree: true, datePublished: "2026-06-23T15:29:03+08:00", dateModified: "2026-10-28T18:02:36+08:00", author: { "@type": "Person", name: "Zhangtianpu", url: "https://github.com/Zhangtianpu" }, publisher: { "@type": "Organization", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` }, mainEntityOfPage: canonical }
      : normalizedPath === "/" || normalizedPath === "/calculator" || normalizedPath === "/compare" || normalizedPath.startsWith("/tools/")
        ? { "@context": "https://schema.org", "@type": "WebApplication", name: seo.title.split("｜")[0].split("|")[0].trim(), description: seo.description, url: canonical, isAccessibleForFree: true, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: 0 } }
        : normalizedPath === "/tools"
          ? { "@context": "https://schema.org", "@type": "CollectionPage", name: seo.title, description: seo.description, url: canonical, isPartOf: { "@type": "WebSite", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` }, mainEntity: { "@type": "ItemList", numberOfItems: toolPaths.length, itemListElement: toolPaths.map((path, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}${path}/` })) } }
          : normalizedPath === "/blog"
            ? { "@context": "https://schema.org", "@type": "CollectionPage", name: seo.title, description: seo.description, url: canonical, isPartOf: { "@type": "WebSite", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` }, mainEntity: { "@type": "ItemList", numberOfItems: articlePaths.length, itemListElement: articlePaths.map((path, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}${path}/` })) } }
            : isKnownPage
              ? { "@context": "https://schema.org", "@type": normalizedPath === "/about" ? "AboutPage" : normalizedPath === "/contact" ? "ContactPage" : "WebPage", name: seo.title, description: seo.description, url: canonical, isPartOf: { "@type": "WebSite", name: "Vehicle Cost Calculator", url: `${SITE_URL}/` } }
              : null;
    document.getElementById("route-schema")?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.id = "route-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [locale, pathname]);

  return null;
}
