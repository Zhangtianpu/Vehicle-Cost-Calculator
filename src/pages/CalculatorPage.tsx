import { Link } from "react-router-dom";
import FuelCalculator from "@/components/calculator/FuelCalculator";
import InsuranceCalculator from "@/components/calculator/InsuranceCalculator";
import LoanCalculator from "@/components/calculator/LoanCalculator";
import MaintenanceCalculator from "@/components/calculator/MaintenanceCalculator";
import CarWashCalculator from "@/components/calculator/CarWashCalculator";
import DepreciationCalculator from "@/components/calculator/DepreciationCalculator";
import ViolationTollCalculator from "@/components/calculator/ViolationTollCalculator";
import ParkingCalculator from "@/components/calculator/ParkingCalculator";
import CostSummary from "@/components/calculator/CostSummary";
import AdBanner from "@/components/layout/AdBanner";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function CalculatorPage() {
  const { locale } = useLanguageStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {locale === "zh" ? "用车成本计算器" : "Vehicle Cost Calculator"}
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {locale === "zh"
            ? "支持美制与公制单位，按您的实际里程、能源价格、保险、车贷、保养、停车和折旧参数估算月度与年度养车成本。"
            : "Use US miles, MPG and price per gallon—or switch to metric—to estimate monthly and annual ownership costs including insurance, financing, maintenance, parking and depreciation."}
        </p>
        <Link to="/methodology" className="mt-2 inline-flex text-xs font-medium text-emerald-600 hover:text-emerald-700">
          {locale === "zh" ? "查看公式、假设与限制 →" : "Review formulas, assumptions and limitations →"}
        </Link>
      </div>
      <div className="space-y-6">
        <FuelCalculator />
        <InsuranceCalculator />
        <LoanCalculator />
        <MaintenanceCalculator />
        <CarWashCalculator />
        <DepreciationCalculator />
        <ViolationTollCalculator />
        <ParkingCalculator />
        <CostSummary />
        <AdBanner />
      </div>
    </div>
  );
}
