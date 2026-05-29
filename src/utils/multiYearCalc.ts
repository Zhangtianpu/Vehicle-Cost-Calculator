import type { VehicleType, InsuranceParams, LoanParams, DepreciationParams, MaintenanceParams, CarWashParams, ViolationTollParams, ParkingParams, ModuleToggle, FuelParams } from "@/types";
import { calculateFuelCost } from "./fuelCalc";
import { calculateInsuranceCost } from "./insuranceCalc";
import { calculateLoanCost } from "./loanCalc";

export interface YearlyCostBreakdown {
  year: number;
  fuel: number;
  insurance: number;
  loan: number;
  maintenance: number;
  carWash: number;
  depreciation: number;
  violationToll: number;
  parking: number;
  total: number;
  cumulative: number;
}

export interface MultiYearResult {
  fuel: YearlyCostBreakdown[];
  electric: YearlyCostBreakdown[];
}

export interface VehicleCalcParams {
  fuelParams: FuelParams;
  insuranceParams: InsuranceParams;
  loanParams: LoanParams;
  maintenanceParams: MaintenanceParams;
  depreciationParams: DepreciationParams;
}

const FUEL_DEPRECIATION_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.1,
  4: 0.95,
  5: 0.85,
  6: 0.75,
  7: 0.65,
  8: 0.55,
  9: 0.5,
  10: 0.45,
};

const EV_DEPRECIATION_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.4,
  3: 1.2,
  4: 1.0,
  5: 0.9,
  6: 0.8,
  7: 0.7,
  8: 0.6,
  9: 0.55,
  10: 0.5,
};

function calculateYearlyInsurance(
  baseParams: InsuranceParams,
  vehicleType: VehicleType,
  year: number
): number {
  if (baseParams.customYearlyCost !== null && baseParams.customYearlyCost > 0) {
    return baseParams.customYearlyCost;
  }
  const effectiveNoClaimYears = Math.min(year - 1, 4);
  const paramsWithNoClaim = {
    ...baseParams,
    noClaimYears: effectiveNoClaimYears,
  };
  return calculateInsuranceCost(paramsWithNoClaim, vehicleType).yearlyCost;
}

function calculateYearlyDepreciation(
  params: DepreciationParams,
  vehicleType: VehicleType,
  year: number,
  previousRemainingValue: number
): { depreciation: number; remainingValue: number } {
  if (!params.enabled) {
    return { depreciation: 0, remainingValue: previousRemainingValue };
  }

  const multipliers = vehicleType === "electric" ? EV_DEPRECIATION_MULTIPLIERS : FUEL_DEPRECIATION_MULTIPLIERS;
  const yearMultiplier = multipliers[year] ?? multipliers[10];
  const effectiveRate = (params.yearlyRate / 100) * yearMultiplier;

  const currentValue = year === 1 ? params.vehiclePrice : previousRemainingValue;
  const depreciation = currentValue * effectiveRate;
  const remainingValue = currentValue - depreciation;

  return {
    depreciation: Math.max(0, depreciation),
    remainingValue: Math.max(0, remainingValue),
  };
}

function calculateYearlyLoan(
  params: LoanParams,
  year: number
): number {
  if (year > Math.ceil(params.loanTermMonths / 12)) return 0;
  return calculateLoanCost(params).monthlyPayment * 12;
}

function calculateSingleVehicleYearlyCosts(
  vehicleType: VehicleType,
  params: VehicleCalcParams,
  carWashParams: CarWashParams,
  violationTollParams: ViolationTollParams,
  parkingParams: ParkingParams,
  moduleToggle: ModuleToggle,
  years: number
): YearlyCostBreakdown[] {
  const results: YearlyCostBreakdown[] = [];
  let cumulative = 0;
  let remainingValue = params.depreciationParams.vehiclePrice;

  const baseFuelCost = calculateFuelCost(params.fuelParams).yearlyCost;
  const baseMaintenanceCost = params.maintenanceParams.enabled ? params.maintenanceParams.yearlyCost : 0;
  const baseCarWashCost = carWashParams.enabled ? carWashParams.timesPerMonth * carWashParams.costPerTime * 12 : 0;
  const baseViolationTollCost = violationTollParams.enabled ? violationTollParams.monthlyCost * 12 : 0;
  const baseParkingCost = parkingParams.enabled ? parkingParams.monthlyCost * 12 : 0;

  for (let year = 1; year <= years; year++) {
    const fuel = baseFuelCost;
    const insurance = moduleToggle.insurance ? calculateYearlyInsurance(params.insuranceParams, vehicleType, year) : 0;
    const loan = moduleToggle.loan ? calculateYearlyLoan(params.loanParams, year) : 0;
    const maintenance = moduleToggle.maintenance ? baseMaintenanceCost : 0;
    const carWash = moduleToggle.carWash ? baseCarWashCost : 0;

    let depreciation = 0;
    if (moduleToggle.depreciation) {
      const depResult = calculateYearlyDepreciation(params.depreciationParams, vehicleType, year, remainingValue);
      depreciation = depResult.depreciation;
      remainingValue = depResult.remainingValue;
    }

    const violationToll = moduleToggle.violationToll ? baseViolationTollCost : 0;
    const parking = moduleToggle.parking ? baseParkingCost : 0;

    const total = fuel + insurance + loan + maintenance + carWash + depreciation + violationToll + parking;
    cumulative += total;

    results.push({
      year,
      fuel,
      insurance,
      loan,
      maintenance,
      carWash,
      depreciation,
      violationToll,
      parking,
      total,
      cumulative,
    });
  }

  return results;
}

export function calculateMultiYearCosts(
  fuelVehicleParams: VehicleCalcParams,
  electricVehicleParams: VehicleCalcParams,
  carWashParams: CarWashParams,
  violationTollParams: ViolationTollParams,
  parkingParams: ParkingParams,
  moduleToggle: ModuleToggle,
  years: number
): MultiYearResult {
  const fuelResults = calculateSingleVehicleYearlyCosts(
    "fuel",
    fuelVehicleParams,
    carWashParams,
    violationTollParams,
    parkingParams,
    moduleToggle,
    years
  );

  const electricResults = calculateSingleVehicleYearlyCosts(
    "electric",
    electricVehicleParams,
    carWashParams,
    violationTollParams,
    parkingParams,
    moduleToggle,
    years
  );

  return {
    fuel: fuelResults,
    electric: electricResults,
  };
}
