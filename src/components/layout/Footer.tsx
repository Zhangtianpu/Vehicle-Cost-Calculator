import { Car } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function Footer() {
  const { t } = useLanguageStore();

  return (
    <footer className="bg-slate-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">{t.app.title}</span>
            </div>
            <p className="text-xs text-center sm:text-right">
              {t.app.metaDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs border-t border-slate-700 pt-4">
            <a href="#/" className="hover:text-slate-200 transition-colors">
              {t.footer.features}
            </a>
            <span className="text-slate-600">|</span>
            <a href="#/about" className="hover:text-slate-200 transition-colors">
              {t.footer.about}
            </a>
            <span className="text-slate-600">|</span>
            <a href="#/privacy" className="hover:text-slate-200 transition-colors">
              {t.footer.privacy}
            </a>
            <span className="text-slate-600">|</span>
            <a href="#/disclaimer" className="hover:text-slate-200 transition-colors">
              {t.footer.disclaimer}
            </a>
            <span className="text-slate-600">|</span>
            <a href="#/contact" className="hover:text-slate-200 transition-colors">
              {t.footer.contact}
            </a>
          </div>
          <p className="text-[10px] text-center text-slate-500">
            © {new Date().getFullYear()} Vehicle Cost Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
