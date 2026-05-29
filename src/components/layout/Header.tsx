import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, BarChart3, Fuel, Zap, Languages, ArrowLeftRight, Check, Calculator } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function Header() {
  const location = useLocation();
  const { vehicleType, setVehicleType, syncToOther } = useVehicleStore();
  const { locale, setLocale, t } = useLanguageStore();
  const isCompare = location.pathname === "/compare";
  const isCalculator = location.pathname === "/calculator";
  const isFeatures = location.pathname === "/";
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    syncToOther();
    setSynced(true);
    setTimeout(() => setSynced(false), 1500);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Car className="w-7 h-7 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight hidden sm:inline">
              {t.app.title}
            </span>
            <span className="text-lg font-bold tracking-tight sm:hidden">
              {t.app.titleShort}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {isFeatures && (
              <Link
                to="/calculator"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.features.startCalc}</span>
              </Link>
            )}

            {!isFeatures && (
              <Link
                to="/"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
              >
                {t.footer.features}
              </Link>
            )}

            {isCalculator && (
              <>
                <div className="flex items-center bg-slate-700 rounded-full p-1">
                  <button
                    onClick={() => setVehicleType("fuel")}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      vehicleType === "fuel"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.nav.fuel}</span>
                  </button>
                  <button
                    onClick={() => setVehicleType("electric")}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      vehicleType === "electric"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.nav.electric}</span>
                  </button>
                </div>
                <button
                  onClick={handleSync}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    synced
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  title={vehicleType === "fuel" ? t.nav.syncToEV : t.nav.syncToFuel}
                >
                  {synced ? <Check className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
                  <span className="hidden sm:inline">{synced ? t.nav.syncDone : t.nav.sync}</span>
                </button>
              </>
            )}

            <Link
              to={isCompare ? "/calculator" : "/compare"}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-sm font-medium bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isCompare ? t.nav.calculator : t.nav.compare}
              </span>
            </Link>

            <button
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
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
