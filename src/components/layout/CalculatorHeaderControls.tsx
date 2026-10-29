import { useState } from "react";
import { ArrowLeftRight, Check, Fuel, Zap } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useVehicleStore } from "@/store/useVehicleStore";

export default function CalculatorHeaderControls() {
  const { vehicleType, setVehicleType, syncToOther } = useVehicleStore();
  const { t } = useLanguageStore();
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    syncToOther();
    setSynced(true);
    setTimeout(() => setSynced(false), 1500);
  };

  return (
    <>
      <div className="flex items-center bg-slate-700 rounded-full p-1">
        <button
          onClick={() => setVehicleType("fuel")}
          aria-label={t.nav.fuel}
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
          aria-label={t.nav.electric}
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
        aria-label={vehicleType === "fuel" ? t.nav.syncToEV : t.nav.syncToFuel}
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
  );
}
