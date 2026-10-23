import { Fuel, Zap } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { MileagePeriod } from "@/types";

const MILEAGE_PERIODS: { key: MileagePeriod; labelZh: string; labelEn: string }[] = [
  { key: "daily", labelZh: "日", labelEn: "Day" },
  { key: "monthly", labelZh: "月", labelEn: "Mon" },
  { key: "yearly", labelZh: "年", labelEn: "Year" },
];

export default function FuelCalculator() {
  const { vehicleType, unitSystem, setUnitSystem, fuelParams, setFuelParams, costSummary } = useVehicleStore();
  const { locale, t } = useLanguageStore();
  const isElectric = vehicleType === "electric";
  const isUs = unitSystem === "us";
  const distanceUnit = isUs ? "mi" : "km";
  const priceUnit = isElectric ? "kWh" : isUs ? "gal" : "L";
  const efficiencyUnit = isElectric ? `kWh/100${distanceUnit}` : isUs ? "MPG" : "L/100km";
  const efficiencyLabel = isElectric
    ? t.fuel.consumptionElectric
    : isUs
      ? locale === "zh" ? "燃油经济性" : "Fuel Economy"
      : t.fuel.consumption;
  const costPerDistance = fuelParams.efficiency > 0
    ? isUs && !isElectric
      ? fuelParams.fuelPrice / fuelParams.efficiency
      : (fuelParams.efficiency / 100) * fuelParams.fuelPrice
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isElectric ? "bg-emerald-100" : "bg-orange-100"
            }`}
          >
            {isElectric ? (
              <Zap className="w-5 h-5 text-emerald-600" />
            ) : (
              <Fuel className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {isElectric ? t.fuel.titleElectric : t.fuel.titleFuel}
            </h2>
            <p className="text-xs text-slate-400">
              {isElectric ? t.fuel.subtitleElectric : t.fuel.subtitleFuel}
            </p>
          </div>
        </div>
        <div role="group" className="flex rounded-lg bg-slate-100 p-0.5" aria-label={locale === "zh" ? "单位制" : "Unit system"}>
          <button
            type="button"
            onClick={() => setUnitSystem("us")}
            aria-pressed={isUs}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${isUs ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {locale === "zh" ? "美制" : "US units"}
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem("metric")}
            aria-pressed={!isUs}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${!isUs ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {locale === "zh" ? "公制" : "Metric"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            {t.fuel.mileage}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={fuelParams.mileage}
                onChange={(e) =>
                  setFuelParams({ mileage: Number(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                min={0}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                {distanceUnit}
              </span>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-0.5 shrink-0">
              {MILEAGE_PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFuelParams({ mileagePeriod: p.key })}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    fuelParams.mileagePeriod === p.key
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {locale === "zh" ? p.labelZh : p.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            {isElectric ? t.fuel.electricityPrice : t.fuel.fuelPrice}
          </label>
          <div className="relative">
            <input
              type="number"
              value={fuelParams.fuelPrice}
              onChange={(e) =>
                setFuelParams({ fuelPrice: Number(e.target.value) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {locale === "zh" ? "元" : "$"}/{priceUnit}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            {efficiencyLabel}
          </label>
          <div className="relative">
            <input
              type="number"
              value={fuelParams.efficiency}
              onChange={(e) =>
                setFuelParams({ efficiency: Number(e.target.value) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
              min={0}
              step={0.1}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {efficiencyUnit}
            </span>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          {locale === "zh"
            ? "切换单位制时，里程、油价和能耗会自动换算，保持计算成本基本不变。"
            : "Switching units converts distance, fuel price and efficiency so the underlying cost stays approximately the same."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">{t.fuel.monthlyCost}</span>
          <span className="text-lg font-bold text-slate-800">
            {t.currency}{costSummary.fuel.monthlyCost.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-slate-500">{t.fuel.yearlyCost}</span>
          <span className="text-sm font-medium text-slate-600">
            {t.currency}{costSummary.fuel.yearlyCost.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-slate-500">
            {locale === "zh" ? `每${distanceUnit}能源成本` : `Energy cost per ${isUs ? "mile" : "km"}`}
          </span>
          <span className="text-sm font-medium text-slate-600">
            {t.currency}{costPerDistance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}/{distanceUnit}
          </span>
        </div>
      </div>
    </div>
  );
}
