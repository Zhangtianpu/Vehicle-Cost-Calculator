import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const CONSENT_KEY = "cookie_consent";

type ConsentState = "undecided" | "accepted" | "rejected";

export default function CookieConsent() {
  const { locale } = useLanguageStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    if (!stored) {
      setVisible(true);
    }
    applyConsent(stored || "undecided");
  }, []);

  function applyConsent(state: ConsentState) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        const granted = state === "accepted";
        gtag("consent", "update", {
          ad_storage: granted ? "granted" : "denied",
          ad_user_data: granted ? "granted" : "denied",
          ad_personalization: granted ? "granted" : "denied",
          analytics_storage: granted ? "granted" : "denied",
        });
      }
    } catch {
      // ignore
    }
  }

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    applyConsent("accepted");
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
    applyConsent("rejected");
  }

  if (!visible) return null;

  const isZh = locale === "zh";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              {isZh ? "Cookie 使用同意" : "Cookie Consent"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isZh
                ? "必要存储用于保存计算器设置；在您同意后，Google Analytics 可使用非必要存储进行访问统计。未来启用广告时，广告存储同样受您的选择控制。详情请参阅"
                : "Essential storage saves calculator settings. With consent, Google Analytics may use non-essential storage for usage measurement; future advertising storage will follow the same choice. See our"}{" "}
              <Link
                to="/privacy"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                {isZh ? "隐私政策" : "Privacy Policy"}
              </Link>
              {isZh ? "。" : "."}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                {isZh ? "接受所有 Cookie" : "Accept All"}
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {isZh ? "仅必要 Cookie" : "Essential Only"}
              </button>
            </div>
          </div>
          <button
            onClick={handleReject}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
