import { useLanguageStore } from "@/store/useLanguageStore";

export default function AboutPage() {
  const { locale } = useLanguageStore();

  if (locale === "en") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">About Us</h1>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Who We Are</h2>
          <p>
            Vehicle Cost Calculator is a free online tool designed to help car buyers and owners make informed financial decisions. We believe that understanding the true cost of vehicle ownership should be simple, transparent, and accessible to everyone.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">What We Do</h2>
          <p>
            Our calculator provides comprehensive vehicle operating cost analysis, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fuel/Energy Cost Calculator:</strong> Compare fuel costs for gasoline vehicles versus charging costs for electric vehicles, with support for daily, monthly, and yearly mileage input.</li>
            <li><strong>Insurance Cost Estimator:</strong> Estimate annual insurance premiums based on vehicle price, coverage options, and no-claim discount history.</li>
            <li><strong>Auto Loan Calculator:</strong> Calculate monthly payments, total interest, and repayment schedules with both equal installment and equal principal methods.</li>
            <li><strong>Fuel vs. EV Comparison:</strong> Side-by-side annual cost comparison with visual charts and detailed breakdowns.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Our Mission</h2>
          <p>
            We aim to reduce information asymmetry in vehicle purchasing decisions. By providing clear, accurate cost calculations, we help consumers understand the true financial implications of choosing between fuel vehicles and electric vehicles.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">How Our Tool Works</h2>
          <p>
            All calculations are performed entirely in your browser. No personal data is sent to our servers. Your input values are stored locally in your browser for convenience, and you can clear them at any time.
          </p>
          <p>
            Our calculation models are based on publicly available insurance rate structures, standard loan formulas, and user-configurable energy prices to provide the most relevant estimates for your situation.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Important Disclaimer</h2>
          <p>
            The calculations provided by this tool are for reference purposes only. Actual costs may vary based on your location, insurance provider, lender terms, driving habits, and other factors. Always consult with qualified professionals for financial decisions.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Contact Us</h2>
          <p>
            If you have questions, suggestions, or feedback, please reach out to us at:{" "}
            <a href="mailto:contact@vehiclecostcalc.com" className="text-emerald-600 underline">
              contact@vehiclecostcalc.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">关于我们</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">我们是谁</h2>
        <p>
          用车成本计算器是一款免费的在线工具，旨在帮助购车者和车主做出明智的财务决策。我们相信，了解车辆拥有的真实成本应该是简单、透明且人人可及的。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">我们做什么</h2>
        <p>我们的计算器提供全面的车辆运营成本分析，包括：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>油耗/电耗计算器：</strong>比较油车加油费用与电车充电费用，支持日/月/年行驶里程输入。</li>
          <li><strong>保险费用估算器：</strong>根据车价、险种组合和无出险折扣估算年度保险费用。</li>
          <li><strong>车贷计算器：</strong>计算月供、总利息和还款计划，支持等额本息和等额本金两种方式。</li>
          <li><strong>油车 vs 电车对比：</strong>并排年度成本对比，配有可视化图表和详细分解。</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">我们的使命</h2>
        <p>
          我们致力于减少购车决策中的信息不对称。通过提供清晰、准确的成本计算，帮助消费者了解选择油车与电车之间的真实财务影响。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">工具如何运作</h2>
        <p>
          所有计算完全在您的浏览器中执行，不会将任何个人数据发送到我们的服务器。您的输入值方便地存储在浏览器本地，您可以随时清除。
        </p>
        <p>
          我们的计算模型基于公开的保险费率结构、标准贷款公式和用户可配置的能源价格，为您提供最贴近实际情况的估算。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">重要声明</h2>
        <p>
          本工具提供的计算结果仅供参考。实际费用可能因您所在地区、保险提供商、贷款条款、驾驶习惯等因素而有所不同。做出财务决策时，请务必咨询合格的专业人士。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">联系我们</h2>
        <p>
          如您有问题、建议或反馈，请通过以下方式联系我们：{" "}
          <a href="mailto:contact@vehiclecostcalc.com" className="text-emerald-600 underline">
            contact@vehiclecostcalc.com
          </a>
        </p>
      </div>
    </div>
  );
}
