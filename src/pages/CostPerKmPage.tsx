import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Info } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateCostPerKm } from "@/utils/quickTools";

type UnitSystem = "us" | "metric";

export default function CostPerKmPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const currency = isZh ? "¥" : "$";
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(isZh ? "metric" : "us");
  const [annualMileage, setAnnualMileage] = useState(15000);
  const [annualMiles, setAnnualMiles] = useState(12000);
  const [energy, setEnergy] = useState(1200);
  const [insurance, setInsurance] = useState(1500);
  const [maintenance, setMaintenance] = useState(800);
  const [parking, setParking] = useState(1800);
  const [tolls, setTolls] = useState(600);
  const [washing, setWashing] = useState(480);
  const [other, setOther] = useState(300);
  const [depreciation, setDepreciation] = useState(4500);

  const useUsUnits = !isZh && unitSystem === "us";
  const distance = useUsUnits ? annualMiles : annualMileage;
  const result = useMemo(() => calculateCostPerKm({ annualMileage: distance, energy, insurance, maintenance, parking, tolls, washing, other, depreciation }), [distance, energy, insurance, maintenance, parking, tolls, washing, other, depreciation]);

  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  const moneyUnit = isZh ? "元/年" : "USD/year";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800">{isZh ? "每公里用车成本计算器" : `Vehicle Cost per ${useUsUnits ? "Mile" : "Kilometer"} Calculator`}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh ? "输入一年的真实支出，分别计算不含折旧的现金成本和包含折旧的完整成本，避免只看油费或电费。" : "Enter one year of real expenses to calculate both cash running cost and full cost including depreciation, rather than looking at energy alone."}
        </p>
        {!isZh && (
          <div className="mt-4 inline-flex rounded-lg bg-slate-100 p-1" aria-label="Unit system">
            <button type="button" aria-pressed={unitSystem === "us"} onClick={() => setUnitSystem("us")} className={`rounded-md px-4 py-2 text-sm font-medium transition ${unitSystem === "us" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>US: miles</button>
            <button type="button" aria-pressed={unitSystem === "metric"} onClick={() => setUnitSystem("metric")} className={`rounded-md px-4 py-2 text-sm font-medium transition ${unitSystem === "metric" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Metric</button>
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "年度数据" : "Annual inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {useUsUnits ? (
              <NumberField id="annual-miles" label="Annual mileage" value={annualMiles} onChange={setAnnualMiles} suffix="miles/year" step={500} />
            ) : (
              <NumberField id="annual-mileage" label={isZh ? "年行驶里程" : "Annual mileage"} value={annualMileage} onChange={setAnnualMileage} suffix={isZh ? "公里" : "km/year"} step={500} />
            )}
            <NumberField id="energy-cost" label={isZh ? "油费或电费" : "Fuel or charging"} value={energy} onChange={setEnergy} suffix={moneyUnit} step={100} />
            <NumberField id="insurance-cost" label={isZh ? "保险" : "Insurance"} value={insurance} onChange={setInsurance} suffix={moneyUnit} step={100} />
            <NumberField id="maintenance-cost" label={isZh ? "保养与维修" : "Maintenance & repairs"} value={maintenance} onChange={setMaintenance} suffix={moneyUnit} step={100} />
            <NumberField id="parking-cost" label={isZh ? "停车" : "Parking"} value={parking} onChange={setParking} suffix={moneyUnit} step={100} />
            <NumberField id="toll-cost" label={isZh ? "通行费" : "Tolls"} value={tolls} onChange={setTolls} suffix={moneyUnit} step={100} />
            <NumberField id="washing-cost" label={isZh ? "洗车与美容" : "Washing & detailing"} value={washing} onChange={setWashing} suffix={moneyUnit} step={50} />
            <NumberField id="other-cost" label={isZh ? "其他支出" : "Other costs"} value={other} onChange={setOther} suffix={moneyUnit} step={50} />
            <div className="sm:col-span-2">
              <NumberField id="depreciation-cost" label={isZh ? "年度折旧" : "Annual depreciation"} value={depreciation} onChange={setDepreciation} suffix={moneyUnit} step={500} hint={isZh ? "可用年初估值减去年末估值；不确定时可分别尝试高、中、低三种情景。" : "Use opening value minus year-end value; test high, medium and low scenarios if uncertain."} />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">{isZh ? "现金成本（不含折旧）" : "Cash cost (excluding depreciation)"}</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{result.cashPerKm === null ? "—" : `${currency}${number(result.cashPerKm, 2)}`}<span className="ml-1 text-sm font-normal text-slate-400">/{isZh ? "公里" : useUsUnits ? "mile" : "km"}</span></p>
            <p className="mt-5 text-sm text-slate-300">{isZh ? "完整成本（包含折旧）" : "Full cost (including depreciation)"}</p>
            <p className="mt-1 text-3xl font-bold">{result.fullPerKm === null ? "—" : `${currency}${number(result.fullPerKm, 2)}`}<span className="ml-1 text-sm font-normal text-slate-400">/{isZh ? "公里" : useUsUnits ? "mile" : "km"}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "年现金支出" : "Annual cash cost"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.cashCost)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "月均现金支出" : "Monthly cash cost"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.monthlyCash)}</p>
            </div>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "当年里程为 0 时无法得到有意义的每公里结果。默认数据仅为演示，请替换为账单和实际残值。" : `Zero annual mileage cannot produce a meaningful per-${useUsUnits ? "mile" : "kilometer"} result. Defaults are examples; replace them with bills and actual resale values.`}</p>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-6 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "每公里成本怎么算？" : `How is cost per ${useUsUnits ? "mile" : "kilometer"} calculated?`}</h2>
          <p>{isZh ? "现金成本等于能源、保险、保养维修、停车、通行、洗车和其他实际支付费用之和，再除以年度里程。完整成本在此基础上加入车辆折旧。" : "Cash cost adds energy, insurance, maintenance, parking, tolls, washing and other paid expenses, then divides by annual mileage. Full cost additionally includes depreciation."}</p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">{isZh ? "每公里完整成本 =（年度现金支出 + 年度折旧）÷ 年行驶里程" : `Full cost/${useUsUnits ? "mile" : "km"} = (annual cash costs + annual depreciation) ÷ annual distance`}</div>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "为什么要分成两种结果？" : "Why show two results?"}</h2>
          <p>{isZh ? "现金成本反映每年需要从账户支付多少钱，适合做日常预算；完整成本把车辆价值损失也纳入，适合比较买车、换车、打车或租车。只看油费会严重低估真实成本。" : "Cash cost is useful for annual budgeting. Full cost includes lost vehicle value and is better for comparing ownership with replacement, ride-hailing or rental. Energy alone materially understates ownership cost."}</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "提高准确度的三个方法" : "Three ways to improve accuracy"}</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>{isZh ? "使用最近 12 个月账单，而不是凭印象估计。" : "Use the last 12 months of bills instead of memory."}</li>
            <li>{isZh ? "维修与轮胎等非年度支出按使用年限平均。" : "Annualize irregular repairs and tire replacement over their useful life."}</li>
            <li>{isZh ? "折旧使用同款车型的真实二手报价并做区间测试。" : "Use real used-market listings for the same model and test a range."}</li>
          </ol>
        </section>
        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/calculator" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"><Calculator className="h-4 w-4" />{isZh ? "计算完整年度成本" : "Calculate full annual cost"}</Link>
          <Link to="/tools/depreciation" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "先计算车辆折旧" : "Calculate vehicle depreciation"}</Link>
          <Link to="/tools/fuel-cost" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "单独计算油费" : "Calculate fuel cost"}</Link>
          <Link to="/methodology" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "查看完整计算方法" : "Review methodology"}</Link>
        </div>
      </article>
    </div>
  );
}
