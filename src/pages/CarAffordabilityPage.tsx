import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeDollarSign, ExternalLink, Info, TriangleAlert } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateCarAffordability } from "@/utils/quickTools";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

const termOptions = [36, 48, 60, 72];

export default function CarAffordabilityPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [monthlyTakeHomeIncome, setMonthlyTakeHomeIncome] = useState(6000);
  const [transportationBudgetPercent, setTransportationBudgetPercent] = useState(15);
  const [monthlyInsurance, setMonthlyInsurance] = useState(150);
  const [monthlyEnergy, setMonthlyEnergy] = useState(150);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(75);
  const [monthlyParking, setMonthlyParking] = useState(50);
  const [monthlyRegistration, setMonthlyRegistration] = useState(25);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(3000);
  const [tradeInPayoff, setTradeInPayoff] = useState(1000);
  const [annualRate, setAnnualRate] = useState(6);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [salesTaxPercent, setSalesTaxPercent] = useState(8);
  const [upfrontFees, setUpfrontFees] = useState(1000);

  const result = useMemo(() => calculateCarAffordability({
    monthlyTakeHomeIncome,
    transportationBudgetPercent,
    monthlyInsurance,
    monthlyEnergy,
    monthlyMaintenance,
    monthlyParking,
    monthlyRegistration,
    downPayment,
    tradeInValue,
    tradeInPayoff,
    annualRate,
    loanTermMonths,
    salesTaxPercent,
    upfrontFees,
  }), [monthlyTakeHomeIncome, transportationBudgetPercent, monthlyInsurance, monthlyEnergy, monthlyMaintenance, monthlyParking, monthlyRegistration, downPayment, tradeInValue, tradeInPayoff, annualRate, loanTermMonths, salesTaxPercent, upfrontFees]);

  const symbol = currencySymbols[currency];
  const formatMoney = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <BadgeDollarSign className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {isZh ? "汽车购买力计算器：我能买多少钱的车？" : "Car Affordability Calculator: How Much Car Can I Afford?"}
          </h1>
        </div>
        <p className="max-w-3xl leading-relaxed text-slate-600">
          {isZh
            ? "从税后收入和完整的每月用车预算反推可承受的最高车价，并计入保险、能源、保养、停车、税费、首付和置换净值。"
            : "Work backward from take-home income and a complete monthly vehicle budget to estimate a maximum car price, including insurance, energy, maintenance, parking, tax, fees, down payment and net trade-in."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800">{isZh ? "收入与每月预算" : "Income and monthly budget"}</h2>
            <div>
              <label className="sr-only" htmlFor="affordability-currency">{isZh ? "币种" : "Currency"}</label>
              <select id="affordability-currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                {(Object.keys(currencySymbols) as CurrencyCode[]).map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="affordability-income" label={isZh ? "每月税后收入" : "Monthly take-home income"} value={monthlyTakeHomeIncome} onChange={setMonthlyTakeHomeIncome} suffix={`${symbol}/mo`} step={100} hint={isZh ? "使用扣除税款和工资扣款后实际到账的稳定收入。" : "Use stable income after taxes and payroll deductions."} />
            <NumberField id="affordability-budget-rate" label={isZh ? "交通预算占收入比例" : "Transportation budget share"} value={transportationBudgetPercent} onChange={setTransportationBudgetPercent} suffix="%" min={0} max={100} step={1} hint={isZh ? "这是可调整的规划上限，不是贷款审批标准。" : "This is your adjustable planning limit, not a lending standard."} />
            <NumberField id="affordability-insurance" label={isZh ? "每月保险" : "Monthly insurance"} value={monthlyInsurance} onChange={setMonthlyInsurance} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="affordability-energy" label={isZh ? "每月燃油或充电" : "Monthly gas or charging"} value={monthlyEnergy} onChange={setMonthlyEnergy} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="affordability-maintenance" label={isZh ? "每月保养维修准备金" : "Monthly maintenance reserve"} value={monthlyMaintenance} onChange={setMonthlyMaintenance} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="affordability-parking" label={isZh ? "每月停车与通行费" : "Monthly parking and tolls"} value={monthlyParking} onChange={setMonthlyParking} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="affordability-registration" label={isZh ? "月均登记与检验" : "Monthly registration share"} value={monthlyRegistration} onChange={setMonthlyRegistration} suffix={`${symbol}/mo`} step={5} />
          </div>

          <h2 className="mb-5 mt-8 border-t border-slate-100 pt-6 text-lg font-semibold text-slate-800">{isZh ? "购车与贷款参数" : "Purchase and loan inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="affordability-down" label={isZh ? "现金首付" : "Cash down payment"} value={downPayment} onChange={setDownPayment} suffix={symbol} step={500} />
            <NumberField id="affordability-trade" label={isZh ? "置换车辆估值" : "Trade-in value"} value={tradeInValue} onChange={setTradeInValue} suffix={symbol} step={500} />
            <NumberField id="affordability-payoff" label={isZh ? "置换车未偿贷款" : "Trade-in loan payoff"} value={tradeInPayoff} onChange={setTradeInPayoff} suffix={symbol} step={500} hint={isZh ? "若高于置换估值，差额为负资产。" : "If this exceeds trade value, the difference is negative equity."} />
            <NumberField id="affordability-rate" label={isZh ? "贷款年利率 APR" : "Loan APR"} value={annualRate} onChange={setAnnualRate} suffix="%" min={0} max={50} step={0.1} />
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">{isZh ? "贷款期限" : "Loan term"}</p>
              <div className="flex flex-wrap gap-2">
                {termOptions.map((months) => (
                  <button key={months} type="button" aria-pressed={loanTermMonths === months} onClick={() => setLoanTermMonths(months)} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${loanTermMonths === months ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {months}{isZh ? " 个月" : " mo"}
                  </button>
                ))}
              </div>
            </div>
            <NumberField id="affordability-tax" label={isZh ? "销售税率" : "Sales tax rate"} value={salesTaxPercent} onChange={setSalesTaxPercent} suffix="%" min={0} max={50} step={0.1} hint={isZh ? "若报价已含税，请填 0。" : "Enter 0 if the vehicle price you compare already includes tax."} />
            <NumberField id="affordability-fees" label={isZh ? "牌照、文件及其他前期费用" : "Title, document and upfront fees"} value={upfrontFees} onChange={setUpfrontFees} suffix={symbol} step={100} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm text-slate-300">{isZh ? "税前最高车辆价格" : "Maximum vehicle price before tax"}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{formatMoney(result.maxVehiclePrice)}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{isZh ? "使完整月度交通支出不超过您设定预算的估算价格。" : "Estimated price that keeps the complete monthly transportation cost within your chosen budget."}</p>
          </div>

          {result.operatingCostOverBudget > 0 && (
            <div className="flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{isZh ? `仅运营费用已超出月度目标 ${formatMoney(result.operatingCostOverBudget)}，因此当前参数下没有可用购车预算。` : `Operating costs alone exceed your monthly target by ${formatMoney(result.operatingCostOverBudget)}, so no vehicle price fits the current inputs.`}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "完整交通预算" : "Total vehicle budget"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{formatMoney(result.transportationBudgetMonthly)}<span className="text-xs font-normal text-slate-400">/mo</span></p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "非贷款月成本" : "Non-loan costs"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{formatMoney(result.nonLoanCostsMonthly)}<span className="text-xs font-normal text-slate-400">/mo</span></p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "最高月供" : "Maximum payment"}</p><p className="mt-1 text-lg font-semibold text-emerald-700">{formatMoney(result.maxLoanPayment)}<span className="text-xs font-normal text-slate-400">/mo</span></p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "最高贷款本金" : "Maximum loan"}</p><p className="mt-1 text-lg font-semibold text-slate-800">{formatMoney(result.maxLoanAmount)}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "贷款总利息" : "Total loan interest"}</p><p className="mt-1 text-lg font-semibold text-orange-600">{formatMoney(result.totalInterest)}</p></div>
            <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{isZh ? "置换净值" : "Net trade-in"}</p><p className={`mt-1 text-lg font-semibold ${result.netTradeIn < 0 ? "text-rose-600" : "text-slate-800"}`}>{formatMoney(result.netTradeIn)}</p></div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex justify-between gap-3"><span>{isZh ? "月供 / 税后收入" : "Payment / take-home income"}</span><strong>{result.paymentToIncomePercent === null ? "—" : `${result.paymentToIncomePercent.toFixed(1)}%`}</strong></div>
            <div className="mt-2 flex justify-between gap-3"><span>{isZh ? "完整车费 / 税后收入" : "All vehicle costs / income"}</span><strong>{result.totalCostToIncomePercent === null ? "—" : `${result.totalCostToIncomePercent.toFixed(1)}%`}</strong></div>
          </div>
        </aside>
      </div>

      <article className="mt-9 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "汽车购买力是怎么计算的？" : "How this car affordability calculation works"}</h2>
          <p>{isZh ? "先用税后收入乘以您选择的交通预算比例，再减去保险、能源、保养、停车和登记费用，得到可用于月供的金额。随后根据 APR 和期限反算贷款本金，最后加入首付与置换净值，并扣除税费。" : "The calculator multiplies take-home income by your chosen transportation budget share, then subtracts insurance, energy, maintenance, parking and registration to find room for a payment. It converts that payment into loan principal using APR and term, adds cash and net trade-in, and accounts for tax and fees."}</p>
          <div className="mt-3 space-y-2 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-emerald-300">
            <p>{isZh ? "最高月供 = 月度交通预算 − 非贷款月成本" : "Maximum payment = monthly vehicle budget − non-loan monthly costs"}</p>
            <p>{isZh ? "置换净值 = 置换估值 − 未偿贷款" : "Net trade-in = trade value − loan payoff"}</p>
            <p>{isZh ? "最高税前车价 =（贷款本金 + 首付 + 置换净值 − 前期费用）÷（1 + 税率）" : "Maximum pre-tax price = (loan + down payment + net trade-in − fees) ÷ (1 + tax rate)"}</p>
          </div>
        </section>

        <section className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{isZh ? "预算比例只是压力测试假设，不是适合所有人的规则，也不是贷款资格判断。租金、其他债务、储蓄目标、收入稳定性和应急金都可能要求更低的车费预算。" : "The budget percentage is a stress-test assumption, not a universal rule or lending decision. Housing, other debt, savings goals, income stability and emergency reserves may justify a lower vehicle budget."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "应该用税前收入还是税后收入？" : "Should I use gross or take-home income?"}</summary><p className="mt-2">{isZh ? "本工具使用税后实际到账收入，因为车辆费用最终由可支配现金支付。若收入波动，请使用保守的多月平均值。" : "This tool uses take-home income because vehicle costs are paid from spendable cash. If income varies, use a conservative multi-month average."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "为什么结果可能低于经销商说我能买的车价？" : "Why might this be lower than a dealer's number?"}</summary><p className="mt-2">{isZh ? "贷款批准额度关注还款资格，本工具关注包含保险、能源和保养后的个人预算。能获批不等于长期持有舒适。" : "A credit approval focuses on qualification; this estimate focuses on your personal budget after insurance, energy and maintenance. Approval does not necessarily mean comfortable ownership."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "置换车有负资产会怎样？" : "What happens with negative trade-in equity?"}</summary><p className="mt-2">{isZh ? "当未偿贷款高于置换估值，差额会降低可购买车价。若把差额滚入新贷款，还会增加利息并提高贷款价值比。" : "When payoff exceeds trade value, the difference reduces the affordable price. Rolling it into a new loan also increases interest and the loan-to-value ratio."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "更长期限能让我买更贵的车吗？" : "Does a longer term make a more expensive car affordable?"}</summary><p className="mt-2">{isZh ? "它会提高同一月供对应的贷款本金，但通常也会增加总利息，并延长负资产风险期。应同时比较总利息，而不是只看月供。" : "It can increase principal at the same payment, but usually raises total interest and extends the period of negative-equity risk. Compare total interest, not payment alone."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "这是贷款报价或财务建议吗？" : "Is this a loan quote or financial advice?"}</summary><p className="mt-2">{isZh ? "不是。这是基于您输入的预算估算，不代表贷款审批、保险报价、税务结果或个性化财务建议。" : "No. It is a budgeting estimate from your inputs, not a credit approval, insurance quote, tax result or personalized financial advice."}</p></details>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "核对预算和贷款的权威来源" : "Primary sources for checking your budget and loan"}</h2>
          <ul className="space-y-2">
            {[
              ["Consumer Financial Protection Bureau — How much can I afford to borrow?", "https://www.consumerfinance.gov/ask-cfpb/how-much-can-i-afford-to-borrow-for-a-car-or-auto-loan-en-751/"],
              ["Consumer Financial Protection Bureau — Compare auto-loan offers", "https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/"],
              ["Federal Trade Commission — Financing or leasing a car", "https://consumer.ftc.gov/articles/financing-or-leasing-car"],
              ["Consumer.gov — Getting a car loan", "https://consumer.gov/cars/getting-car-loan"],
            ].map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-700 underline"><span>{label}</span><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></li>)}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/car-loan" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "按具体车价计算月供" : "Calculate payment for a specific price"}</Link>
          <Link to="/tools/monthly-car-cost" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "核对完整每月养车成本" : "Check complete monthly car cost"}</Link>
        </div>
      </article>
    </div>
  );
}
