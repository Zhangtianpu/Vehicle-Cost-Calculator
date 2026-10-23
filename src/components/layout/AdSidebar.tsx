import { useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export default function AdSidebar({
  slot = import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT,
  className = "",
}: AdSidebarProps) {
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
            data-ad-client={client}
            data-ad-slot={slot}
          />
        </div>
      </div>
    </div>
  );
}
