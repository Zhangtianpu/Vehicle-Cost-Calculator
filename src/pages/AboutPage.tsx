import { Link } from "react-router-dom";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function AboutPage() {
  const { locale } = useLanguageStore();

  if (locale === "en") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">About Vehicle Cost Calculator</h1>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Who Maintains This Site</h2>
          <p>
            Vehicle Cost Calculator is a free online tool maintained by independent developer Zhangtianpu for car buyers and owners. Its source code and change history are public so calculation logic can be inspected and corrected.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">What We Do</h2>
          <p>
            Our calculator provides comprehensive vehicle operating cost analysis, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fuel and Charging Calculators:</strong> Estimate gas cost with miles and MPG or metric inputs, and model EV charging from consumption, prices and charging losses.</li>
            <li><strong>Insurance Budget Input:</strong> Add an annual quote for the exact vehicle and coverage available in your location.</li>
            <li><strong>Auto Loan Calculator:</strong> Calculate monthly payments, total interest, and repayment schedules with both equal installment and equal principal methods.</li>
            <li><strong>Fuel vs. EV Comparison:</strong> Side-by-side annual cost comparison with visual charts and detailed breakdowns.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Our Mission</h2>
          <p>
            We aim to make vehicle-cost assumptions visible and testable. The tools help consumers compare scenarios, identify the inputs that matter and replace illustrative defaults with their own quotes.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">How Our Tool Works</h2>
          <p>
            All calculations are performed entirely in your browser. No personal data is sent to our servers. Your input values are stored locally in your browser for convenience, and you can clear them at any time.
          </p>
          <p>
            Standard arithmetic and loan formulas are documented on the Methodology page. Insurance, energy prices, mileage, maintenance and resale assumptions should be replaced with current local information before making a decision.
          </p>
          <p>
            Our <Link to="/editorial-policy" className="text-emerald-600 underline">Editorial &amp; Content Policy</Link> explains authorship, source selection, AI-assisted work, corrections and commercial independence.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Important Disclaimer</h2>
          <p>
            The calculations provided by this tool are for reference purposes only. Actual costs may vary based on your location, insurance provider, lender terms, driving habits, and other factors. Always consult with qualified professionals for financial decisions.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">Feedback and Corrections</h2>
          <p>
            Questions, corrections and suggestions can be submitted through the public{" "}
            <a href="https://github.com/Zhangtianpu/Vehicle-Cost-Calculator/issues" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              GitHub issue tracker
            </a>
            . Please do not include sensitive personal information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">关于我们</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">谁在维护本站</h2>
        <p>
          用车成本计算器是一款由独立开发者 Zhangtianpu 维护的免费在线工具，服务于购车者和车主。本站源代码和更新记录公开，方便用户检查计算逻辑、报告错误并参与改进。
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
          <p>
            关于署名、来源选择、AI 辅助、纠错和商业独立性的说明，请参阅<Link to="/editorial-policy" className="text-emerald-600 underline">编辑与内容政策</Link>。
          </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">重要声明</h2>
        <p>
          本工具提供的计算结果仅供参考。实际费用可能因您所在地区、保险提供商、贷款条款、驾驶习惯等因素而有所不同。做出财务决策时，请务必咨询合格的专业人士。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">反馈与纠错</h2>
        <p>
          如有问题、内容纠错或功能建议，请通过公开的{" "}
          <a href="https://github.com/Zhangtianpu/Vehicle-Cost-Calculator/issues" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            GitHub Issues
          </a>
          提交。请勿包含个人敏感信息。
        </p>
      </div>
    </div>
  );
}
