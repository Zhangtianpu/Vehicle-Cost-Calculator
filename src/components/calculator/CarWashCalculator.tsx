import { Droplets } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function CarWashCalculator() {
  const { carWashParams, setCarWashParams, costSummary, moduleToggle, setModuleToggle } = useVehicleStore();
  const { t } = useLanguageStore();
  const enabled = moduleToggle.carWash && carWashParams.enabled;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!moduleToggle.carWash ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{t.carWash.title}</h2>
            <p className="text-xs text-slate-400">{t.carWash.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setModuleToggle({ carWash: !moduleToggle.carWash })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            moduleToggle.carWash ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              moduleToggle.carWash ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {moduleToggle.carWash && (
        <>
          <div className="space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={carWashParams.enabled}
                onChange={(e) => setCarWashParams({ enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {t.carWash.includeCarWash}
              </span>
            </label>

            {carWashParams.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    {t.carWash.timesPerMonth}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={carWashParams.timesPerMonth}
                      onChange={(e) => setCarWashParams({ timesPerMonth: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      min={0}
                      max={30}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {t.carWash.timesPerMonthUnit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    {t.carWash.costPerTime}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={carWashParams.costPerTime}
                      onChange={(e) => setCarWashParams({ costPerTime: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                      min={0}
                      step={5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {t.carWash.costPerTimeUnit}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {enabled && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{t.fuel.monthlyCost}</span>
                <span className="text-lg font-bold text-slate-800">
                  ¥{costSummary.carWash.monthlyCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-slate-500">{t.fuel.yearlyCost}</span>
                <span className="text-sm font-medium text-slate-600">
                  ¥{costSummary.carWash.yearlyCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
