import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Route } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateEvBreakEven } from "@/utils/quickTools";

export default function EvBreakEvenPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [annualMileage, setAnnualMileage] = useState(15000);
  const [fuelConsumption, setFuelConsumption] = useState(8);
  const [fuelPrice, setFuelPrice] = useState(7.5);
  const [evConsumption, setEvConsumption] = useState(15);
  const [electricityPrice, setElectricityPrice] = useState(0.6);
  const [pricePremium, setPricePremium] = useState(30000);
  const [annualFixedDifference, setAnnualFixedDifference] = useState(500);

  const result = useMemo(() => calculateEvBreakEven({ annualMileage, fuelConsumption, fuelPrice, evConsumption, electricityPrice, pricePremium, annualFixedDifference }), [annualMileage, fuelConsumption, fuelPrice, evConsumption, electricityPrice, pricePremium, annualFixedDifference]);

  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800">{isZh ? "油车电车回本里程计算器" : "Fuel Car vs EV Break-even Calculator"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh ? "计算电车每公里能源节省能否抵消购车差价，以及大约需要多少年、多少公里。结果使用您输入的价格，不依赖固定市场均值。" : "Estimate whether an EV's per-kilometer energy savings recover its purchase-price premium, and the approximate years and distance required."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "对比参数" : "Comparison inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="break-even-mileage" label={isZh ? "年行驶里程" : "Annual mileage"} value={annualMileage} onChange={setAnnualMileage} suffix={isZh ? "公里" : "km"} step={500} />
            <NumberField id="price-premium" label={isZh ? "电车购车差价" : "EV price premium"} value={pricePremium} onChange={setPricePremium} suffix={isZh ? "元" : "CNY"} step={1000} hint={isZh ? "电车落地价减去油车落地价；若电车更便宜请输入 0。" : "EV drive-away price minus fuel-car price; enter 0 if the EV is cheaper."} />
            <NumberField id="fuel-consumption" label={isZh ? "油车百公里油耗" : "Fuel consumption"} value={fuelConsumption} onChange={setFuelConsumption} suffix="L/100km" step={0.1} />
            <NumberField id="fuel-price" label={isZh ? "油价" : "Fuel price"} value={fuelPrice} onChange={setFuelPrice} suffix={isZh ? "元/L" : "CNY/L"} step={0.1} />
            <NumberField id="ev-consumption" label={isZh ? "电车百公里电耗" : "EV consumption"} value={evConsumption} onChange={setEvConsumption} suffix="kWh/100km" step={0.1} />
            <NumberField id="electricity-price" label={isZh ? "综合充电电价" : "Blended charging price"} value={electricityPrice} onChange={setElectricityPrice} suffix={isZh ? "元/kWh" : "CNY/kWh"} step={0.1} hint={isZh ? "按家充、公共快充的实际比例计算加权平均价。" : "Use a weighted average of home and public charging."} />
            <div className="sm:col-span-2">
              <NumberField id="fixed-difference" label={isZh ? "电车每年额外固定成本" : "EV extra annual fixed cost"} value={annualFixedDifference} onChange={setAnnualFixedDifference} suffix={isZh ? "元/年" : "CNY/year"} step={100} hint={isZh ? "电车保险增加额减去保养节省额；若电车固定成本反而更低，可填 0，并在完整计算器中进一步比较。" : "EV insurance increase minus maintenance savings. Enter 0 when the EV has no extra fixed cost."} />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className={`rounded-xl p-6 text-white ${result.canBreakEven ? "bg-slate-900" : "bg-rose-900"}`}>
            {result.canBreakEven ? (
              <>
                <p className="text-sm text-slate-300">{result.immediate ? (isZh ? "购车时已无额外差价" : "No purchase premium to recover") : (isZh ? "预计回本时间" : "Estimated break-even time")}</p>
                <p className="mt-1 text-3xl font-bold text-emerald-400">{result.immediate ? (isZh ? "立即" : "Immediate") : `${number(result.years!, 1)} ${isZh ? "年" : "years"}`}</p>
                <p className="mt-5 text-sm text-slate-300">{isZh ? "预计回本里程" : "Estimated break-even distance"}</p>
                <p className="mt-1 text-2xl font-semibold">{result.immediate ? "0" : number(result.distance!)} {isZh ? "公里" : "km"}</p>
              </>
            ) : (
              <>
                <AlertTriangle className="mb-3 h-7 w-7 text-rose-200" />
                <p className="text-lg font-semibold">{isZh ? "按当前输入无法回本" : "No break-even with these inputs"}</p>
                <p className="mt-2 text-sm leading-relaxed text-rose-100">{isZh ? "年度能源节省不足以覆盖额外固定成本，或电车每公里能源成本不低于油车。" : "Annual energy savings do not cover extra fixed costs, or EV energy cost per kilometer is not lower."}</p>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "油车百公里" : "Fuel /100 km"}</p>
              <p className="mt-1 text-lg font-semibold text-orange-600">¥{number(result.fuelPer100, 2)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "电车百公里" : "EV /100 km"}</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600">¥{number(result.evPer100, 2)}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "扣除固定差异后的年净节省" : "Net annual saving after fixed-cost difference"}</p>
              <p className={`mt-1 text-xl font-semibold ${result.netAnnualSaving >= 0 ? "text-emerald-600" : "text-rose-600"}`}>¥{number(result.netAnnualSaving)}</p>
            </div>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-6 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "回本里程的计算公式" : "Break-even formula"}</h2>
          <p>{isZh ? "先比较每公里油费与电费，再用年度里程得到能源节省。扣除电车每年额外固定成本后，年度净节省用于抵消购车差价。" : "First compare fuel and electricity cost per kilometer, then apply annual mileage. After subtracting extra annual EV fixed cost, net annual saving recovers the purchase premium."}</p>
          <div className="mt-3 space-y-1 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">
            <p>{isZh ? "年净节省 = 每公里能源差额 × 年里程 − 年固定成本差额" : "Net annual saving = energy saving/km × annual distance − annual fixed-cost difference"}</p>
            <p>{isZh ? "回本年数 = 购车差价 ÷ 年净节省" : "Break-even years = purchase premium ÷ net annual saving"}</p>
          </div>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "综合充电电价怎么填？" : "How to estimate blended charging price"}</h2>
          <p>{isZh ? "如果 70% 电量来自 0.5 元/度的家充，30% 来自 1.6 元/度的公共快充，综合电价为 0.5×70% + 1.6×30% = 0.83 元/度。不要只使用最低谷电价。" : "If 70% of charging is at home for 0.5 CNY/kWh and 30% is public fast charging at 1.6, the blended price is 0.5×70% + 1.6×30% = 0.83 CNY/kWh. Do not use only the cheapest tariff."}</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "这个结果不包含什么？" : "What is not included?"}</h2>
          <p>{isZh ? "简化工具不预测折旧、融资利息、电池更换、充电设施安装、油价电价变化或机会成本。它适合快速判断能源节省能否覆盖差价；购车前请使用完整计算器进行多情景对比。" : "This quick tool does not forecast depreciation, financing interest, battery replacement, charger installation, price changes or opportunity cost. Use the full calculator for scenario analysis before purchasing."}</p>
        </section>
        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/compare" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "进行 1–10 年完整对比" : "Run a full 1–10 year comparison"}<ArrowRight className="h-4 w-4" /></Link>
          <Link to="/tools/cost-per-km" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"><Route className="h-4 w-4" />{isZh ? "计算每公里完整成本" : "Calculate full cost per km"}</Link>
          <Link to="/tools/fuel-cost" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "计算单次行程油费" : "Calculate trip fuel cost"}</Link>
          <Link to="/tools/charging-cost" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "计算实际充电费用" : "Calculate EV charging cost"}</Link>
        </div>
      </article>
    </div>
  );
}
