import { useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export default function AdSidebar({
  slot = "XXXXXXXXXX",
  className = "",
}: AdSidebarProps) {
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
    <div className={`hidden lg:block ${className}`}>
      <div className="w-[300px] shrink-0">
        <div className="text-center mb-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {t.ad.placeholder}
          </span>
        </div>
        <div ref={adRef}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "300px", height: "250px" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slot}
          />
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center h-[250px] text-slate-400 text-xs">
            300×250
          </div>
        </div>
      </div>
    </div>
  );
}
