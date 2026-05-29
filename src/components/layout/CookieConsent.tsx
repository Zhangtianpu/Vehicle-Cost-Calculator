import { useState, useEffect } from "react";
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
        if (state === "accepted") {
          gtag("consent", "update", {
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
            analytics_storage: "granted",
          });
        }
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
                ? "我们使用 Cookie 来提升您的浏览体验并展示个性化广告。您可以选择接受或拒绝非必要 Cookie。有关详细信息，请参阅我们的"
                : "We use cookies to enhance your browsing experience and serve personalized ads. You can choose to accept or reject non-essential cookies. For details, see our"}{" "}
              <a
                href="#/privacy"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                {isZh ? "隐私政策" : "Privacy Policy"}
              </a>
             。
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
