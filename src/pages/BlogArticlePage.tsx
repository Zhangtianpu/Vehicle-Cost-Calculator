import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useLanguageStore();

  const articles = [
    {
      id: 1,
      title: t.blog.article1Title,
      summary: t.blog.article1Summary,
      content: t.blog.article1Content,
      date: "2026-10-23",
      readTime: "8 min",
      category: t.blog.categoryEV,
    },
    {
      id: 2,
      title: t.blog.article2Title,
      summary: t.blog.article2Summary,
      content: t.blog.article2Content,
      date: "2026-10-23",
      readTime: "9 min",
      category: t.blog.categoryCost,
    },
    {
      id: 3,
      title: t.blog.article3Title,
      summary: t.blog.article3Summary,
      content: t.blog.article3Content,
      date: "2026-10-23",
      readTime: "8 min",
      category: t.blog.categoryTips,
    },
    {
      id: 4,
      title: t.blog.article4Title,
      summary: t.blog.article4Summary,
      content: t.blog.article4Content,
      date: "2026-10-23",
      readTime: "9 min",
      category: t.blog.categoryInsurance,
    },
  ];

  const article = articles.find((a) => a.id === Number(id));

  const sources: Record<number, { label: string; href: string }[]> = {
    1: [
      { label: "U.S. Department of Energy — Charging Electric Vehicles at Home", href: "https://afdc.energy.gov/fuels/electricity-charging-home" },
      { label: "FuelEconomy.gov — Compare Side-by-Side", href: "https://www.fueleconomy.gov/feg/Find.do?action=sbsSelect" },
    ],
    2: [
      { label: "Consumer Financial Protection Bureau — Auto Loans", href: "https://www.consumerfinance.gov/consumer-tools/auto-loans/" },
      { label: "National Highway Traffic Safety Administration — Tire Safety and Maintenance", href: "https://www.nhtsa.gov/vehicle-safety/tires" },
    ],
    3: [
      { label: "FuelEconomy.gov — Driving More Efficiently", href: "https://www.fueleconomy.gov/feg/driveHabits.jsp" },
      { label: "National Highway Traffic Safety Administration — Tire Safety and Maintenance", href: "https://www.nhtsa.gov/vehicle-safety/tires" },
    ],
    4: [
      { label: "National Association of Insurance Commissioners — Auto Insurance", href: "https://content.naic.org/consumer/auto-insurance.htm" },
      { label: "NAIC — State Insurance Departments", href: "https://content.naic.org/state-insurance-departments" },
    ],
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-500">{t.blog.notFound}</p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.backToList}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.blog.backToList}
      </Link>

      <article className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            {article.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-5 pb-5 border-b border-slate-100">
          <span>
            {locale === "zh" ? "作者：" : "By "}
            <Link to="/about" className="text-emerald-600 underline hover:text-emerald-700">
              {locale === "zh" ? "Zhangtianpu（本站维护者）" : "Zhangtianpu, site maintainer"}
            </Link>
          </span>
          <span>{locale === "zh" ? "更新于 2026年10月23日" : "Updated October 23, 2026"}</span>
        </div>

        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          {article.summary}
        </p>

        <div className="prose prose-slate max-w-none">
          <div className="text-slate-700 leading-relaxed space-y-6">
            {article.content.split("\n\n").map((block, index) => {
              const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
              if (lines.length === 1) return <p key={index}>{lines[0]}</p>;
              const [heading, ...body] = lines;
              return (
                <section key={index}>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">{heading}</h2>
                  <div className="space-y-2">
                    {body.map((line, lineIndex) => (
                      <p key={lineIndex} className={line.startsWith("-") ? "pl-4" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <aside className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong>{locale === "zh" ? "计算口径说明：" : "Methodology note: "}</strong>
          {locale === "zh"
            ? "文中金额为便于理解的示例，不代表实时市场报价。油价、电价、保险与残值会因地区、车型和时间变化，请将您的实际报价填入计算器再做判断。"
            : "Figures are illustrative rather than live market quotes. Energy prices, insurance and resale values vary by region, vehicle and date; use your own quotes in the calculator before deciding."}
        </aside>

        <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <h2 className="mb-2 font-semibold text-slate-800">
            {locale === "zh" ? "参考来源与编辑说明" : "Sources & editorial note"}
          </h2>
          <p className="mb-3 leading-relaxed">
            {locale === "zh"
              ? "以下权威资料用于核对概念和读者下一步操作。本文不使用自动采集的实时价格；示例由维护者按公开公式复核。"
              : "These primary or regulatory resources support the concepts and next steps in this guide. The article does not scrape live prices; examples are reviewed against the published formulas."}
          </p>
          <ul className="space-y-2">
            {(sources[article.id] || []).map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 text-emerald-700 underline hover:text-emerald-800">
                  <span>{source.label}</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <Link to="/editorial-policy" className="text-emerald-700 underline hover:text-emerald-800">
              {locale === "zh" ? "查看本站编辑与纠错政策" : "Read our editorial and corrections policy"}
            </Link>
          </p>
        </section>

        <div className="mt-6">
          <Link
            to={article.id === 2 ? "/tools/monthly-car-cost" : "/calculator"}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            {article.id === 2
              ? locale === "zh" ? "计算我的每月养车成本" : "Calculate my monthly car cost"
              : locale === "zh" ? "用我的实际数据计算" : "Calculate with my own data"}
          </Link>
        </div>
      </article>

      <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{t.blog.aboutTitle}</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t.blog.aboutContent}
        </p>
      </div>
    </div>
  );
}
