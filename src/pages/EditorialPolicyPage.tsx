import { Link } from "react-router-dom";
import { BookCheck, Github, Scale } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const REPOSITORY_URL = "https://github.com/Zhangtianpu/Vehicle-Cost-Calculator";
const ISSUES_URL = `${REPOSITORY_URL}/issues`;

export default function EditorialPolicyPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <BookCheck className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {isZh ? "编辑与内容政策" : "Editorial & Content Policy"}
          </h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {isZh
            ? "本页说明本站由谁维护、计算器和文章如何制作，以及我们如何处理来源、纠错和商业影响。"
            : "This page explains who maintains the site, how calculators and articles are produced, and how we handle sources, corrections and commercial influence."}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          {isZh ? "最后复核：2026年10月23日" : "Last reviewed: October 23, 2026"}
        </p>
      </header>

      <div className="space-y-5 text-sm leading-relaxed text-slate-600">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            {isZh ? "谁负责本站" : "Who is responsible for this site"}
          </h2>
          <p>
            {isZh
              ? "Vehicle Cost Calculator 由独立开发者 Zhangtianpu 维护，并非汽车厂商、经销商、保险公司、贷款机构或政府机构。文章署名指负责代码、计算逻辑和发布审核的项目维护者，不代表虚构的专家团队。"
              : "Vehicle Cost Calculator is maintained by independent developer Zhangtianpu. It is not a vehicle manufacturer, dealer, insurer, lender or government agency. The byline refers to the project maintainer who reviews the code, calculation logic and publication; it does not represent a fabricated panel of experts."}
          </p>
          <p className="mt-3">
            {isZh ? "源代码、提交记录和问题追踪均公开可查。" : "Source code, revision history and issue tracking are publicly inspectable."}{" "}
            <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              {isZh ? "查看 GitHub 仓库" : "View the GitHub repository"}
            </a>
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            {isZh ? "计算器如何制作和测试" : "How calculators are built and tested"}
          </h2>
          <p>
            {isZh
              ? "工具使用公开展示的确定性公式处理用户输入。能源、贷款、折旧和多年成本公式记录在方法页；关键计算配有自动化测试。默认值只是便于操作的示例，不是实时市场报价或个人建议。"
              : "The tools apply visible, deterministic formulas to user inputs. Energy, loan, depreciation and multi-year formulas are documented on the Methodology page, and key calculations have automated tests. Defaults are usable examples—not live market quotes or personal advice."}
          </p>
          <p className="mt-3">
            <Link to="/methodology" className="text-emerald-600 underline">
              {isZh ? "阅读完整计算方法" : "Read the complete methodology"}
            </Link>
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            {isZh ? "文章如何制作" : "How articles are produced"}
          </h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>{isZh ? "围绕读者能够完成的具体任务确定范围，例如比较两辆车或核对贷款成本。" : "Define a reader task, such as comparing two vehicles or checking the full cost of a loan."}</li>
            <li>{isZh ? "优先核对政府机构、监管机构和产品原始文件；会随地区变化的内容引导读者查阅当地来源。" : "Check government, regulator and primary product documentation first; location-dependent questions point readers to local sources."}</li>
            <li>{isZh ? "复核公式、单位和示例，明确区分演示数字与实时数据。" : "Review formulas, units and examples, clearly separating illustrative figures from live data."}</li>
            <li>{isZh ? "在发布前检查内部链接、来源、移动端布局和计算结果。" : "Check internal links, sources, mobile layout and calculation output before publication."}</li>
          </ol>
          <p className="mt-3">
            {isZh
              ? "自动化和 AI 辅助工具可能用于草稿、翻译、代码审查或测试。维护者会在发布前审核变更；本站不发布未经审核的自动生成页面，也不使用自动采集内容。"
              : "Automation and AI-assisted tools may help with drafts, translation, code review or testing. The maintainer reviews changes before publication; the site does not publish unreviewed generated pages or scraped content."}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">
              {isZh ? "独立性、广告与利益冲突" : "Independence, advertising and conflicts"}
            </h2>
          </div>
          <p>
            {isZh
              ? "本站目前不接受付费排名、赞助评测或经销商导流佣金。若未来展示广告，广告不会改变公式、默认比较结果或编辑结论，并会与主要内容清楚区分。任何未来的赞助或联盟关系都将在相关页面显著披露。"
              : "The site currently accepts no paid rankings, sponsored reviews or dealer referral commissions. If advertising is enabled later, it will not change formulas, default comparison results or editorial conclusions, and it will be distinguishable from primary content. Any future sponsorship or affiliate relationship will be disclosed prominently on the relevant page."}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <Github className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              {isZh ? "纠错与更新" : "Corrections and updates"}
            </h2>
          </div>
          <p>
            {isZh
              ? "只有内容、公式或来源发生实质变化时才更新页面日期。发现错误后，我们会修正页面和相关测试，并在公开提交记录中保留变更。"
              : "A page date is changed only after a substantive update to its content, formulas or sources. When an error is confirmed, we correct the page and relevant tests while preserving the change in the public commit history."}
          </p>
          <p className="mt-3">
            <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              {isZh ? "报告计算或内容问题" : "Report a calculation or content issue"}
            </a>
            {isZh ? "。请勿在公开 Issue 中提交个人敏感信息。" : ". Do not include sensitive personal information in a public issue."}
          </p>
        </section>
      </div>
    </div>
  );
}
