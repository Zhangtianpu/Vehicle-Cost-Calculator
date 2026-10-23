import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/useLanguageStore";

const SITE_URL = "https://sidehustle.top";

type SeoEntry = { title: string; description: string; type?: "article" | "website" };

const zhPages: Record<string, SeoEntry> = {
  "/": { title: "用车成本计算器｜油车与电车真实成本对比", description: "免费用车成本计算器，按油费或电费、保险、车贷、保养、停车与折旧，比较油车和电车的年度及多年总成本。" },
  "/calculator": { title: "用车成本计算器｜计算每月与年度养车费用", description: "输入里程、油价或电价、车价、保险、车贷与停车等参数，快速计算真实用车成本。" },
  "/compare": { title: "油车与电车成本对比｜1至10年总费用", description: "对比油车和电车的能源、保险、保养、折旧与多年累计成本，辅助购车决策。" },
  "/blog": { title: "用车成本知识｜油车、电车与养车省钱指南", description: "阅读油电成本对比、车险选择、养车隐形支出与实用省钱指南。" },
  "/faq": { title: "常见问题｜用车成本计算方法说明", description: "了解油电成本、保险折扣、车辆折旧、多年预测及计算器使用方法。" },
  "/methodology": { title: "用车成本怎么算｜公式、假设与数据说明", description: "公开用车成本计算器的能耗、保险、贷款、折旧和多年成本公式、默认假设及适用限制。" },
  "/tools": { title: "免费用车计算工具｜油费、折旧与每公里成本", description: "免费计算油费、汽车折旧、每公里用车成本和油车电车回本里程；无需注册，数据仅在浏览器本地处理。" },
  "/tools/cost-per-km": { title: "每公里用车成本计算器｜含折旧真实成本", description: "输入年度油费或电费、保险、保养、停车和折旧，计算每公里现金成本与完整用车成本。" },
  "/tools/ev-break-even": { title: "油车电车回本里程计算器｜购车差价多久省回来", description: "根据油价、电价、能耗、年里程和购车差价，计算电车能源节省的预计回本年数与里程。" },
  "/tools/fuel-cost": { title: "油费计算器｜算百公里油费、每公里油费和用油量", description: "输入行驶里程、百公里油耗和每升油价，立即计算预计用油量、总油费、每公里油费与百公里油费。" },
  "/tools/depreciation": { title: "汽车折旧计算器｜车辆保值率与每公里折旧", description: "根据购车价、当前估值、持有年数和里程，计算汽车累计折旧、年均折旧、保值率与每公里折旧。" },
  "/about": { title: "关于本站｜用车成本计算器", description: "了解用车成本计算器的目标、计算范围、数据处理方式和内容原则。" },
  "/privacy": { title: "隐私政策｜用车成本计算器", description: "了解本站如何处理本地计算数据、Cookie、Google Analytics 与广告相关信息。" },
  "/disclaimer": { title: "免责声明｜用车成本计算器", description: "用车成本估算的适用范围、限制条件与用户决策责任说明。" },
  "/contact": { title: "联系我们｜用车成本计算器", description: "就计算方法、内容纠错、隐私或合作问题联系用车成本计算器。" },
};

