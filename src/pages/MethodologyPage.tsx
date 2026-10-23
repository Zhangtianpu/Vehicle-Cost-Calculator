import { Link } from "react-router-dom";
import { Calculator, Database, ShieldCheck } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const cardClass = "rounded-xl border border-slate-200 bg-white p-5";
const headingClass = "text-lg font-semibold text-slate-800 mb-2";
const formulaClass = "my-3 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-sm text-emerald-300";

export default function MethodologyPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {isZh ? "用车成本计算方法" : "Vehicle Cost Methodology"}
          </h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {isZh
            ? "本页公开计算器使用的公式、默认假设和限制。目标不是给出统一答案，而是让您用自己的实际报价得到可复核的预算。"
            : "This page documents the calculator's formulas, default assumptions and limitations. The goal is not a universal answer, but a reproducible budget based on your own quotes."}
        </p>
        <p className="mt-2 text-xs text-slate-400">{isZh ? "最后复核：2026年10月23日" : "Last reviewed: October 23, 2026"}</p>
      </header>

      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <section className={cardClass}>
          <h2 className={headingClass}>{isZh ? "1. 油费与电费" : "1. Fuel and charging"}</h2>
          <p>{isZh ? "系统先将日、月或年里程统一换算为月里程，再按百公里能耗计算。" : "Daily, monthly or annual mileage is first normalized to monthly mileage, then multiplied by consumption per 100 km."}</p>
          <div className={formulaClass}>{isZh ? "月能源费 = 月里程 ÷ 100 × 百公里能耗 × 单价" : "Monthly energy cost = monthly km ÷ 100 × consumption/100 km × unit price"}</div>
          <p>{isZh ? "年能源费等于月能源费乘以 12。油价、电价和能耗都由用户修改，默认值只用于演示。" : "Annual energy cost is monthly cost × 12. Energy prices and consumption are user-editable; defaults are illustrative."}</p>
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>{isZh ? "2. 保险估算" : "2. Insurance estimate"}</h2>
          <p>{isZh ? "估算由交强险、车损险、第三者责任险、车上人员责任险和可选新能源附加项组成，再应用车型调整和无出险系数。" : "The estimate combines compulsory, vehicle damage, third-party and passenger coverage plus an optional EV item, then applies vehicle and no-claim factors."}</p>
          <div className={formulaClass}>{isZh ? "年保费 ≈ 各险种估算合计 × 车型系数 × 无出险系数" : "Annual premium ≈ coverage estimate × vehicle factor × no-claim factor"}</div>
          <p>{isZh ? "保险价格高度依赖地区、车型、驾驶记录和保险公司。建议启用“自定义年度费用”并填写真实报价；系统默认值不应替代保险公司报价。" : "Insurance varies substantially by location, vehicle, driving history and provider. For decisions, enter a real quote using the custom annual cost option."}</p>
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>{isZh ? "3. 车贷" : "3. Vehicle financing"}</h2>
          <p>{isZh ? "贷款本金等于车价减去首付。等额本息使用标准年金公式；等额本金按每月固定本金和递减利息逐月求和。" : "Principal equals vehicle price minus down payment. Equal installment uses the standard annuity formula; equal principal sums fixed principal and declining interest month by month."}</p>
          <div className={formulaClass}>{isZh ? "等额本息月供 = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ−1)" : "Equal payment = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ−1)"}</div>
          <p>{isZh ? "P 为贷款本金，r 为月利率，n 为总期数。多年对比只在贷款存续月份计入还款；首付单独显示，不重复计入年度运营费用。" : "P is principal, r the monthly rate and n the number of payments. Multi-year totals include payments only while the loan is active; the down payment is shown separately."}</p>
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>{isZh ? "4. 折旧与残值" : "4. Depreciation and residual value"}</h2>
          <p>{isZh ? "折旧按上一年剩余价值计算，并使用逐年变化系数模拟前期较快、后期趋缓的折旧曲线。" : "Depreciation is calculated from the prior year's residual value with annual multipliers that model faster early depreciation and slower later decline."}</p>
          <div className={formulaClass}>{isZh ? "当年折旧 = 年初剩余价值 × 用户折旧率 × 年度系数" : "Annual depreciation = opening residual value × user rate × year multiplier"}</div>
          <p>{isZh ? "二手车残值受品牌、车况、电池健康度和市场供需影响，默认折旧率仅为预算起点。" : "Resale value depends on brand, condition, battery health and market demand; the default rate is only a budgeting starting point."}</p>
        </section>

        <section className={cardClass}>
          <h2 className={headingClass}>{isZh ? "5. 其他费用与多年总成本" : "5. Other costs and multi-year totals"}</h2>
          <p>{isZh ? "保养、洗车、停车、违章与通行费均使用用户填写的年度或月度金额。每年总成本是当年所有已启用模块之和，累计成本是各年总成本逐年相加。当前模型不预测通胀、能源价格波动、维修突发支出或机会成本。" : "Maintenance, washing, parking, fines and tolls use user-entered monthly or annual amounts. Annual total is the sum of enabled modules; cumulative cost sums each year. The model does not forecast inflation, price shocks, unexpected repairs or opportunity cost."}</p>
        </section>

        <section className={`${cardClass} border-emerald-200 bg-emerald-50`}>
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-800">{isZh ? "数据与隐私" : "Data and privacy"}</h2>
          </div>
          <p>{isZh ? "计算在浏览器本地完成。车辆参数保存在您的 LocalStorage 中，不会发送到本站服务器。Google Analytics 仅在您同意非必要 Cookie 后获得相应存储权限。" : "Calculations run locally in your browser. Vehicle inputs are stored in LocalStorage and are not sent to this site's server. Google Analytics receives storage permission only after consent for non-essential cookies."}</p>
        </section>

        <section className={`${cardClass} border-blue-200 bg-blue-50`}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">{isZh ? "如何得到更可靠的结果" : "How to improve accuracy"}</h2>
          </div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>{isZh ? "使用最近三个月的真实里程和能源账单。" : "Use actual mileage and energy bills from the last three months."}</li>
            <li>{isZh ? "填入保险公司和贷款机构的书面报价。" : "Enter written quotes from insurers and lenders."}</li>
            <li>{isZh ? "分别尝试保守、中性和乐观的折旧率。" : "Test conservative, neutral and optimistic depreciation rates."}</li>
            <li>{isZh ? "把无法确定的项目保留为独立预算缓冲。" : "Keep uncertain items as a separate contingency budget."}</li>
          </ol>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/calculator" className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600">
          {isZh ? "使用计算器" : "Use the calculator"}
        </Link>
        <Link to="/contact" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {isZh ? "报告问题或建议" : "Report an issue"}
        </Link>
      </div>
    </div>
  );
}
