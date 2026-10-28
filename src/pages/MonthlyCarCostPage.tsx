import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Car, ExternalLink, Info, WalletCards } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { convertFuelParamsUnit } from "@/utils/fuelCalc";
import { calculateMonthlyCarCost, type MonthlyCarEnergyType, type MonthlyCarUnitSystem } from "@/utils/quickTools";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
};

export default function MonthlyCarCostPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [unitSystem, setUnitSystemState] = useState<MonthlyCarUnitSystem>("us");
  const [energyType, setEnergyTypeState] = useState<MonthlyCarEnergyType>("gas");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [annualDistance, setAnnualDistance] = useState(12000);
  const [efficiency, setEfficiency] = useState(25);
  const [energyPrice, setEnergyPrice] = useState(3.5);
  const [annualInsurance, setAnnualInsurance] = useState(1500);
  const [monthlyLoanPayment, setMonthlyLoanPayment] = useState(500);
  const [annualLoanInterest, setAnnualLoanInterest] = useState(1200);
  const [annualMaintenance, setAnnualMaintenance] = useState(800);
  const [monthlyParkingAndTolls, setMonthlyParkingAndTolls] = useState(150);
  const [annualRegistration, setAnnualRegistration] = useState(200);
  const [annualDepreciation, setAnnualDepreciation] = useState(5000);

  const isUs = unitSystem === "us";
  const isGas = energyType === "gas";
  const distanceUnit = isUs ? "miles" : "km";
  const shortDistanceUnit = isUs ? "mi" : "km";
  const symbol = currencySymbols[currency];

  const result = useMemo(() => calculateMonthlyCarCost({
    unitSystem,
    energyType,
    annualDistance,
    efficiency,
    energyPrice,
    annualInsurance,
    monthlyLoanPayment,
    annualLoanInterest,
    annualMaintenance,
    monthlyParkingAndTolls,
    annualRegistration,
    annualDepreciation,
  }), [unitSystem, energyType, annualDistance, efficiency, energyPrice, annualInsurance, monthlyLoanPayment, annualLoanInterest, annualMaintenance, monthlyParkingAndTolls, annualRegistration, annualDepreciation]);

  const formatMoney = (value: number, maximumFractionDigits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  const setUnitSystem = (target: MonthlyCarUnitSystem) => {
    if (target === unitSystem) return;
    const converted = convertFuelParamsUnit({
      unitSystem,
      mileage: annualDistance,
      mileagePeriod: "yearly",
      fuelPrice: energyPrice,
      efficiency,
    }, isGas ? "fuel" : "electric", target);
    setUnitSystemState(target);
    setAnnualDistance(converted.mileage);
    setEnergyPrice(converted.fuelPrice);
    setEfficiency(converted.efficiency);
  };

  const setEnergyType = (target: MonthlyCarEnergyType) => {
    if (target === energyType) return;
    setEnergyTypeState(target);
    if (target === "gas") {
      setEfficiency(isUs ? 25 : 8);
      setEnergyPrice(isUs ? 3.5 : 1.6);
    } else {
      setEfficiency(isUs ? 30 : 18.6);
      setEnergyPrice(0.18);
    }
  };

  const monthlyRows = [
    [isGas ? (isZh ? "燃油" : "Fuel") : (isZh ? "充电" : "Charging"), result.monthlyEnergy],
    [isZh ? "保险" : "Insurance", result.monthlyInsurance],
    [isZh ? "保养" : "Maintenance", result.monthlyMaintenance],
    [isZh ? "停车与通行费" : "Parking & tolls", monthlyParkingAndTolls],
    [isZh ? "登记与检验" : "Registration & inspection", result.monthlyRegistration],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <WalletCards className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">
            {isZh ? "每月养车成本计算器" : "Monthly Car Cost Calculator"}
          </h1>
        </div>
        <p className="max-w-3xl leading-relaxed text-slate-600">
          {isZh
            ? "用自己的里程、能源价格、保险、月供与利息、保养、停车和折旧，分别估算每月现金预算与不重复计算贷款本金的持有成本。"
            : "Estimate monthly cash outflow and economic ownership cost from your mileage, energy price, insurance, payment and interest, maintenance, parking and depreciation—without double-counting loan principal."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800">{isZh ? "您的数据" : "Your inputs"}</h2>
            <div className="flex flex-wrap gap-2">
              <div role="group" aria-label={isZh ? "能源类型" : "Energy type"} className="flex rounded-lg bg-slate-100 p-0.5">
                {(["gas", "electric"] as const).map((type) => (
                  <button key={type} type="button" onClick={() => setEnergyType(type)} aria-pressed={energyType === type} className={`rounded-md px-3 py-1.5 text-xs font-medium ${energyType === type ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>
                    {type === "gas" ? (isZh ? "燃油车" : "Gas") : (isZh ? "电车" : "EV")}
                  </button>
                ))}
              </div>
              <div role="group" aria-label={isZh ? "单位制" : "Unit system"} className="flex rounded-lg bg-slate-100 p-0.5">
                {(["us", "metric"] as const).map((unit) => (
                  <button key={unit} type="button" onClick={() => setUnitSystem(unit)} aria-pressed={unitSystem === unit} className={`rounded-md px-3 py-1.5 text-xs font-medium ${unitSystem === unit ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>
                    {unit === "us" ? (isZh ? "美制" : "US") : (isZh ? "公制" : "Metric")}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="monthly-cost-currency">{isZh ? "币种" : "Currency"}</label>
              <select id="monthly-cost-currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700">
                {(Object.keys(currencySymbols) as CurrencyCode[]).map((code) => <option key={code} value={code}>{code}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="monthly-annual-distance" label={isZh ? "年度行驶里程" : "Annual distance"} value={annualDistance} onChange={setAnnualDistance} suffix={`${distanceUnit}/yr`} step={100} />
            <NumberField id="monthly-efficiency" label={isGas ? (isUs ? (isZh ? "燃油经济性" : "Fuel economy") : (isZh ? "百公里油耗" : "Fuel consumption")) : (isZh ? "电耗" : "Energy consumption")} value={efficiency} onChange={setEfficiency} suffix={isGas ? (isUs ? "MPG" : "L/100km") : `kWh/100${shortDistanceUnit}`} step={0.1} />
            <NumberField id="monthly-energy-price" label={isGas ? (isZh ? "燃油单价" : "Fuel price") : (isZh ? "电价" : "Electricity price")} value={energyPrice} onChange={setEnergyPrice} suffix={`${symbol}/${isGas ? (isUs ? "gal" : "L") : "kWh"}`} step={0.01} />
            <NumberField id="monthly-insurance" label={isZh ? "年度保险" : "Annual insurance"} value={annualInsurance} onChange={setAnnualInsurance} suffix={`${symbol}/yr`} step={50} />
            <NumberField id="monthly-loan" label={isZh ? "每月车贷还款" : "Monthly loan payment"} value={monthlyLoanPayment} onChange={setMonthlyLoanPayment} suffix={`${symbol}/mo`} step={25} />
            <NumberField id="monthly-loan-interest" label={isZh ? "年度贷款利息" : "Annual loan interest"} value={annualLoanInterest} onChange={setAnnualLoanInterest} suffix={`${symbol}/yr`} step={50} hint={isZh ? "使用贷款账单中未来 12 个月的利息；已还清贷款则填 0。" : "Use the interest due over the next 12 months from your loan schedule; enter 0 if paid off."} />
            <NumberField id="monthly-maintenance" label={isZh ? "年度保养与维修" : "Annual maintenance & repairs"} value={annualMaintenance} onChange={setAnnualMaintenance} suffix={`${symbol}/yr`} step={50} />
            <NumberField id="monthly-parking" label={isZh ? "每月停车与通行费" : "Monthly parking & tolls"} value={monthlyParkingAndTolls} onChange={setMonthlyParkingAndTolls} suffix={`${symbol}/mo`} step={10} />
            <NumberField id="monthly-registration" label={isZh ? "年度登记与检验" : "Annual registration & inspection"} value={annualRegistration} onChange={setAnnualRegistration} suffix={`${symbol}/yr`} step={25} />
            <NumberField id="monthly-depreciation" label={isZh ? "年度折旧" : "Annual depreciation"} value={annualDepreciation} onChange={setAnnualDepreciation} suffix={`${symbol}/yr`} step={100} hint={isZh ? "购车价减去预计净转售价，再除以持有年数。" : "Purchase price minus expected net resale value, divided by years owned."} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm text-slate-300">{isZh ? "每月现金预算" : "Monthly cash budget"}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{formatMoney(result.cashBudgetMonthly)}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{isZh ? "包含完整月供，适合检查每月账户现金流；不另加折旧。" : "Includes the full loan payment for cash-flow planning; depreciation is not added again."}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm text-emerald-800">{isZh ? "每月持有成本" : "Monthly ownership cost"}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">{formatMoney(result.ownershipCostMonthly)}</p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-800">{isZh ? "使用折旧表示车辆价值损失，计入贷款利息并排除还本，避免重复计算购车价。" : "Uses depreciation for lost vehicle value, includes loan interest and excludes principal to avoid counting the purchase price twice."}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between text-sm"><span className="text-slate-500">{isZh ? "每月运营费用" : "Monthly operating costs"}</span><strong className="text-slate-800">{formatMoney(result.operatingMonthly)}</strong></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">{isZh ? "能源费用" : "Energy cost"}</span><strong className="text-slate-800">{formatMoney(result.monthlyEnergy)}</strong></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">{isZh ? "月均贷款利息" : "Monthly loan interest"}</span><strong className="text-slate-800">{formatMoney(result.monthlyLoanInterest)}</strong></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">{isZh ? `每${shortDistanceUnit}持有成本` : `Ownership cost per ${isUs ? "mile" : "km"}`}</span><strong className="text-slate-800">{result.ownershipCostPerDistance === null ? "—" : `${formatMoney(result.ownershipCostPerDistance, 2)}/${shortDistanceUnit}`}</strong></div>
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">{isZh ? "当前每月明细" : "Current monthly breakdown"}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {monthlyRows.map(([label, value]) => <div key={label} className="flex justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm"><span className="text-slate-600">{label}</span><strong className="text-slate-800">{formatMoney(value, 2)}</strong></div>)}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{isZh ? "现金预算与持有成本回答不同问题，不应相加。现金预算包含完整贷款还款；持有成本使用贷款利息和折旧、排除还本，但不估算机会成本、税务影响或意外大修。" : "Cash budget and ownership cost answer different questions and should not be added together. Cash budget includes the full loan payment; ownership cost uses loan interest and depreciation while excluding principal. Neither estimate includes opportunity cost, tax effects or an unexpected major repair."}</p>
        </div>
      </section>

      <section className="mt-8 space-y-5 text-sm leading-relaxed text-slate-600">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "每月养车成本怎么算？" : "How monthly car cost is calculated"}</h2>
          <p>{isZh ? "运营费用等于能源、保险、保养维修、停车通行和登记检验的月均值。现金预算在此基础上加每月还款；持有成本则加月均贷款利息和折旧，排除还本。" : "Operating cost is the monthly share of energy, insurance, maintenance and repairs, parking and tolls, and registration. Cash budget adds the monthly payment. Ownership cost instead adds monthly loan interest and depreciation while excluding principal."}</p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-emerald-300">{isZh ? "现金预算 = 运营费用 + 月供" : "Cash budget = operating costs + monthly payment"}</div>
          <div className="mt-2 overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-emerald-300">{isZh ? "持有成本 = 运营费用 +（年贷款利息 + 年折旧）÷ 12" : "Ownership cost = operating costs + (annual loan interest + annual depreciation) ÷ 12"}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "为什么不能把月供和折旧都计入持有成本？" : "Why not include both the loan payment and depreciation?"}</summary><p className="mt-2">{isZh ? "月供中的本金是在支付车辆购置价，折旧也是在表达同一车辆价值的消耗。两者同时计入会重复计算大部分购车价。现金流预算可以使用完整月供，但经济成本应分开处理利息、费用与折旧。" : "Loan principal pays for the vehicle's purchase value, while depreciation measures consumption of that same value. Including both counts much of the purchase price twice. Use the full payment for cash flow, but separate interest, fees and depreciation for economic cost."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "已经付清贷款时月供怎么填？" : "What if the car is paid off?"}</summary><p className="mt-2">{isZh ? "将每月车贷还款和年度贷款利息都填为 0。持有成本仍然应包含折旧，因为车辆价值会继续变化。" : "Enter zero for both the monthly loan payment and annual loan interest. Keep depreciation if you want an economic ownership estimate because the vehicle's value can still change."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "折旧应该填多少？" : "How should I estimate depreciation?"}</summary><p className="mt-2">{isZh ? "用实际成交价减去预计出售时可获得的净金额，再除以计划持有年数。至少测试保守、中性和乐观三种转售价。" : "Subtract expected net resale proceeds from the actual purchase price, then divide by planned ownership years. Test conservative, middle and optimistic resale values."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "这个工具使用实时平均价格吗？" : "Does this calculator use live average prices?"}</summary><p className="mt-2">{isZh ? "不使用。默认值只是演示，请替换为本地油价或电价、书面保险报价、贷款账单和自己的停车记录。" : "No. Defaults are illustrative. Replace them with local energy prices, a written insurance quote, your loan statement and your own parking records."}</p></details>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "核对数据的权威来源" : "Primary sources for checking inputs"}</h2>
          <ul className="space-y-2">
            {[
              ["FuelEconomy.gov — Compare vehicle efficiency", "https://www.fueleconomy.gov/feg/Find.do?action=sbsSelect"],
              ["Consumer Financial Protection Bureau — Auto loans", "https://www.consumerfinance.gov/consumer-tools/auto-loans/"],
              ["NAIC — Auto insurance consumer guide", "https://content.naic.org/consumer/auto-insurance.htm"],
              ["NHTSA — Tire safety and maintenance", "https://www.nhtsa.gov/vehicle-safety/tires"],
            ].map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-700 underline"><span>{label}</span><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></li>)}
          </ul>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/calculator" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600"><Car className="h-4 w-4" />{isZh ? "完整多年成本计算器" : "Full multi-year calculator"}</Link>
        <Link to="/tools/cost-per-km" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">{isZh ? "每英里/公里成本" : "Cost per mile or km"}</Link>
      </div>
    </div>
  );
}
