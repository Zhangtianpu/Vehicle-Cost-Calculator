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
import AdSidebar from "@/components/layout/AdSidebar";

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <FuelCalculator />
          <AdBanner className="lg:hidden" />
          <InsuranceCalculator />
          <AdBanner className="lg:hidden" />
          <LoanCalculator />
          <MaintenanceCalculator />
          <CarWashCalculator />
          <DepreciationCalculator />
          <ViolationTollCalculator />
          <ParkingCalculator />
          <CostSummary />
          <AdBanner />
        </div>
        <div className="hidden lg:flex flex-col gap-6 shrink-0">
          <AdSidebar />
          <AdSidebar slot="XXXXXXXXX2" />
        </div>
      </div>
    </div>
  );
}
