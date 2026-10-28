import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, ExternalLink, Info } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateLeaseVsBuy } from "@/utils/quickTools";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

const comparisonTerms = [24, 36, 48];
const loanTerms = [36, 48, 60, 72];

export default function LeaseVsBuyPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [comparisonMonths, setComparisonMonths] = useState(36);
  const [purchasePrice, setPurchasePrice] = useState(40000);
  const [buyDownPayment, setBuyDownPayment] = useState(5000);
  const [buyTaxAndFees, setBuyTaxAndFees] = useState(3500);
  const [loanAnnualRate, setLoanAnnualRate] = useState(6);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [estimatedResaleValue, setEstimatedResaleValue] = useState(25000);
  const [buyOtherCosts, setBuyOtherCosts] = useState(500);
  const [leaseMonthlyPayment, setLeaseMonthlyPayment] = useState(500);
  const [leaseDueAtSigning, setLeaseDueAtSigning] = useState(3000);
  const [leaseAcquisitionFee, setLeaseAcquisitionFee] = useState(695);
  const [leaseDispositionFee, setLeaseDispositionFee] = useState(395);
  const [leaseEndCharges, setLeaseEndCharges] = useState(500);

  const result = useMemo(() => calculateLeaseVsBuy({
    purchasePrice,
    buyDownPayment,
    buyTaxAndFees,
    loanAnnualRate,
    loanTermMonths,
    comparisonMonths,
    estimatedResaleValue,
    buyOtherCosts,
    leaseMonthlyPayment,
    leaseDueAtSigning,
    leaseAcquisitionFee,
    leaseDispositionFee,
    leaseEndCharges,
  }), [purchasePrice, buyDownPayment, buyTaxAndFees, loanAnnualRate, loanTermMonths, comparisonMonths, estimatedResaleValue, buyOtherCosts, leaseMonthlyPayment, leaseDueAtSigning, leaseAcquisitionFee, leaseDispositionFee, leaseEndCharges]);

  const symbol = currencySymbols[currency];
  const formatMoney = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  const choice = result.lowerCostChoice === "buy"
    ? isZh ? "购买" : "Buying"
    : result.lowerCostChoice === "lease"
      ? isZh ? "租赁" : "Leasing"
      : isZh ? "两者" : "Both options";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <ArrowLeftRight className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "汽车租赁还是购买计算器" : "Lease vs Buy Car Calculator"}</h1>
        </div>
        <p className="max-w-3xl leading-relaxed text-slate-600">
          {isZh
            ? "在相同用车周期内比较租赁总支出与购买净成本，购买侧计入贷款余额和期末车辆净值，租赁侧计入签约及返还费用。"
            : "Compare lease cash outlay with the net cost of buying over the same period. The buying side includes remaining loan balance and vehicle equity; the lease side includes signing and return charges."}
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">{isZh ? "统一比较周期" : "Same comparison period"}</p>
          <div className="flex flex-wrap gap-2">
            {comparisonTerms.map((months) => <button key={months} type="button" aria-pressed={comparisonMonths === months} onClick={() => setComparisonMonths(months)} className={`rounded-lg px-4 py-2 text-sm font-medium ${comparisonMonths === months ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{months}{isZh ? " 个月" : " months"}</button>)}
          </div>
        </div>
        <div>
          <label className="sr-only" htmlFor="lease-buy-currency">{isZh ? "币种" : "Currency"}</label>
          <select id="lease-buy-currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            {(Object.keys(currencySymbols) as CurrencyCode[]).map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "购买并贷款" : "Buy and finance"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="lease-buy-price" label={isZh ? "车辆成交价" : "Vehicle purchase price"} value={purchasePrice} onChange={setPurchasePrice} suffix={symbol} step={1000} />
            <NumberField id="lease-buy-down" label={isZh ? "购买首付" : "Buy down payment"} value={buyDownPayment} onChange={setBuyDownPayment} suffix={symbol} step={500} />
            <NumberField id="lease-buy-tax-fees" label={isZh ? "购买税费（现金支付）" : "Buy taxes and fees paid upfront"} value={buyTaxAndFees} onChange={setBuyTaxAndFees} suffix={symbol} step={100} hint={isZh ? "若已包含在成交价或贷款中，请勿重复填写。" : "Do not repeat amounts already included in the price or loan."} />
            <NumberField id="lease-buy-apr" label={isZh ? "贷款 APR" : "Loan APR"} value={loanAnnualRate} onChange={setLoanAnnualRate} suffix="%" min={0} max={50} step={0.1} />
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">{isZh ? "贷款期限" : "Loan term"}</p>
              <div className="flex flex-wrap gap-2">{loanTerms.map((months) => <button key={months} type="button" aria-pressed={loanTermMonths === months} onClick={() => setLoanTermMonths(months)} className={`rounded-lg px-3 py-2 text-xs font-medium ${loanTermMonths === months ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{months}{isZh ? " 个月" : " mo"}</button>)}</div>
            </div>
            <NumberField id="lease-buy-resale" label={isZh ? `${comparisonMonths} 个月后预计售价` : `Estimated resale after ${comparisonMonths} months`} value={estimatedResaleValue} onChange={setEstimatedResaleValue} suffix={symbol} step={500} hint={isZh ? "使用保守的净出售金额，而不是挂牌价。" : "Use conservative net sale proceeds, not an asking price."} />
            <NumberField id="lease-buy-other" label={isZh ? "购买侧额外成本" : "Buy-only additional costs"} value={buyOtherCosts} onChange={setBuyOtherCosts} suffix={symbol} step={100} hint={isZh ? "只填租赁方案没有的保养、登记或处置成本。" : "Only costs not shared with the lease, such as extra maintenance or disposal."} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "租赁并到期归还" : "Lease and return at term end"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="lease-payment" label={isZh ? "含税月租" : "Monthly lease payment incl. tax"} value={leaseMonthlyPayment} onChange={setLeaseMonthlyPayment} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="lease-signing" label={isZh ? "签约时支付（不含首期月租）" : "Due at signing, excluding first payment"} value={leaseDueAtSigning} onChange={setLeaseDueAtSigning} suffix={symbol} step={100} hint={isZh ? "包括不可退的首付款或资本化成本降低额。" : "Include nonrefundable down payment or capitalized-cost reduction."} />
            <NumberField id="lease-acquisition" label={isZh ? "租赁取得费" : "Acquisition fee"} value={leaseAcquisitionFee} onChange={setLeaseAcquisitionFee} suffix={symbol} step={50} hint={isZh ? "若已含在签约款或月租中，请填 0。" : "Enter 0 if already included at signing or in the payment."} />
            <NumberField id="lease-disposition" label={isZh ? "到期处置费" : "Disposition fee"} value={leaseDispositionFee} onChange={setLeaseDispositionFee} suffix={symbol} step={50} />
            <NumberField id="lease-end" label={isZh ? "预计超里程、磨损等返还费用" : "Expected mileage, wear and return charges"} value={leaseEndCharges} onChange={setLeaseEndCharges} suffix={symbol} step={100} hint={isZh ? "不确定时分别测试 0 和保守金额。" : "If uncertain, test both zero and a conservative amount."} />
          </div>
          <div className="mt-5 flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "本比较假设租赁到期归还车辆，不执行买断。若计划买断，应把残值、买断税费和后续融资作为另一种方案单独比较。" : "This comparison assumes the vehicle is returned, not bought at lease end. If you plan to buy it, compare the residual, purchase-option fees, taxes and new financing as a separate scenario."}</p>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">{isZh ? `${comparisonMonths} 个月净成本结果` : `${comparisonMonths}-month net-cost result`}</p>
        <p className="mt-1 text-2xl font-bold text-emerald-400">{result.lowerCostChoice === "equal" ? (isZh ? "两种方案的估算净成本基本相同" : "Estimated net costs are effectively equal") : `${choice}${isZh ? "估算少花" : " costs about"} ${formatMoney(result.difference)}${isZh ? "" : " less"}`}</p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">{isZh ? "结果取决于期末转售价、贷款条件和租赁返还费用。至少测试保守、中性和乐观三种转售价。" : "The result depends heavily on resale value, loan terms and lease-return charges. Test conservative, middle and optimistic resale values."}</p>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        <div className={`rounded-xl border bg-white p-5 ${result.lowerCostChoice === "buy" ? "border-emerald-400 ring-2 ring-emerald-100" : "border-slate-200"}`}>
          <h2 className="text-lg font-semibold text-slate-800">{isZh ? "购买净成本" : "Buy net cost"}</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">{formatMoney(result.buyNetCost)}</p>
          <p className="text-sm text-slate-500">{formatMoney(result.buyMonthlyEquivalent, 2)}/{isZh ? "月" : "mo equivalent"}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "贷款月供" : "Loan payment"}</dt><dd className="font-medium text-slate-800">{formatMoney(result.buyMonthlyPayment, 2)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "期间已付现金" : "Cash paid during period"}</dt><dd className="font-medium text-slate-800">{formatMoney(result.buyCashPaid)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "期间贷款利息" : "Loan interest during period"}</dt><dd className="font-medium text-orange-600">{formatMoney(result.buyInterestPaid)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "期末剩余贷款" : "Remaining loan balance"}</dt><dd className="font-medium text-slate-800">{formatMoney(result.remainingLoanBalance)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "期末车辆净值" : "Vehicle equity at end"}</dt><dd className={`font-medium ${result.buyerEquity < 0 ? "text-rose-600" : "text-emerald-700"}`}>{formatMoney(result.buyerEquity)}</dd></div>
          </dl>
        </div>

        <div className={`rounded-xl border bg-white p-5 ${result.lowerCostChoice === "lease" ? "border-emerald-400 ring-2 ring-emerald-100" : "border-slate-200"}`}>
          <h2 className="text-lg font-semibold text-slate-800">{isZh ? "租赁总成本" : "Lease total cost"}</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">{formatMoney(result.leaseTotalCost)}</p>
          <p className="text-sm text-slate-500">{formatMoney(result.leaseMonthlyEquivalent, 2)}/{isZh ? "月" : "mo equivalent"}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "广告月租" : "Advertised monthly payment"}</dt><dd className="font-medium text-slate-800">{formatMoney(leaseMonthlyPayment, 2)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "签约款与取得费" : "Signing and acquisition"}</dt><dd className="font-medium text-slate-800">{formatMoney(leaseDueAtSigning + leaseAcquisitionFee)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "预计到期费用" : "Expected end charges"}</dt><dd className="font-medium text-orange-600">{formatMoney(leaseDispositionFee + leaseEndCharges)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">{isZh ? "期末车辆净值" : "Vehicle equity at end"}</dt><dd className="font-medium text-slate-800">{formatMoney(0)}</dd></div>
          </dl>
        </div>
      </section>

      <article className="mt-8 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "为什么不能只比较月供？" : "Why monthly payments are not enough"}</h2>
          <p>{isZh ? "租赁月租通常较低，因为主要支付租期内折旧、租金费用和税费，归还后通常没有车辆净值。购买月供较高，但会偿还本金并形成车辆净值。因此必须把两种方案放在同一周期内，用现金支出加剩余贷款、再减去车辆售价来比较。" : "Lease payments are often lower because they mainly cover depreciation during the term, rent charges, taxes and fees; returning the car usually leaves no equity. Loan payments are higher but reduce principal and build vehicle equity. Compare both over the same period using cash paid plus remaining debt minus resale value."}</p>
          <div className="mt-3 space-y-2 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-emerald-300">
            <p>{isZh ? "购买净成本 = 期间现金支出 + 剩余贷款 − 预计售价" : "Buy net cost = cash paid + remaining loan − estimated resale value"}</p>
            <p>{isZh ? "租赁总成本 = 签约款 + 全部月租 + 取得费 + 到期费用" : "Lease cost = signing cash + all payments + acquisition fee + end charges"}</p>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <h2 className="mb-1 font-semibold">{isZh ? "统一成本口径" : "Keep the comparison apples-to-apples"}</h2>
          <p>{isZh ? "保险、燃油或充电、停车等两种方案相同的费用可以同时省略；若某项确实不同，只把差额填入对应的额外成本。税费、租赁首付款和取得费是否已包含在报价中因地区与合同而异，避免重复填写。" : "Shared insurance, energy and parking costs can be omitted from both sides. If a cost truly differs, enter only the difference. Tax treatment and whether signing or acquisition fees are already embedded vary by location and contract, so avoid double-counting."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "租赁首付款为什么要计入全部成本？" : "Why count the lease down payment in full?"}</summary><p className="mt-2">{isZh ? "它降低月租但不是您拥有的车辆净值，通常也不会在租赁提前终止或车辆全损时像存款一样退还。应把它作为不可退现金支出核对合同。" : "It lowers the payment but does not create vehicle equity and generally is not a refundable deposit. Treat it as cash spent and verify contract treatment, especially after early termination or a total loss."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "期末转售价应该填多少？" : "How should I estimate resale value?"}</summary><p className="mt-2">{isZh ? "使用同年款、里程和车况的保守净成交价，并扣除出售费用。至少测试三个数值，因为折旧通常是结果最敏感的变量。" : "Use conservative net proceeds for the expected age, mileage and condition, after selling costs. Test at least three values because depreciation is often the most sensitive assumption."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "里程超限怎么处理？" : "How do I handle excess mileage?"}</summary><p className="mt-2">{isZh ? "用预计超限里程乘以合同每英里或每公里收费，再加预计磨损费，填入租赁到期费用。" : "Multiply expected excess distance by the contract charge per mile or kilometer, add expected wear charges, and enter the total as lease-end charges."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "结果包含租赁买断吗？" : "Does this include buying the car at lease end?"}</summary><p className="mt-2">{isZh ? "不包含。本场景假设到期归还。买断需要加入合同残值、买断费用、税费和可能的新贷款，应作为独立情景计算。" : "No. This scenario assumes return at term end. A buyout adds the contractual residual, option fees, taxes and possibly another loan, so model it separately."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "哪个选择一定更好？" : "Is one option always better?"}</summary><p className="mt-2">{isZh ? "不是。成本之外还涉及里程限制、提前终止风险、车辆更换频率、改装需求、保修和您愿意承担的转售风险。" : "No. Mileage limits, early-termination risk, replacement frequency, modifications, warranty coverage and willingness to bear resale risk also matter."}</p></details>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "核对合同的权威来源" : "Primary sources for checking the contract"}</h2>
          <ul className="space-y-2">
            {[
              ["Consumer Financial Protection Bureau — Leasing versus buying a car", "https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/"],
              ["Federal Trade Commission — Financing or leasing a car", "https://consumer.ftc.gov/articles/financing-or-leasing-car"],
              ["Consumer Financial Protection Bureau — Compare auto-loan offers", "https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/"],
            ].map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-700 underline"><span>{label}</span><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></li>)}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/car-affordability" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "先算可承受车价" : "Calculate an affordable car price"}</Link>
          <Link to="/tools/car-loan" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "查看具体车贷月供" : "Calculate a specific car loan"}</Link>
          <Link to="/tools/depreciation" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "估算车辆折旧" : "Estimate vehicle depreciation"}</Link>
        </div>
      </article>
    </div>
  );
}
