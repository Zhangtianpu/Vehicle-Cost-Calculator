import { Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function ContactPage() {
  const { locale } = useLanguageStore();
  const [copied, setCopied] = useState(false);

  const email = "contact@vehiclecostcalc.com";

  function handleCopy() {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (locale === "en") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Contact Us</h1>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Get in Touch</h2>
              <p className="text-xs text-slate-400">We'd love to hear from you</p>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            If you have any questions, suggestions, or feedback about our Vehicle Cost Calculator, please don't hesitate to reach out. We typically respond within 1-2 business days.
          </p>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2">Email Address</p>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {email}
              </a>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-slate-200 hover:bg-slate-300 transition-colors"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              For privacy-related inquiries, please contact:{" "}
              <a href="mailto:privacy@vehiclecostcalc.com" className="text-emerald-600 underline">
                privacy@vehiclecostcalc.com
              </a>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              For legal matters, please contact:{" "}
              <a href="mailto:legal@vehiclecostcalc.com" className="text-emerald-600 underline">
                legal@vehiclecostcalc.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">联系我们</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Mail className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">与我们联系</h2>
            <p className="text-xs text-slate-400">期待您的来信</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          如果您对我们的用车成本计算器有任何问题、建议或反馈，请随时与我们联系。我们通常会在 1-2 个工作日内回复。
        </p>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-2">电子邮箱</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {email}
            </a>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-slate-200 hover:bg-slate-300 transition-colors"
              aria-label="复制邮箱"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            隐私相关咨询，请联系：{" "}
            <a href="mailto:privacy@vehiclecostcalc.com" className="text-emerald-600 underline">
              privacy@vehiclecostcalc.com
            </a>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            法律事务，请联系：{" "}
            <a href="mailto:legal@vehiclecostcalc.com" className="text-emerald-600 underline">
              legal@vehiclecostcalc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
