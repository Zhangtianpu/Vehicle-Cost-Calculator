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

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
