import { useLanguageStore } from "@/store/useLanguageStore";

export default function PrivacyPolicyPage() {
  const { locale } = useLanguageStore();

  if (locale === "en") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <p><strong>Last updated:</strong> October 23, 2026</p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">1. Introduction</h2>
          <p>
            Welcome to Vehicle Cost Calculator ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Usage Data:</strong> Information about how you use our calculator tools, including input values and calculated results. This data is processed entirely in your browser and is not transmitted to our servers.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> With your consent, Google Analytics may use cookies or similar storage to measure site usage. Advertising storage remains disabled unless advertising is approved, configured and consented to.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain our vehicle cost calculation tools</li>
            <li>To improve and personalize your experience</li>
            <li>To display advertisements only if Google AdSense is approved and configured</li>
            <li>To analyze website usage and trends</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">4. Google AdSense and Advertising</h2>
          <p>
            This site is preparing for Google AdSense but does not load AdSense advertising code until a valid publisher account and ad slots are configured. If advertising is enabled later, Google may use cookies or web beacons subject to your consent choices and applicable law.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              Google Ads Settings
            </a>.
          </p>
          <p>
            For more information about how Google uses data, please visit{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              Google's Advertising Privacy page
            </a>.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">5. Cookies</h2>
          <p>Our website uses the following types of cookies:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., saving your calculator preferences).</li>
            <li><strong>Advertising Cookies:</strong> Disabled while AdSense is not configured; if enabled later, these will be controlled by consent settings.</li>
            <li><strong>Analytics Cookies:</strong> Used by Google Analytics after consent to understand aggregate site usage.</li>
          </ul>
          <p>
            You can manage your cookie preferences through our cookie consent banner or your browser settings.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">6. Third-Party Services</h2>
          <p>We may use the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google Analytics:</strong> For aggregate usage measurement, subject to consent.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                Google Privacy Policy
              </a>
            </li>
            <li><strong>Google AdSense:</strong> Planned for advertising after account approval and configuration; currently not loaded without a valid publisher ID.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">7. Data Retention</h2>
          <p>
            Calculator input data is stored locally in your browser's LocalStorage and is never transmitted to our servers. You can clear this data at any time by clearing your browser's local storage.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">8. Your Rights (GDPR/CCPA)</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided below.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">9. Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-lg font-semibold text-slate-700 mt-6">11. Contact Us</h2>
          <p>
            If you have questions about this policy, use the public{" "}
            <a href="https://github.com/Zhangtianpu/Vehicle-Cost-Calculator/issues" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              issue tracker
            </a>
            . Do not include sensitive personal information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">隐私政策</h1>
      <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
        <p><strong>最后更新：</strong>2026年10月23日</p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">1. 引言</h2>
        <p>
          欢迎使用用车成本计算器（以下简称"我们"）。我们尊重您的隐私权，并致力于保护您的个人数据。本隐私政策说明了我们在您访问本网站时如何收集、使用和保护您的信息。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">2. 我们收集的信息</h2>
        <p>我们可能收集以下类型的信息：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>使用数据：</strong>关于您如何使用我们计算器工具的信息，包括输入值和计算结果。这些数据完全在您的浏览器中处理，不会传输到我们的服务器。</li>
          <li><strong>设备信息：</strong>浏览器类型、操作系统、设备类型和屏幕分辨率。</li>
          <li><strong>Cookie 和跟踪技术：</strong>在您同意后，Google Analytics 可能使用 Cookie 或类似存储来统计网站使用情况。广告存储在广告通过审核、完成配置并获得同意前保持禁用。</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">3. 我们如何使用您的信息</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>提供和维护我们的用车成本计算工具</li>
          <li>改善和个性化您的使用体验</li>
          <li>仅在 Google AdSense 通过审核并完成配置后展示广告</li>
          <li>分析网站使用情况和趋势</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">4. Google AdSense 与广告</h2>
        <p>
          本站正在为 Google AdSense 做准备，但在配置有效的发布商账号和广告位之前不会加载 AdSense 广告代码。未来启用广告后，Google 可能在遵守您的同意选择和适用法律的前提下使用 Cookie 或网络信标。
        </p>
        <p>
          您可以通过访问{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            Google 广告设置
          </a>{" "}
          选择停用个性化广告。
        </p>
        <p>
          有关 Google 如何使用数据的更多信息，请访问{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            Google 广告隐私页面
          </a>。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">5. Cookie</h2>
        <p>本网站使用以下类型的 Cookie：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>必要 Cookie：</strong>网站正常运行所必需（如保存您的计算器偏好设置）。</li>
          <li><strong>广告 Cookie：</strong>AdSense 未配置期间保持禁用；未来启用时将受同意设置控制。</li>
          <li><strong>分析 Cookie：</strong>在获得同意后由 Google Analytics 用于汇总分析网站使用情况。</li>
        </ul>
        <p>
          您可以通过我们的 Cookie 同意横幅或浏览器设置管理您的 Cookie 偏好。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">6. 第三方服务</h2>
        <p>我们可能使用以下第三方服务：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Google Analytics：</strong>在获得同意后用于汇总访问统计。{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              Google 隐私政策
            </a>
          </li>
          <li><strong>Google AdSense：</strong>计划在账号通过审核并完成配置后用于广告；没有有效发布商 ID 时不会加载。</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">7. 数据保留</h2>
        <p>
          计算器输入数据存储在您浏览器的 LocalStorage 中，从不传输到我们的服务器。您可以随时通过清除浏览器的本地存储来删除这些数据。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">8. 您的权利（GDPR/CCPA）</h2>
        <p>根据您所在的地区，您可能享有以下权利：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>访问您的个人数据的权利</li>
          <li>更正不准确数据的权利</li>
          <li>删除权（"被遗忘权"）</li>
          <li>限制处理的权利</li>
          <li>数据可携带权</li>
          <li>反对处理的权利</li>
          <li>随时撤回同意的权利</li>
        </ul>
        <p>
          如需行使这些权利，请使用下方提供的联系方式与我们联系。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">9. 儿童隐私</h2>
        <p>
          本网站不面向 13 岁以下儿童。我们不会故意收集 13 岁以下儿童的个人身份信息。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">10. 政策变更</h2>
        <p>
          我们可能会不时更新本隐私政策。我们将通过在本页面上发布新的隐私政策并更新"最后更新"日期来通知您任何变更。
        </p>

        <h2 className="text-lg font-semibold text-slate-700 mt-6">11. 联系我们</h2>
        <p>
          如对本隐私政策有疑问，请通过公开的{" "}
          <a href="https://github.com/Zhangtianpu/Vehicle-Cost-Calculator/issues" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
            GitHub Issues
          </a>
          提交。请勿包含个人敏感信息。
        </p>
      </div>
    </div>
  );
}
