import { lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, BarChart3, Languages, Calculator, BookOpen, HelpCircle, Wrench, House } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

const CalculatorHeaderControls = lazy(() => import("@/components/layout/CalculatorHeaderControls"));

export default function Header() {
  const location = useLocation();
  const { locale, setLocale, t } = useLanguageStore();
  const pathname = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
  const isCompare = pathname === "/compare";
  const isCalculator = pathname === "/calculator";
  const isFeatures = pathname === "/";
  const isCostWorkspace = isCalculator || isCompare;
  return (
    <header className="sticky top-0 z-50 bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Car className="w-7 h-7 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight hidden sm:inline">
              {t.app.title}
            </span>
            <span className="sr-only sm:hidden">{t.app.titleShort}</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4">
            {isFeatures && (
              <Link
                to="/calculator"
                aria-label={t.features.startCalc}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200"
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">{t.features.startCalc}</span>
              </Link>
            )}

            {!isFeatures && (
              <Link
                to="/"
                aria-label={t.footer.features}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
              >
                <House className="w-4 h-4" />
                <span className="hidden sm:inline">{t.footer.features}</span>
              </Link>
            )}

            <Link
              to="/blog"
              aria-label={t.nav.blog}
              className={`${isCostWorkspace ? "hidden lg:flex" : "flex"} items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.blog}</span>
            </Link>

            <Link
              to="/tools"
              aria-label={t.nav.tools}
              className={`${isCostWorkspace ? "hidden lg:flex" : "flex"} items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200`}
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden lg:inline">{t.nav.tools}</span>
            </Link>

            <Link
              to="/faq"
              aria-label={t.nav.faq}
              className={`${isCostWorkspace ? "hidden lg:flex" : "flex"} items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.faq}</span>
            </Link>

            {isCalculator && (
              <Suspense fallback={null}>
                <CalculatorHeaderControls />
              </Suspense>
            )}

            <Link
              to={isCompare ? "/calculator" : "/compare"}
              aria-label={isCompare ? t.nav.calculator : t.nav.compare}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isCompare ? t.nav.calculator : t.nav.compare}
              </span>
            </Link>

            <button
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
              aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs font-bold">
                {locale === "zh" ? "EN" : "中"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
