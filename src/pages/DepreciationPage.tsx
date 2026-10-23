import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Info, TrendingDown } from "lucide-react";
import NumberField from "@/components/tools/NumberField";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateDepreciation } from "@/utils/quickTools";

export default function DepreciationPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const [purchasePrice, setPurchasePrice] = useState(150000);
  const [currentValue, setCurrentValue] = useState(90000);
  const [yearsOwned, setYearsOwned] = useState(3);
  const [totalMileage, setTotalMileage] = useState(45000);
  const result = useMemo(
    () => calculateDepreciation({ purchasePrice, currentValue, yearsOwned, totalMileage }),
    [purchasePrice, currentValue, yearsOwned, totalMileage],
  );
  const number = (value: number, digits = 0) => new Intl.NumberFormat(isZh ? "zh-CN" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-7">
        <div className="mb-2 flex items-center gap-3">
          <TrendingDown className="h-8 w-8 text-rose-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "汽车折旧计算器" : "Car Depreciation Calculator"}</h1>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          {isZh
            ? "用购车价和当前可成交估值计算车辆累计折旧、平均每年折旧、保值率与每公里折旧。结果基于真实估值差额，不套用固定折旧率。"
            : "Use purchase price and current market value to calculate total depreciation, average annual depreciation, retained value and depreciation per kilometer."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">{isZh ? "车辆数据" : "Vehicle inputs"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="depreciation-purchase-price" label={isZh ? "实际购车价" : "Purchase price"} value={purchasePrice} onChange={setPurchasePrice} suffix={isZh ? "元" : "CNY"} step={1000} hint={isZh ? "建议使用车辆落地价，不含贷款利息。" : "Use the vehicle drive-away price, excluding financing interest."} />
            <NumberField id="depreciation-current-value" label={isZh ? "当前可成交估值" : "Current market value"} value={currentValue} onChange={setCurrentValue} suffix={isZh ? "元" : "CNY"} step={1000} hint={isZh ? "优先使用近期同款、同配置、相近里程的实际报价。" : "Prefer recent quotes for the same model, trim and similar mileage."} />
            <NumberField id="depreciation-years" label={isZh ? "已持有年数" : "Years owned"} value={yearsOwned} onChange={setYearsOwned} suffix={isZh ? "年" : "years"} step={0.5} />
            <NumberField id="depreciation-mileage" label={isZh ? "累计行驶里程" : "Total mileage"} value={totalMileage} onChange={setTotalMileage} suffix={isZh ? "公里" : "km"} step={1000} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl bg-slate-900 p-6 text-white">
            <p className="text-sm text-slate-300">{isZh ? "累计折旧金额" : "Total depreciation"}</p>
            <p className="mt-1 text-4xl font-bold text-rose-400">¥{number(result.totalDepreciation)}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-700 pt-5">
              <div>
                <p className="text-xs text-slate-400">{isZh ? "累计折旧率" : "Depreciation rate"}</p>
                <p className="mt-1 text-xl font-semibold">{result.depreciationRate === null ? "—" : `${number(result.depreciationRate, 1)}%`}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">{isZh ? "当前保值率" : "Retained value"}</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">{result.retainedValueRate === null ? "—" : `${number(result.retainedValueRate, 1)}%`}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "年均折旧" : "Average per year"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{result.annualDepreciation === null ? "—" : `¥${number(result.annualDepreciation)}`}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{isZh ? "每公里折旧" : "Depreciation/km"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{result.depreciationPerKm === null ? "—" : `¥${number(result.depreciationPerKm, 2)}`}</p>
            </div>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{isZh ? "这是基于当前估值的历史平均值，不是未来售价预测。购车价为 0、持有年数为 0 或里程为 0 时，对应比例结果会显示为空。" : "These are historical averages based on the current estimate, not a future resale forecast. Ratios are omitted when their denominator is zero."}</p>
          </div>
        </aside>
      </div>

      <article className="mt-10 space-y-7 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "汽车折旧怎么计算？" : "How is car depreciation calculated?"}</h2>
          <p>{isZh ? "累计折旧是实际购车价减去当前可成交估值。折旧率用累计折旧除以购车价；保值率用当前估值除以购车价。年均折旧和每公里折旧只是把已经发生的价值损失按时间或里程平均。" : "Total depreciation is purchase price minus current market value. Depreciation rate divides that loss by purchase price; retained value divides current value by purchase price."}</p>
          <div className="mt-3 space-y-1 overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-700">
            <p>{isZh ? "累计折旧 = 实际购车价 − 当前可成交估值" : "Total depreciation = purchase price − current market value"}</p>
            <p>{isZh ? "保值率 = 当前估值 ÷ 实际购车价 × 100%" : "Retained value = current value ÷ purchase price × 100%"}</p>
            <p>{isZh ? "每公里折旧 = 累计折旧 ÷ 累计行驶里程" : "Depreciation/km = total depreciation ÷ total mileage"}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "购车价和当前估值应该怎么填？" : "Which purchase price and current value should I use?"}</h2>
          <p>{isZh ? "购车价建议使用车辆交付时为车辆本身支付的落地金额，不把贷款利息、后续保险、保养或停车费重复加入。当前估值应尽量接近实际可成交净价，而不是车商挂牌最高价。可以收集多个同款车报价，剔除车况明显不同的样本后取中间值。" : "Use the amount paid to put the vehicle on the road, without adding loan interest or later running costs. Current value should be a realistic net transaction estimate rather than the highest advertised listing."}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "为什么不用固定年折旧率？" : "Why not use a fixed annual rate?"}</h2>
          <p>{isZh ? "车辆价值通常不是匀速下降。车型换代、品牌价格调整、车况、事故记录、区域需求、里程和车龄都会改变二手价值。固定折旧率适合做情景预算，但已有车辆复盘时，真实市场估值差额通常更容易验证。" : "Vehicle values rarely fall at a constant rate. Model changes, condition, history, local demand, mileage and age all affect resale value. A market-value difference is easier to verify for a vehicle you already own."}</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "影响车辆保值率的常见因素" : "Common factors affecting retained value"}</h2>
          <ul className="grid list-disc gap-2 pl-5 sm:grid-cols-2">
            <li>{isZh ? "车型供需与新车价格变化" : "Supply, demand and new-car price changes"}</li>
            <li>{isZh ? "车龄、里程和使用强度" : "Age, mileage and usage intensity"}</li>
            <li>{isZh ? "事故、维修和保养记录" : "Accident, repair and service history"}</li>
            <li>{isZh ? "配置、颜色与区域偏好" : "Trim, color and regional preferences"}</li>
            <li>{isZh ? "燃油或充电成本变化" : "Fuel or charging cost changes"}</li>
            <li>{isZh ? "质保剩余时间与车辆状态" : "Remaining warranty and condition"}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{isZh ? "常见问题" : "Frequently asked questions"}</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-slate-200 p-4" open><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "保险和购置税算入购车价吗？" : "Should taxes and insurance be included?"}</summary><p className="mt-2">{isZh ? "为了衡量从购车到出售的实际价值损失，可以使用当初不可收回的车辆落地支出；但年度保险属于使用成本，不应重复计入折旧。关键是前后口径保持一致。" : "You may include non-recoverable drive-away vehicle costs, but annual insurance is a running cost and should not be counted again in depreciation. Keep the basis consistent."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "当前估值高于购车价怎么办？" : "What if current value exceeds purchase price?"}</summary><p className="mt-2">{isZh ? "本工具把折旧最低限制为 0，因为它衡量的是价值损失。稀缺车型的升值应单独作为资产收益分析。" : "This tool floors depreciation at zero because it measures value loss. Appreciation for collectible vehicles should be analyzed separately."}</p></details>
            <details className="rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-medium text-slate-800">{isZh ? "年均折旧能预测明年吗？" : "Does the annual average predict next year?"}</summary><p className="mt-2">{isZh ? "不能。它只描述过去的平均损失，未来折旧可能明显高于或低于该数值。" : "No. It summarizes past average loss; future depreciation may be materially different."}</p></details>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Link to="/tools/cost-per-km" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600">{isZh ? "把折旧加入每公里成本" : "Add depreciation to cost per kilometer"}</Link>
          <Link to="/compare" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">{isZh ? "比较油车与电车多年总成本" : "Compare multi-year fuel and EV costs"}</Link>
        </div>
      </article>
    </div>
  );
}
