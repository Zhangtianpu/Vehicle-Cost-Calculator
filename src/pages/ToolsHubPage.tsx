import { Link } from "react-router-dom";
import { ArrowRight, Banknote, BatteryCharging, Fuel, Gauge, Route, TrendingDown, WalletCards, Wrench } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function ToolsHubPage() {
  const { locale } = useLanguageStore();
  const isZh = locale === "zh";
  const tools = [
    {
      to: "/tools/monthly-car-cost",
      icon: WalletCards,
      title: isZh ? "每月养车成本计算器" : "Monthly Car Cost Calculator",
      description: isZh
        ? "分别计算含月供的现金预算，以及用折旧表示车辆价值损失的真实持有成本。"
        : "Compare monthly cash outflow with economic ownership cost without double-counting loan principal and depreciation.",
    },
    {
      to: "/tools/cost-per-km",
      icon: Gauge,
      title: isZh ? "每公里用车成本计算器" : "Cost per Mile or Kilometer Calculator",
      description: isZh
        ? "把能源、保险、保养、停车和折旧统一换算成每公里现金成本与完整成本。"
        : "Convert energy, insurance, maintenance, parking and depreciation into cash and full cost per mile or kilometer.",
    },
    {
      to: "/tools/ev-break-even",
      icon: Route,
      title: isZh ? "油车电车回本里程计算器" : "Fuel vs EV Break-even Calculator",
      description: isZh
        ? "根据油电单价、能耗、购车差价和年度固定费用，估算电车何时抵消购车差价。"
        : "Estimate EV payback using miles and MPG or metric inputs, plus your energy prices and annual costs.",
    },
    {
      to: "/tools/fuel-cost",
      icon: Fuel,
      title: isZh ? "油费计算器" : "Gas Cost Calculator",
      description: isZh
        ? "按里程、百公里油耗和油价计算用油量、总油费以及每公里和百公里油费。"
        : "Calculate trip gas cost with miles, MPG and price per gallon, or use metric inputs.",
    },
    {
      to: "/tools/depreciation",
      icon: TrendingDown,
      title: isZh ? "汽车折旧计算器" : "Car Depreciation Calculator",
      description: isZh
        ? "用购车价和当前估值计算累计折旧、年均折旧、保值率与每公里折旧。"
        : "Calculate total depreciation, retained value and depreciation per mile or kilometer.",
    },
    {
      to: "/tools/charging-cost",
      icon: BatteryCharging,
      title: isZh ? "新能源汽车充电费用计算器" : "EV Charging Cost Calculator",
      description: isZh
        ? "按里程、电耗、综合电价和充电损耗计算电网取电量、充电费及每公里电费。"
        : "Calculate EV charging cost per mile or kilometer from consumption, electricity price and charging loss.",
    },
    {
      to: "/tools/car-loan",
      icon: Banknote,
      title: isZh ? "车贷月供计算器" : "Car Loan Payment Calculator",
      description: isZh
        ? "按车价、首付、期限、利率和还款方式计算月供、总利息与购车现金支出。"
        : "Estimate payments, total interest and cash outlay using vehicle price, down payment, term and rate.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <Wrench className="h-8 w-8 text-emerald-500" />
          <h1 className="text-2xl font-bold text-slate-800">{isZh ? "免费用车计算工具" : "Free Vehicle Cost Tools"}</h1>
        </div>
        <p className="max-w-3xl text-slate-600 leading-relaxed">
          {isZh
            ? "使用自己的里程、价格和报价得到可复核的结果。所有计算均在浏览器本地完成，不需要注册，也不会上传车辆数据。"
            : "Use your own mileage, prices and quotes for reproducible results. Calculations run locally in your browser with no registration or vehicle-data upload."}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.to} to={tool.to} className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-md">
            <tool.icon className="mb-4 h-9 w-9 text-emerald-500" />
            <h2 className="mb-2 text-lg font-semibold text-slate-800">{tool.title}</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">{tool.description}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
              {isZh ? "打开工具" : "Open tool"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-slate-100 p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">{isZh ? "需要完整的多年对比？" : "Need a complete multi-year comparison?"}</h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          {isZh ? "完整计算器还支持车贷、保险险种、折旧曲线、模块开关和 1–10 年油电累计成本对比。" : "The full calculator also supports financing, annual insurance quotes, depreciation scenarios, module toggles and 1–10 year gas-vs-EV totals."}
        </p>
        <Link to="/calculator" className="inline-flex rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          {isZh ? "进入完整计算器" : "Open the full calculator"}
        </Link>
      </section>
    </div>
  );
}
