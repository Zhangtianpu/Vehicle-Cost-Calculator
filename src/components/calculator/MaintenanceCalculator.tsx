import { Wrench } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function MaintenanceCalculator() {
  const { vehicleType, maintenanceParams, setMaintenanceParams, costSummary, moduleToggle, setModuleToggle } = useVehicleStore();
  const { t } = useLanguageStore();
  const isElectric = vehicleType === "electric";
  const enabled = moduleToggle.maintenance && maintenanceParams.enabled;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!moduleToggle.maintenance ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{t.maintenance.title}</h2>
            <p className="text-xs text-slate-400">{t.maintenance.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setModuleToggle({ maintenance: !moduleToggle.maintenance })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            moduleToggle.maintenance ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              moduleToggle.maintenance ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {moduleToggle.maintenance && (
        <>
          <div className="space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={maintenanceParams.enabled}
                onChange={(e) => setMaintenanceParams({ enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {t.maintenance.includeMaintenance}
              </span>
            </label>

            {maintenanceParams.enabled && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {t.maintenance.yearlyCost}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maintenanceParams.yearlyCost}
                    onChange={(e) => setMaintenanceParams({ yearlyCost: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                    min={0}
                    step={100}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {t.insurance.perYear}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {isElectric ? t.maintenance.hintEV : t.maintenance.hintFuel}
                </p>
              </div>
            )}
          </div>

          {enabled && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{t.fuel.monthlyCost}</span>
                <span className="text-lg font-bold text-slate-800">
                  ¥{costSummary.maintenance.monthlyCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-slate-500">{t.fuel.yearlyCost}</span>
                <span className="text-sm font-medium text-slate-600">
                  ¥{costSummary.maintenance.yearlyCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
