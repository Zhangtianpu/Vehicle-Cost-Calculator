import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Banknote, Info } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateCarLoan } from "@/utils/quickTools";
import type { LoanParams } from "@/types";

const TERM_OPTIONS = [12, 24, 36, 48, 60];

export default function CarLoanPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const currency = isZh ? "¥" : "$";
  const [vehiclePrice, setVehiclePrice] = useState(30000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const [annualRate, setAnnualRate] = useState(4.8);
  const [repaymentMethod, setRepaymentMethod] = useState<LoanParams["repaymentMethod"]>("equal_installment");
  const result = useMemo(
    () => calculateCarLoan({ vehiclePrice, downPaymentPercent, loanTermMonths, annualRate, repaymentMethod }),
    [vehiclePrice, downPaymentPercent, loanTermMonths, annualRate, repaymentMethod],
  );
  const comparison = useMemo(
    () => calculateCarLoan({
      vehiclePrice,
      downPaymentPercent,
      loanTermMonths,
      annualRate,
      repaymentMethod: repaymentMethod === "equal_installment" ? "equal_principal" : "equal_installment",
    }),
    [vehiclePrice, downPaymentPercent, loanTermMonths, annualRate, repaymentMethod],
  );
  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
  const isEqualInstallment = repaymentMethod === "equal_installment";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <div className="mb-2 flex items-center gap-3">
          <Banknote className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "车贷月供计算器" : "Car Loan Payment Calculator"}</h1>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh
            ? "按车辆价格、首付比例、贷款期限、名义年利率和还款方式，计算贷款金额、月供或首月还款、总利息与购车现金支出。"
            : "Use vehicle price, down payment, term, nominal annual rate and repayment method to estimate monthly payment, total interest and total cash outlay."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "贷款参数" : "Loan inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="loan-vehicle-price" label={isZh ? "车辆价格" : "Vehicle price"} value={vehiclePrice} onChange={setVehiclePrice} suffix={isZh ? "元" : "USD"} step={1000} />
            <NumberField id="loan-down-payment" label={isZh ? "首付比例" : "Down payment"} value={downPaymentPercent} onChange={setDownPaymentPercent} suffix="%" min={0} max={100} step={5} />
            <NumberField id="loan-rate" label={isZh ? "名义年利率" : "Nominal annual rate"} value={annualRate} onChange={setAnnualRate} suffix="%" min={0} max={50} step={0.1} hint={isZh ? "请输入贷款合同中的年利率，不是手续费率。" : "Use the annual interest rate stated in the loan offer, not a separate fee rate."} />
            <div>
              <p className="mb-1.5 block text-sm font-medium text-slate-700">{isZh ? "贷款期限" : "Loan term"}</p>
              <div className="flex flex-wrap gap-2">
                {TERM_OPTIONS.map((months) => (
                  <button
                    key={months}
                    type="button"
                    aria-pressed={loanTermMonths === months}
                    onClick={() => setLoanTermMonths(months)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition ${loanTermMonths === months ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {months}{isZh ? "期" : " mo"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-sm font-medium text-slate-700">{isZh ? "还款方式" : "Repayment method"}</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={isEqualInstallment} onClick={() => setRepaymentMethod("equal_installment")} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${isEqualInstallment ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{isZh ? "等额本息" : "Equal installment"}</button>
              <button type="button" aria-pressed={!isEqualInstallment} onClick={() => setRepaymentMethod("equal_principal")} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${!isEqualInstallment ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{isZh ? "等额本金" : "Equal principal"}</button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">{isEqualInstallment ? (isZh ? "预计每月还款" : "Estimated monthly payment") : (isZh ? "预计首月还款" : "Estimated first payment")}</p>
            <p className="mt-1 text-4xl font-bold text-emerald-400">{currency}{number(result.monthlyPayment, 2)}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{isEqualInstallment ? (isZh ? "等额本息在利率不变时每期金额相同。" : "Equal installments remain level when the rate does not change.") : (isZh ? "等额本金逐月递减，这里显示首月金额。" : "Equal-principal payments decline; this is the first payment.")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "首付金额" : "Down payment"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.downPayment)}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "贷款金额" : "Loan amount"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.loanAmount)}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "贷款总利息" : "Total interest"}</p><p className="mt-1 text-lg font-semibold text-orange-600">{currency}{number(result.totalInterest, 2)}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "贷款本息合计" : "Loan repayments"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.totalPayment, 2)}</p></div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs text-emerald-700">{isZh ? "首付 + 贷款本息" : "Down payment + loan repayments"}</p>
            <p className="mt-1 text-xl font-semibold text-emerald-800">{currency}{number(result.totalCashOutlay, 2)}</p>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "估算未包含金融服务费、抵押登记、强制搭售、提前还款费用或利率变化。签约前应以贷款方提供的完整还款计划为准。" : "The estimate excludes service fees, registration, bundled products, prepayment charges and rate changes. Verify the lender's full repayment schedule before signing."}</p>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "车贷月供怎么计算？" : "How is a car-loan payment calculated?"}</h2>
          <p>{isZh ? "贷款金额等于车辆价格减去首付。等额本息把本金和利息分摊到每一期；等额本金每期偿还相同本金，利息按剩余本金计算，因此首月金额较高并逐月下降。" : "Loan amount equals vehicle price minus down payment. Equal installment spreads principal and interest across level payments; equal principal repays the same principal each month while interest declines with the balance."}</p>
          <div className="mt-3 space-y-1 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">
            <p>{isZh ? "贷款金额 = 车辆价格 ×（1 − 首付比例）" : "Loan amount = vehicle price × (1 − down-payment rate)"}</p>
            <p>{isZh ? "月利率 = 名义年利率 ÷ 12" : "Monthly rate = nominal annual rate ÷ 12"}</p>
            <p>{isZh ? "现金支出合计 = 首付 + 贷款本金 + 总利息" : "Total cash outlay = down payment + loan principal + total interest"}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "等额本息和等额本金有什么区别？" : "Equal installment vs equal principal"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-slate-500"><th className="px-3 py-2 font-medium">{isZh ? "项目" : "Feature"}</th><th className="px-3 py-2 font-medium">{isZh ? "等额本息" : "Equal installment"}</th><th className="px-3 py-2 font-medium">{isZh ? "等额本金" : "Equal principal"}</th></tr></thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">{isZh ? "每期金额" : "Payment pattern"}</td><td className="px-3 py-2">{isZh ? "通常相同" : "Usually level"}</td><td className="px-3 py-2">{isZh ? "首期最高，逐期下降" : "Highest first, then declines"}</td></tr>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">{isZh ? "前期压力" : "Early cash burden"}</td><td className="px-3 py-2">{isZh ? "相对稳定" : "More stable"}</td><td className="px-3 py-2">{isZh ? "相对较高" : "Relatively higher"}</td></tr>
                <tr><td className="px-3 py-2">{isZh ? "当前参数总利息" : "Interest with current inputs"}</td><td className="px-3 py-2 font-medium text-slate-800">{currency}{number(isEqualInstallment ? result.totalInterest : comparison.totalInterest, 2)}</td><td className="px-3 py-2 font-medium text-slate-800">{currency}{number(isEqualInstallment ? comparison.totalInterest : result.totalInterest, 2)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "不要只看“低月供”" : "Do not compare offers by payment alone"}</h2>
          <p>{isZh ? "较低月供可能来自更高首付、更长期限或尾款安排，并不等于总成本更低。比较报价时应统一车辆价格、首付、期限和还款方式，再核对总利息、所有手续费、是否捆绑保险以及提前还款条款。" : "A lower payment may come from a larger down payment, longer term or balloon payment. Compare offers using the same price, down payment, term and method, then review total interest, fees, bundled products and prepayment terms."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "0 利率车贷真的没有成本吗？" : "Is a zero-interest car loan always free?"}</summary><p className="mt-2">{isZh ? "利息可以为 0，但仍需检查金融服务费、车辆优惠差异、捆绑产品和提前还款条件。将所有不可退费用加入总现金支出再比较。" : "Interest may be zero, but fees, lost discounts, bundled products and prepayment terms can still add cost. Compare total cash outlay."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "首付 100% 时为什么月供为 0？" : "Why is payment zero at 100% down?"}</summary><p className="mt-2">{isZh ? "因为没有贷款本金，全部车辆价格在购车时支付。" : "There is no financed principal; the full vehicle price is paid up front."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "计算结果能作为贷款报价吗？" : "Is this a loan quote?"}</summary><p className="mt-2">{isZh ? "不能。它是按输入参数计算的预算结果，不代表任何金融机构审批、费率或合同条件。" : "No. It is a budgeting estimate based on your inputs, not an approval, rate offer or contract from a lender."}</p></details>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/car-affordability" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "先算我能买多少钱的车" : "See how much car I can afford"}</Link>
          <Link to="/calculator" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "把月供加入完整用车预算" : "Add payments to full ownership budget"}</Link>
          <Link to="/tools/depreciation" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "计算车辆折旧" : "Calculate vehicle depreciation"}</Link>
        </div>
      </article>
    </div>
  );
}
