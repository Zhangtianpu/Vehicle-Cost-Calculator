import { Link } from "react-router-dom";
import {
  Fuel,
  Zap,
  Shield,
  Banknote,
  Wrench,
  Droplets,
  TrendingDown,
  AlertTriangle,
  Car,
  BarChart3,
  ArrowLeftRight,
  Languages,
  ToggleLeft,
  Calculator,
  Calendar,
} from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function FeaturesPage() {
  const { t } = useLanguageStore();

  const features = [
    {
      icon: Fuel,
      title: t.features.energyTitle,
      description: t.features.energyDesc,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      icon: Shield,
      title: t.features.insuranceTitle,
      description: t.features.insuranceDesc,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Banknote,
      title: t.features.loanTitle,
      description: t.features.loanDesc,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      icon: Wrench,
      title: t.features.maintenanceTitle,
      description: t.features.maintenanceDesc,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      icon: Droplets,
      title: t.features.carWashTitle,
      description: t.features.carWashDesc,
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
    },
    {
      icon: TrendingDown,
      title: t.features.depreciationTitle,
      description: t.features.depreciationDesc,
      color: "text-rose-500",
      bgColor: "bg-rose-100",
    },
    {
      icon: AlertTriangle,
      title: t.features.violationTitle,
      description: t.features.violationDesc,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: Car,
      title: t.features.parkingTitle,
      description: t.features.parkingDesc,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
    },
  ];

  const highlights = [
    {
      icon: Calendar,
      title: t.features.multiYearTitle,
      description: t.features.multiYearDesc,
    },
    {
      icon: BarChart3,
      title: t.features.compareTitle,
      description: t.features.compareDesc,
    },
    {
      icon: ArrowLeftRight,
      title: t.features.syncTitle,
      description: t.features.syncDesc,
    },
    {
      icon: Languages,
      title: t.features.i18nTitle,
      description: t.features.i18nDesc,
    },
    {
      icon: ToggleLeft,
      title: t.features.toggleTitle,
      description: t.features.toggleDesc,
    },
    {
      icon: Calculator,
      title: t.features.priceSyncTitle,
      description: t.features.priceSyncDesc,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          {t.features.pageTitle}
        </h1>
        <p className="text-slate-500">
          {t.features.pageSubtitle}
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-8">
        <h2 className="text-xl font-bold mb-2">{t.features.heroTitle}</h2>
        <p className="text-emerald-100 mb-4">{t.features.heroDesc}</p>
        <Link
          to="/calculator"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
        >
          {t.features.startCalc}
        </Link>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {t.features.calcModules}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-medium text-slate-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          {t.features.highlightFeatures}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-0.5">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          {t.features.usageTitle}
        </h2>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0">1</span>
            <span>{t.features.step1}</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0">2</span>
            <span>{t.features.step2}</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0">3</span>
            <span>{t.features.step3}</span>
          </li>
          <li className="flex gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center shrink-0">4</span>
            <span>{t.features.step4}</span>
          </li>
        </ol>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/calculator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          {t.features.startCalc}
        </Link>
      </div>
    </div>
  );
}
