import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, Fuel, Info } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateFuelCost } from "@/utils/quickTools";

export default function FuelCostPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [distance, setDistance] = useState(500);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(8);
  const [fuelPrice, setFuelPrice] = useState(7.5);
  const result = useMemo(
    () => calculateFuelCost({ distance, consumptionPer100Km, fuelPrice }),
    [distance, consumptionPer100Km, fuelPrice],
  );
  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <div className="mb-2 flex items-center gap-3">
          <Fuel className="h-8 w-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "油费计算器" : "Fuel Cost Calculator"}</h1>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh
            ? "输入行驶里程、百公里油耗和当前油价，计算预计用油量、总油费、每公里油费与百公里油费。适用于单次自驾、通勤或年度预算。"
            : "Enter distance, consumption per 100 km and fuel price to estimate liters used, total fuel cost, cost per kilometer and cost per 100 km."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "行程参数" : "Trip inputs"}</h2>
          <div className="space-y-4">
            <NumberField id="fuel-distance" label={isZh ? "预计行驶里程" : "Distance"} value={distance} onChange={setDistance} suffix={isZh ? "公里" : "km"} step={10} />
            <NumberField id="fuel-consumption-tool" label={isZh ? "百公里油耗" : "Consumption"} value={consumptionPer100Km} onChange={setConsumptionPer100Km} suffix="L/100km" step={0.1} hint={isZh ? "建议使用最近几次加油计算出的实际综合油耗。" : "For better accuracy, use consumption calculated from recent refueling records."} />
            <NumberField id="fuel-price-tool" label={isZh ? "每升油价" : "Fuel price"} value={fuelPrice} onChange={setFuelPrice} suffix={isZh ? "元/L" : "CNY/L"} step={0.01} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">{isZh ? "预计总油费" : "Estimated fuel cost"}</p>
            <p className="mt-1 text-4xl font-bold text-orange-400">¥{number(result.totalCost, 2)}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700 pt-5">
              <div>
                <p className="text-xs text-slate-400">{isZh ? "预计用油量" : "Fuel required"}</p>
                <p className="mt-1 text-xl font-semibold">{number(result.liters, 2)} L</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">{isZh ? "每公里油费" : "Cost per km"}</p>
                <p className="mt-1 text-xl font-semibold">{result.costPerKm === null ? "—" : `¥${number(result.costPerKm, 2)}`}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-500">{isZh ? "百公里油费" : "Fuel cost per 100 km"}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">¥{number(result.costPer100Km, 2)}</p>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "结果只计算燃油，不包含高速费、停车费、车辆折旧和绕行里程。油价与实际油耗变化时请重新计算。" : "This result covers fuel only. It excludes tolls, parking, depreciation and detours. Recalculate when fuel price or real consumption changes."}</p>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "油费怎么计算？" : "How is fuel cost calculated?"}</h2>
          <p>{isZh ? "先用行驶里程乘以百公里油耗并除以 100，得到需要的燃油升数；再乘以每升油价得到总油费。每公里油费等于总油费除以行驶里程。" : "Multiply distance by consumption per 100 km and divide by 100 to get liters required. Multiply liters by price per liter for total cost."}</p>
          <div className="mt-3 space-y-1 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">
            <p>{isZh ? "用油量 = 行驶里程 × 百公里油耗 ÷ 100" : "Liters = distance × consumption/100 km ÷ 100"}</p>
            <p>{isZh ? "总油费 = 用油量 × 每升油价" : "Total fuel cost = liters × price per liter"}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "如何得到更准确的真实油耗？" : "How to get a more accurate consumption figure"}</h2>
          <p>{isZh ? "加满油后记录里程，下次再次加满时，用本次加油升数除以两次加油之间的里程，再乘以 100。连续记录三至五箱油并取平均值，通常比只看某一段表显油耗更能反映拥堵、空调、温度和驾驶习惯的综合影响。" : "Fill the tank and record the odometer. At the next full refill, divide liters added by distance traveled and multiply by 100. Average several tanks to reduce the effect of one unusual trip."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "示例：500 公里需要多少油费？" : "Example: fuel cost for 500 km"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-slate-500"><th className="px-3 py-2 font-medium">{isZh ? "百公里油耗" : "Consumption"}</th><th className="px-3 py-2 font-medium">{isZh ? "油价" : "Price"}</th><th className="px-3 py-2 font-medium">{isZh ? "用油量" : "Liters"}</th><th className="px-3 py-2 font-medium">{isZh ? "总油费" : "Total"}</th></tr></thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">6 L/100km</td><td className="px-3 py-2">¥7.50/L</td><td className="px-3 py-2">30 L</td><td className="px-3 py-2 font-medium text-slate-800">¥225</td></tr>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">8 L/100km</td><td className="px-3 py-2">¥7.50/L</td><td className="px-3 py-2">40 L</td><td className="px-3 py-2 font-medium text-slate-800">¥300</td></tr>
                <tr><td className="px-3 py-2">10 L/100km</td><td className="px-3 py-2">¥7.50/L</td><td className="px-3 py-2">50 L</td><td className="px-3 py-2 font-medium text-slate-800">¥375</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">{isZh ? "示例油价仅用于演示，不代表任何地区的实时价格。" : "Example prices are illustrative and are not live local prices."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "表显油耗可以直接使用吗？" : "Can I use dashboard consumption?"}</summary><p className="mt-2">{isZh ? "可以用于快速估算，但长期预算更适合使用多次加满法得到的实际平均油耗。" : "Yes for a quick estimate, but refill-to-refill averages are better for long-term budgeting."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "堵车和开空调会影响结果吗？" : "Do traffic and air conditioning matter?"}</summary><p className="mt-2">{isZh ? "会。它们通过改变实际百公里油耗影响结果，因此应输入与使用场景相符的综合油耗。" : "Yes. They affect real consumption, so use a figure that matches the route and conditions."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "往返行程怎么计算？" : "How do I calculate a return trip?"}</summary><p className="mt-2">{isZh ? "在行驶里程中直接输入往返总公里数，并为可能的绕行预留少量里程。" : "Enter the full round-trip distance and allow for likely detours."}</p></details>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/cost-per-km" className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"><Calculator className="h-4 w-4" />{isZh ? "计算包含折旧的每公里成本" : "Calculate full cost per kilometer"}</Link>
          <Link to="/calculator" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "进入完整用车成本计算器" : "Open full ownership calculator"}</Link>
        </div>
      </article>
    </div>
  );
}
