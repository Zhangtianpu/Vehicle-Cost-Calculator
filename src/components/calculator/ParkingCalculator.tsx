import { SquareParking } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function ParkingCalculator() {
  const { parkingParams, setParkingParams, costSummary, moduleToggle, setModuleToggle } = useVehicleStore();
  const { t } = useLanguageStore();
  const enabled = moduleToggle.parking && parkingParams.enabled;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!moduleToggle.parking ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <SquareParking className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{t.parking.title}</h2>
            <p className="text-xs text-slate-400">{t.parking.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setModuleToggle({ parking: !moduleToggle.parking })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            moduleToggle.parking ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              moduleToggle.parking ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {moduleToggle.parking && (
        <>
          <div className="space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={parkingParams.enabled}
                onChange={(e) => setParkingParams({ enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {t.parking.includeParking}
              </span>
            </label>

            {parkingParams.enabled && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {t.parking.monthlyCost}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={parkingParams.monthlyCost}
                    onChange={(e) => setParkingParams({ monthlyCost: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                    min={0}
                    step={50}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {t.parking.monthlyCostUnit}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {t.parking.hint}
                </p>
              </div>
            )}
          </div>

          {enabled && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{t.fuel.monthlyCost}</span>
                <span className="text-lg font-bold text-slate-800">
                  ¥{costSummary.parking.monthlyCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-slate-500">{t.fuel.yearlyCost}</span>
                <span className="text-sm font-medium text-slate-600">
                  ¥{costSummary.parking.yearlyCost.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
