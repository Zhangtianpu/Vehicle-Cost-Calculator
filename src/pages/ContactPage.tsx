import { Github, MessageSquareText } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const REPOSITORY_URL = "https://github.com/Zhangtianpu/Vehicle-Cost-Calculator";
const ISSUES_URL = `${REPOSITORY_URL}/issues`;

export default function ContactPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{isZh ? "联系我们" : "Contact"}</h1>
      <p className="text-sm text-slate-500 mb-6">
        {isZh ? "本站由独立开发者公开维护。为保证问题可追踪，请通过项目仓库提交反馈。" : "This site is maintained openly by an independent developer. Please use the project repository so feedback remains traceable."}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition-all">
          <MessageSquareText className="h-8 w-8 text-emerald-500 mb-4" />
          <h2 className="font-semibold text-slate-800 mb-2">{isZh ? "提交问题或建议" : "Report an issue or suggestion"}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isZh ? "适用于计算错误、内容纠错、功能建议、隐私问题和无障碍问题。请勿在公开 Issue 中发布个人敏感信息。" : "For calculation errors, corrections, feature ideas, privacy or accessibility issues. Do not post sensitive personal information in a public issue."}
          </p>
        </a>

        <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition-all">
          <Github className="h-8 w-8 text-slate-700 mb-4" />
          <h2 className="font-semibold text-slate-800 mb-2">{isZh ? "查看源代码" : "View source code"}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isZh ? "查看计算公式的实现、更新记录和部署状态，也可以通过 Pull Request 参与改进。" : "Inspect formula implementations, change history and deployment status, or contribute through a pull request."}
          </p>
        </a>
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 leading-relaxed">
        {isZh ? "本站目前没有使用 vehiclecostcalc.com 域名邮箱。任何自称来自该域名的邮件均不代表本站。" : "This site does not currently use email addresses at vehiclecostcalc.com. Messages claiming to represent this site from that domain are not official."}
      </div>
    </div>
  );
}
