import { useLanguageStore } from "@/store/useLanguageStore";

export default function DisclaimerPage() {
  const { locale } = useLanguageStore();

  if (locale === "en") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Disclaimer & Terms of Use</h1>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <p><strong>Last updated:</strong> May 26, 2026</p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">1. General Disclaimer</h2>
          <p>
            The Vehicle Cost Calculator provides cost estimates for reference purposes only. All calculations are based on general formulas, publicly available rate structures, and user-provided input values. The results do not constitute financial, insurance, or legal advice.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">2. No Professional Advice</h2>
          <p>
            The information provided by this tool should not be relied upon as a substitute for professional financial advice. Actual vehicle operating costs, insurance premiums, and loan terms may vary significantly based on factors including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your geographic location and local regulations</li>
            <li>Your driving history and personal circumstances</li>
            <li>Specific insurance provider policies and rates</li>
            <li>Lender terms, credit score, and market conditions</li>
            <li>Vehicle model, condition, and usage patterns</li>
            <li>Fluctuations in fuel and electricity prices</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">3. Accuracy of Calculations</h2>
          <p>
            While we strive to provide accurate calculation formulas, we make no warranties or guarantees regarding the accuracy, completeness, or reliability of the results. Insurance rate estimates are approximations based on industry averages and may not reflect actual quotes from insurance providers.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">4. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or reliance on the information provided by this tool, including but not limited to financial decisions made based on the calculation results.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">5. User Responsibility</h2>
          <p>
            You are solely responsible for verifying the accuracy of any calculations and for making your own financial decisions. We recommend consulting with qualified professionals, such as financial advisors, insurance agents, and loan officers, before making significant financial commitments.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">6. Third-Party Content</h2>
          <p>
            This website may display advertisements provided by third-party advertising networks, including Google AdSense. We do not endorse or guarantee the products or services advertised on our website. The presence of advertisements does not imply our endorsement.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">7. External Links</h2>
          <p>
            Our website may contain links to external websites. We are not responsible for the content, privacy policies, or practices of third-party websites.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">8. Intellectual Property</h2>
          <p>
            All content on this website, including text, design, and functionality, is the property of Vehicle Cost Calculator and is protected by applicable intellectual property laws. You may not reproduce, distribute, or modify any content without our prior written consent.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">10. Contact</h2>
          <p>
            For questions about this disclaimer, contact us at:{" "}
            <a href="mailto:legal@vehiclecostcalc.com" className="text-emerald-600 underline">
              legal@vehiclecostcalc.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">免责声明与使用条款</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
        <p><strong>最后更新：</strong>2026年5月26日</p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">1. 一般免责声明</h2>
        <p>
          用车成本计算器提供的成本估算仅供参考。所有计算基于通用公式、公开的费率结构和用户提供的输入值。计算结果不构成财务、保险或法律建议。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">2. 非专业建议</h2>
        <p>
          本工具提供的信息不应作为专业财务建议的替代。实际车辆运营成本、保险费和贷款条件可能因以下因素而显著不同：
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>您所在的地理位置和当地法规</li>
          <li>您的驾驶记录和个人情况</li>
          <li>特定保险提供商的政策和费率</li>
          <li>贷款条款、信用评分和市场条件</li>
          <li>车辆型号、状况和使用模式</li>
          <li>燃油和电力价格波动</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">3. 计算准确性</h2>
        <p>
          虽然我们努力提供准确的计算公式，但我们对结果的准确性、完整性或可靠性不作任何保证或担保。保险费率估算是基于行业平均值的近似值，可能不反映保险提供商的实际报价。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">4. 责任限制</h2>
        <p>
          在法律允许的最大范围内，我们不对因您使用或依赖本工具提供的信息而产生的任何直接、间接、附带、后果性或特殊损害承担责任，包括但不限于基于计算结果做出的财务决策。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">5. 用户责任</h2>
        <p>
          您有责任自行核实任何计算的准确性，并自行做出财务决策。我们建议在做出重大财务承诺之前，咨询合格的专业人士，如财务顾问、保险代理和贷款专员。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">6. 第三方内容</h2>
        <p>
          本网站可能展示由第三方广告网络（包括 Google AdSense）提供的广告。我们不认可或保证本网站上广告的产品或服务。广告的存在不意味着我们的认可。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">7. 外部链接</h2>
        <p>
          本网站可能包含指向外部网站的链接。我们不对第三方网站的内容、隐私政策或做法负责。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">8. 知识产权</h2>
        <p>
          本网站上的所有内容，包括文字、设计和功能，均为用车成本计算器的财产，受适用的知识产权法保护。未经我们事先书面同意，您不得复制、分发或修改任何内容。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">9. 条款变更</h2>
        <p>
          我们保留随时修改这些条款的权利。变更后继续使用本网站即表示接受更新后的条款。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">10. 联系方式</h2>
        <p>
          如对本免责声明有疑问，请联系：{" "}
          <a href="mailto:legal@vehiclecostcalc.com" className="text-emerald-600 underline">
            legal@vehiclecostcalc.com
          </a>
        </p>
      </div>
    </div>
  );
}