const enPages: Record<string, SeoEntry> = {
  "/": { title: "Vehicle Cost Calculator | Fuel Car vs EV Cost", description: "Calculate fuel or charging, insurance, loan, maintenance, parking and depreciation costs, then compare multi-year ownership totals." },
  "/calculator": { title: "Vehicle Cost Calculator | Monthly & Annual Costs", description: "Estimate real vehicle ownership costs using your mileage, energy price, insurance, financing, parking and maintenance inputs." },
  "/compare": { title: "Fuel Car vs EV Cost Comparison | 1–10 Years", description: "Compare energy, insurance, maintenance, depreciation and total ownership cost for fuel cars and EVs over 1 to 10 years." },
  "/blog": { title: "Vehicle Ownership Cost Guides | Fuel Cars & EVs", description: "Practical guides to fuel and EV costs, insurance choices, hidden ownership expenses and saving strategies." },
  "/faq": { title: "Vehicle Cost Calculator FAQ", description: "Answers about energy cost, insurance, depreciation, multi-year forecasts and how the calculator works." },
  "/methodology": { title: "Vehicle Cost Methodology | Formulas & Assumptions", description: "Review the formulas, default assumptions and limitations used for energy, insurance, loans, depreciation and multi-year ownership costs." },
  "/tools": { title: "Free Vehicle Cost Tools | Fuel, Depreciation & Cost per Km", description: "Calculate fuel cost, car depreciation, cost per kilometer and fuel-vs-EV break-even. No registration; inputs stay in your browser." },
  "/tools/cost-per-km": { title: "Vehicle Cost per Kilometer Calculator | Include Depreciation", description: "Enter annual energy, insurance, maintenance, parking and depreciation to calculate cash and full ownership cost per kilometer." },
  "/tools/ev-break-even": { title: "Fuel vs EV Break-even Calculator | Distance & Years", description: "Use prices, consumption, annual mileage and purchase premium to estimate when EV energy savings break even." },
  "/tools/fuel-cost": { title: "Fuel Cost Calculator | Liters, Trip Cost & Cost per Km", description: "Enter distance, fuel consumption and price per liter to calculate liters required, trip fuel cost and cost per kilometer." },
  "/tools/depreciation": { title: "Car Depreciation Calculator | Retained Value & Cost per Km", description: "Use purchase price, current value, ownership years and mileage to calculate car depreciation and retained value." },
  "/about": { title: "About | Vehicle Cost Calculator", description: "Learn about our calculator, methodology, data handling and editorial purpose." },
  "/privacy": { title: "Privacy Policy | Vehicle Cost Calculator", description: "How this site handles local calculator data, cookies, analytics and advertising information." },
  "/disclaimer": { title: "Disclaimer | Vehicle Cost Calculator", description: "Scope and limitations of vehicle cost estimates and user decision responsibilities." },
  "/contact": { title: "Contact | Vehicle Cost Calculator", description: "Contact us about calculation methods, corrections, privacy or partnerships." },
};

const articleSeo = [
  { zh: "电车真的比油车省钱吗？5年成本对比", en: "Do EVs Really Save Money? 5-Year Cost Comparison" },
  { zh: "用车成本全解析：油费电费之外的隐形支出", en: "Complete Vehicle Cost Breakdown: Hidden Expenses" },
  { zh: "如何降低用车成本？10个实用省钱技巧", en: "How to Reduce Car Costs: 10 Practical Tips" },
  { zh: "车险怎么买更合适？险种选择与费用指南", en: "Vehicle Insurance Coverage and Cost Guide" },
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
      ? {
          title: `${locale === "zh" ? article.zh : article.en} | ${locale === "zh" ? "用车成本计算器" : "Vehicle Cost Calculator"}`,
          description: locale === "zh" ? "基于可调整示例，拆解能源、保险、保养、折旧等成本；结果仅供预算参考，请以当地实际报价为准。" : "A transparent example covering energy, insurance, maintenance and depreciation. Adjust inputs for your local prices and quotes.",
          type: "article" as const,
        }
      : pageSeo || {
          title: locale === "zh" ? "页面未找到｜用车成本计算器" : "Page Not Found | Vehicle Cost Calculator",
          description: locale === "zh" ? "请求的页面不存在，请返回首页或浏览免费用车计算工具。" : "The requested page does not exist. Return home or browse the free vehicle cost tools.",
        };
    const canonical = `${SITE_URL}${normalizedPath === "/" ? "/" : `${normalizedPath}/`}`;

    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: seo.type || "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
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
      ? { "@context": "https://schema.org", "@type": "Article", headline: locale === "zh" ? article.zh : article.en, dateModified: "2026-10-23", author: { "@type": "Organization", name: locale === "zh" ? "用车成本计算器编辑团队" : "Vehicle Cost Calculator Editorial Team" }, publisher: { "@type": "Organization", name: "Vehicle Cost Calculator" }, mainEntityOfPage: canonical }
      : normalizedPath === "/" || normalizedPath.startsWith("/tools/")
        ? { "@context": "https://schema.org", "@type": "WebApplication", name: seo.title.split("｜")[0].split("|")[0].trim(), url: canonical, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" } }
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
