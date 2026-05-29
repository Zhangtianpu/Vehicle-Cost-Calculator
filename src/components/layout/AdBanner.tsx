import { useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export default function AdBanner({
  slot = "XXXXXXXXXX",
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const { t } = useLanguageStore();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, []);

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
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center h-[90px] text-slate-400 text-xs">
            {format === "horizontal" ? "728×90" : "自适应"}
          </div>
        </div>
      </div>
    </div>
  );
}
