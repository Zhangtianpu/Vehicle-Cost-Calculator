import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BatteryCharging, Info } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateChargingCost } from "@/utils/quickTools";

export default function ChargingCostPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const currency = isZh ? "¥" : "$";
  const [distance, setDistance] = useState(500);
  const [consumptionPer100Km, setConsumptionPer100Km] = useState(15);
  const [electricityPrice, setElectricityPrice] = useState(0.18);
  const [chargingLossPercent, setChargingLossPercent] = useState(10);
  const result = useMemo(
    () => calculateChargingCost({ distance, consumptionPer100Km, electricityPrice, chargingLossPercent }),
    [distance, consumptionPer100Km, electricityPrice, chargingLossPercent],
  );
  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <div className="mb-2 flex items-center gap-3">
          <BatteryCharging className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "新能源汽车充电费用计算器" : "EV Charging Cost Calculator"}</h1>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh
            ? "输入行驶里程、百公里电耗、充电电价和充电损耗，计算电网取电量、预计充电费、每公里电费与百公里电费。"
            : "Enter distance, energy consumption, electricity price and charging loss to calculate grid energy, total charging cost and cost per kilometer."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "充电参数" : "Charging inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="charging-distance" label={isZh ? "预计行驶里程" : "Distance"} value={distance} onChange={setDistance} suffix={isZh ? "公里" : "km"} step={10} />
            <NumberField id="charging-consumption" label={isZh ? "百公里电耗" : "Energy consumption"} value={consumptionPer100Km} onChange={setConsumptionPer100Km} suffix="kWh/100km" step={0.1} hint={isZh ? "优先使用车辆长期平均电耗，而不是单次最佳数据。" : "Prefer a long-term average rather than a single best trip."} />
            <NumberField id="charging-price" label={isZh ? "综合充电电价" : "Blended electricity price"} value={electricityPrice} onChange={setElectricityPrice} suffix={isZh ? "元/kWh" : "USD/kWh"} step={0.01} hint={isZh ? "按家充、公共慢充和快充的实际比例加权。" : "Weight home, public AC and fast-charging prices by actual usage."} />
            <NumberField id="charging-loss" label={isZh ? "充电损耗" : "Charging loss"} value={chargingLossPercent} onChange={setChargingLossPercent} suffix="%" min={0} max={50} step={1} hint={isZh ? "包括充电转换、温控等造成的电网取电差额。" : "Accounts for conversion, thermal management and other grid-to-battery losses."} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">{isZh ? "预计充电费用" : "Estimated charging cost"}</p>
            <p className="mt-1 text-4xl font-bold text-emerald-400">{currency}{number(result.totalCost, 2)}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700 pt-5">
              <div>
                <p className="text-xs text-slate-400">{isZh ? "电网取电量" : "Grid energy"}</p>
                <p className="mt-1 text-xl font-semibold">{number(result.gridEnergy, 2)} kWh</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">{isZh ? "每公里电费" : "Cost per km"}</p>
                <p className="mt-1 text-xl font-semibold">{result.costPerKm === null ? "—" : `${currency}${number(result.costPerKm, 2)}`}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "车辆行驶用电" : "Vehicle energy"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{number(result.vehicleEnergy, 2)} kWh</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "百公里电费" : "Cost per 100 km"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{currency}{number(result.costPer100Km, 2)}</p>
            </div>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "结果只计算充电电费，不包含停车占位费、服务费（若未包含在电价中）、充电桩安装费、电池折旧或绕行成本。" : "This covers charging electricity only. It excludes parking, separately billed service fees, charger installation, battery depreciation and detours."}</p>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "充电费用怎么计算？" : "How is EV charging cost calculated?"}</h2>
          <p>{isZh ? "车辆行驶用电等于里程乘以百公里电耗。实际电网取电量还要考虑充电损耗，因此会高于车辆显示的行驶用电；电网取电量乘以综合电价得到预计充电费。" : "Vehicle energy equals distance multiplied by consumption per 100 km. Grid energy is higher after charging loss, and multiplying it by the blended electricity price gives total cost."}</p>
          <div className="mt-3 space-y-1 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">
            <p>{isZh ? "车辆用电 = 行驶里程 × 百公里电耗 ÷ 100" : "Vehicle energy = distance × consumption/100 km ÷ 100"}</p>
            <p>{isZh ? "电网取电 = 车辆用电 ÷（1 − 充电损耗率）" : "Grid energy = vehicle energy ÷ (1 − charging-loss rate)"}</p>
            <p>{isZh ? "充电费用 = 电网取电 × 综合充电电价" : "Charging cost = grid energy × blended electricity price"}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "综合充电电价如何填写？" : "How to calculate a blended charging price"}</h2>
          <p>{isZh ? "把不同渠道的含税、含服务费实际支付单价按充电量占比加权。例如 70% 电量来自 0.50 元/度的家充，30% 来自 1.60 元/度的快充，综合电价为 0.50×70% + 1.60×30% = 0.83 元/度。只填最低谷电价通常会低估支出。" : "Weight the actual paid price of each charging source by its energy share. For example, 70% at $0.15/kWh and 30% at $0.35 gives a blended price of $0.21/kWh."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "示例：行驶 500 公里的充电费" : "Example: charging cost for 500 km"}</h2>
          <p className="mb-3">{isZh ? "以下示例统一使用 15 kWh/100km 电耗和 10% 充电损耗，只改变综合电价。" : "These examples use 15 kWh/100 km and 10% charging loss, changing only the blended price."}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-slate-500"><th className="px-3 py-2 font-medium">{isZh ? "综合电价" : "Price"}</th><th className="px-3 py-2 font-medium">{isZh ? "车辆用电" : "Vehicle energy"}</th><th className="px-3 py-2 font-medium">{isZh ? "电网取电" : "Grid energy"}</th><th className="px-3 py-2 font-medium">{isZh ? "充电费" : "Cost"}</th></tr></thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">{currency}0.12/kWh</td><td className="px-3 py-2">75 kWh</td><td className="px-3 py-2">83.33 kWh</td><td className="px-3 py-2 font-medium text-slate-800">{currency}10.00</td></tr>
                <tr className="border-b border-slate-100"><td className="px-3 py-2">{currency}0.18/kWh</td><td className="px-3 py-2">75 kWh</td><td className="px-3 py-2">83.33 kWh</td><td className="px-3 py-2 font-medium text-slate-800">{currency}15.00</td></tr>
                <tr><td className="px-3 py-2">{currency}0.35/kWh</td><td className="px-3 py-2">75 kWh</td><td className="px-3 py-2">83.33 kWh</td><td className="px-3 py-2 font-medium text-slate-800">{currency}29.17</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">{isZh ? "示例单价仅用于解释公式，不代表任何充电网络的实时价格。" : "Example prices explain the formula and are not live charging-network prices."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "一度电等于多少 kWh？" : "Is one unit of electricity one kWh?"}</summary><p className="mt-2">{isZh ? "日常电费中的一度电就是 1 kWh。" : "Yes. One billing unit of electricity is 1 kWh."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "为什么要计算充电损耗？" : "Why include charging loss?"}</summary><p className="mt-2">{isZh ? "车辆显示的行驶用电不一定等于电表取电量。忽略损耗会低估实际支付电量和费用。" : "Energy shown by the vehicle may be lower than energy drawn from the meter. Ignoring the difference understates paid energy."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "公共快充服务费怎么处理？" : "How should fast-charging service fees be handled?"}</summary><p className="mt-2">{isZh ? "如果账单显示的是电费与服务费合计单价，直接填合计单价；若另按次收费，可在完整用车成本计算器的其他支出中单独加入。" : "Use the all-in per-kWh price when the bill combines electricity and service fees. Add separately billed flat fees as other ownership costs."}</p></details>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/ev-break-even" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "计算油车电车回本里程" : "Calculate fuel-vs-EV break-even"}</Link>
          <Link to="/tools/fuel-cost" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "对比单次行程油费" : "Compare trip fuel cost"}</Link>
          <Link to="/tools/cost-per-km" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "计算完整每公里成本" : "Calculate full cost per kilometer"}</Link>
        </div>
      </article>
    </div>
  );
}
