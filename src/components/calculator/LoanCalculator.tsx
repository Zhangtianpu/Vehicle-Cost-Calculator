import { Banknote } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LOAN_TERM_OPTIONS } from "@/utils/constants";

export default function LoanCalculator() {
  const { loanParams, setLoanParams, loanResult, costSummary, moduleToggle, setModuleToggle, setVehiclePrice } = useVehicleStore();
  const { t } = useLanguageStore();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ${!moduleToggle.loan ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{t.loan.title}</h2>
            <p className="text-xs text-slate-400">{t.loan.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setModuleToggle({ loan: !moduleToggle.loan })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            moduleToggle.loan ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              moduleToggle.loan ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {moduleToggle.loan && (
        <>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.loan.vehiclePrice}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanParams.vehiclePrice}
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

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.loan.downPaymentRatio}
              </label>
              <input
                type="range"
                value={loanParams.downPaymentRatio * 100}
                onChange={(e) =>
                  setLoanParams({ downPaymentRatio: Number(e.target.value) / 100 })
                }
                min={10}
                max={90}
                step={5}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10%</span>
                <span className="text-emerald-600 font-medium">
                  {Math.round(loanParams.downPaymentRatio * 100)}% (
                  ¥{Math.round(loanParams.vehiclePrice * loanParams.downPaymentRatio).toLocaleString()})
                </span>
                <span>90%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.loan.loanTerm}
              </label>
              <div className="flex flex-wrap gap-2">
                {LOAN_TERM_OPTIONS.map((months) => (
                  <button
                    key={months}
                    onClick={() => setLoanParams({ loanTermMonths: months })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      loanParams.loanTermMonths === months
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {months}{t.loan.periods}({months / 12}{t.insurance.year})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                {t.loan.annualRate}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanParams.annualRate}
                  onChange={(e) =>
                    setLoanParams({ annualRate: Number(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                  min={0}
                  max={20}
                  step={0.1}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2.5">
                {t.loan.repaymentMethod}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setLoanParams({ repaymentMethod: "equal_installment" })
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loanParams.repaymentMethod === "equal_installment"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.loan.equalInstallment}
                </button>
                <button
                  onClick={() =>
                    setLoanParams({ repaymentMethod: "equal_principal" })
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    loanParams.repaymentMethod === "equal_principal"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.loan.equalPrincipal}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t.loan.monthlyPayment}</p>
                <p className="text-lg font-bold text-slate-800">
                  ¥{loanResult.monthlyPayment.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t.loan.loanAmount}</p>
                <p className="text-sm font-medium text-slate-600">
                  ¥{loanResult.loanAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t.loan.totalInterest}</p>
                <p className="text-sm font-medium text-orange-600">
                  ¥{loanResult.totalInterest.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">{t.loan.totalPayment}</p>
                <p className="text-sm font-medium text-slate-600">
                  ¥{loanResult.totalPayment.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500">{t.loan.monthlyCost}</span>
              <span className="text-lg font-bold text-slate-800">
                ¥{costSummary.loan.monthlyCost.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
