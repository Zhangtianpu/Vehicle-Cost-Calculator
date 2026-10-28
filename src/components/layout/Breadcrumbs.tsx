import { Link, useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/useLanguageStore";

const SITE_URL = "https://sidehustle.top";

const toolNames: Record<string, { en: string; zh: string }> = {
  "/tools/cost-per-km": { en: "Cost per Mile Calculator", zh: "每公里用车成本计算器" },
  "/tools/ev-break-even": { en: "EV Break-even Calculator", zh: "油车电车回本计算器" },
  "/tools/fuel-cost": { en: "Fuel Cost Calculator", zh: "油费计算器" },
  "/tools/depreciation": { en: "Car Depreciation Calculator", zh: "汽车折旧计算器" },
  "/tools/charging-cost": { en: "EV Charging Cost Calculator", zh: "电动车充电费用计算器" },
  "/tools/car-loan": { en: "Car Loan Calculator", zh: "车贷月供计算器" },
  "/tools/monthly-car-cost": { en: "Monthly Car Cost Calculator", zh: "每月养车成本计算器" },
  "/tools/car-affordability": { en: "Car Affordability Calculator", zh: "汽车购买力计算器" },
  "/tools/lease-vs-buy": { en: "Lease vs Buy Calculator", zh: "汽车租赁还是购买计算器" },
};

const articleNames = [
  { en: "Are EVs Cheaper Than Gas Cars?", zh: "电车真的比油车省钱吗？" },
  { en: "The True Cost of Car Ownership", zh: "用车成本全解析" },
  { en: "10 Ways to Lower Car Ownership Costs", zh: "降低用车成本的10个方法" },
  { en: "How to Choose Car Insurance Coverage", zh: "车险怎么买更合适？" },
];

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
  const articleMatch = normalizedPath.match(/^\/blog\/(\d+)$/);
  const article = articleMatch ? articleNames[Number(articleMatch[1]) - 1] : undefined;
  const tool = toolNames[normalizedPath];

  const trail = tool
    ? [
        { path: "/", name: isZh ? "首页" : "Home" },
        { path: "/tools", name: isZh ? "用车工具" : "Car Cost Tools" },
        { path: normalizedPath, name: isZh ? tool.zh : tool.en },
      ]
    : article
      ? [
          { path: "/", name: isZh ? "首页" : "Home" },
          { path: "/blog", name: isZh ? "用车指南" : "Vehicle Cost Guides" },
          { path: normalizedPath, name: isZh ? article.zh : article.en },
        ]
      : null;

  if (!trail) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : `${item.path}/`}`,
    })),
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
      <nav aria-label={isZh ? "面包屑导航" : "Breadcrumb"} className="text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
              {index < trail.length - 1 ? (
                <Link to={item.path} className="hover:text-emerald-700 hover:underline">{item.name}</Link>
              ) : (
                <span aria-current="page" className="font-medium text-slate-700">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
