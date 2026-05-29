import { Shield, Edit3 } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { THIRD_PARTY_AMOUNT_OPTIONS } from "@/utils/constants";
import { calculateInsuranceCost } from "@/utils/insuranceCalc";

export default function InsuranceCalculator() {
  const { vehicleType, insuranceParams, setInsuranceParams, costSummary, moduleToggle, setModuleToggle, setVehiclePrice } =
    useVehicleStore();
  const { locale, t } = useLanguageStore();
  const isElectric = vehicleType === "electric";
  const calculatedInsurance = calculateInsuranceCost(insuranceParams, vehicleType);
  const hasCustomCost = insuranceParams.customYearlyCost !== null && insuranceParams.customYearlyCost > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!moduleToggle.insurance ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{t.insurance.title}</h2>
            <p className="text-xs text-slate-400">{t.insurance.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setModuleToggle({ insurance: !moduleToggle.insurance })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            moduleToggle.insurance ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              moduleToggle.insurance ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {moduleToggle.insurance && (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.insurance.vehiclePrice}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={insuranceParams.vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  min={0}
                  step={1000}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {t.currency}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {t.insurance.seatCount}
                </label>
                <input
                  type="number"
                  value={insuranceParams.seatCount}
                  onChange={(e) =>
                    setInsuranceParams({ seatCount: Number(e.target.value) || 5 })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  min={2}
                  max={9}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  {t.insurance.vehicleAge}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={insuranceParams.vehicleAge}
                    onChange={(e) =>
                      setInsuranceParams({ vehicleAge: Number(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                    min={0}
                    max={20}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {t.insurance.year}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2.5">
                {t.insurance.insuranceTypes}
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={insuranceParams.compulsory}
                    onChange={(e) =>
                      setInsuranceParams({ compulsory: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {t.insurance.compulsory}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {insuranceParams.seatCount <= 6 ? "950" : "1,100"}{t.insurance.perYear}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={insuranceParams.vehicleDamage}
                    onChange={(e) =>
                      setInsuranceParams({ vehicleDamage: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {t.insurance.vehicleDamage}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {t.insurance.approx}{Math.round(insuranceParams.vehiclePrice * 0.015).toLocaleString()}{t.insurance.perYear}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={insuranceParams.thirdPartyLiability}
                    onChange={(e) =>
                      setInsuranceParams({ thirdPartyLiability: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {t.insurance.thirdPartyLiability}
                  </span>
                </label>

                {insuranceParams.thirdPartyLiability && (
                  <div className="ml-6.5 pl-1">
                    <div className="flex flex-wrap gap-2">
                      {THIRD_PARTY_AMOUNT_OPTIONS.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setInsuranceParams({ thirdPartyAmount: amount })}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            insuranceParams.thirdPartyAmount === amount
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {amount}{t.insurance.tenThousand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={insuranceParams.passengerLiability}
                    onChange={(e) =>
                      setInsuranceParams({ passengerLiability: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {t.insurance.passengerLiability}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    200{t.insurance.perSeatPerYear}
                  </span>
                </label>

                {isElectric && (
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={insuranceParams.additionalEV}
                      onChange={(e) =>
                        setInsuranceParams({ additionalEV: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">
                      {t.insurance.additionalEV}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {t.insurance.approx}1,000{t.insurance.perYear}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.insurance.noClaimYears}
              </label>
              <input
                type="range"
                value={insuranceParams.noClaimYears}
                onChange={(e) =>
                  setInsuranceParams({ noClaimYears: Number(e.target.value) })
                }
                min={0}
                max={4}
                step={1}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0{t.insurance.year}</span>
                <span className="text-emerald-600 font-medium">
                  {insuranceParams.noClaimYears}{t.insurance.year}
                  {insuranceParams.noClaimYears > 0 && (
                    <span className="ml-1">
                      ({t.insurance.discount}{[1, 0.85, 0.7, 0.6, 0.5][insuranceParams.noClaimYears]})
                    </span>
                  )}
                </span>
                <span>4{t.insurance.year}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">{t.insurance.systemEstimate}</span>
                <span className={`text-sm ${hasCustomCost ? "text-slate-400 line-through" : "text-slate-600 font-medium"}`}>
                  ¥{calculatedInsurance.yearlyCost.toLocaleString()}{t.insurance.perYear}
                </span>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hasCustomCost}
                    onChange={(e) =>
                      setInsuranceParams({
                        customYearlyCost: e.target.checked ? calculatedInsurance.yearlyCost : null
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    {t.insurance.useCustomCost}
                  </span>
                </label>
              </div>
              {hasCustomCost && (
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={insuranceParams.customYearlyCost ?? 0}
                      onChange={(e) =>
                        setInsuranceParams({ customYearlyCost: Number(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm bg-emerald-50"
                      min={0}
                      step={100}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {t.insurance.perYear}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">{t.insurance.customCostHint}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">{t.fuel.monthlyCost}</span>
              <span className="text-lg font-bold text-slate-800">
                ¥{costSummary.insurance.monthlyCost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-slate-500">{t.fuel.yearlyCost}</span>
              <span className="text-sm font-medium text-slate-600">
                ¥{costSummary.insurance.yearlyCost.toLocaleString()}
              </span>
            </div>
            {isElectric && (
              <p className="text-xs text-amber-600 mt-2">
                {t.insurance.evSurchargeNote}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
