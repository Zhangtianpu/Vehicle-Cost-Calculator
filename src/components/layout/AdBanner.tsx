import { useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export default function AdBanner({
  slot = import.meta.env.VITE_ADSENSE_BANNER_SLOT,
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const { t } = useLanguageStore();
  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  const isConfigured = /^ca-pub-\d+$/.test(client || "") && /^\d+$/.test(slot || "");

  useEffect(() => {
    if (!isConfigured || initialized.current) return;
    initialized.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [isConfigured]);

  if (!isConfigured) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-full max-w-[728px]">
        <div className="text-center mb-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {t.ad.placeholder}
          </span>
        </div>
        <div ref={adRef}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}
