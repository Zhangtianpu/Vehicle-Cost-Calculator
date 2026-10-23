import type { LoanParams, LoanResult } from "@/types";
import { calculateLoanCost } from "./loanCalc";

export interface CostPerKmInput {
  annualMileage: number;
  energy: number;
  insurance: number;
  maintenance: number;
  parking: number;
  tolls: number;
  washing: number;
  other: number;
  depreciation: number;
}

export interface CostPerKmResult {
  cashCost: number;
  fullCost: number;
  cashPerKm: number | null;
  fullPerKm: number | null;
  monthlyCash: number;
}

export function calculateCostPerKm(input: CostPerKmInput): CostPerKmResult {
  const cashCost = input.energy + input.insurance + input.maintenance + input.parking + input.tolls + input.washing + input.other;
  const fullCost = cashCost + input.depreciation;
  return {
    cashCost,
    fullCost,
    cashPerKm: input.annualMileage > 0 ? cashCost / input.annualMileage : null,
    fullPerKm: input.annualMileage > 0 ? fullCost / input.annualMileage : null,
    monthlyCash: cashCost / 12,
  };
}

export interface EvBreakEvenInput {
  annualMileage: number;
  fuelConsumption: number;
  fuelPrice: number;
  evConsumption: number;
  electricityPrice: number;
  pricePremium: number;
  annualFixedDifference: number;
}

export interface EvBreakEvenResult {
  fuelPer100: number;
  evPer100: number;
  savingPerKm: number;
  annualEnergySaving: number;
  netAnnualSaving: number;
  canBreakEven: boolean;
  immediate: boolean;
  years: number | null;
  distance: number | null;
}

export function calculateEvBreakEven(input: EvBreakEvenInput): EvBreakEvenResult {
  const fuelPer100 = input.fuelConsumption * input.fuelPrice;
  const evPer100 = input.evConsumption * input.electricityPrice;
  const savingPerKm = (fuelPer100 - evPer100) / 100;
  const annualEnergySaving = savingPerKm * input.annualMileage;
  const netAnnualSaving = annualEnergySaving - input.annualFixedDifference;
  const immediate = input.pricePremium <= 0;
  const canBreakEven = immediate || (savingPerKm > 0 && netAnnualSaving > 0 && input.annualMileage > 0);
  const years = immediate ? 0 : canBreakEven ? input.pricePremium / netAnnualSaving : null;

  return {
    fuelPer100,
    evPer100,
    savingPerKm,
    annualEnergySaving,
    netAnnualSaving,
    canBreakEven,
    immediate,
    years,
    distance: years === null ? null : years * input.annualMileage,
  };
}

export interface FuelCostInput {
  distance: number;
  consumptionPer100Km: number;
  fuelPrice: number;
}

export interface FuelCostResult {
  liters: number;
  totalCost: number;
  costPerKm: number | null;
  costPer100Km: number;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const distance = Math.max(0, input.distance);
  const consumptionPer100Km = Math.max(0, input.consumptionPer100Km);
  const fuelPrice = Math.max(0, input.fuelPrice);
  const liters = distance * consumptionPer100Km / 100;
  const totalCost = liters * fuelPrice;

  return {
    liters,
    totalCost,
    costPerKm: distance > 0 ? totalCost / distance : null,
    costPer100Km: consumptionPer100Km * fuelPrice,
  };
}

export interface DepreciationInput {
  purchasePrice: number;
  currentValue: number;
  yearsOwned: number;
  totalMileage: number;
}

export interface DepreciationResult {
  totalDepreciation: number;
  depreciationRate: number | null;
  retainedValueRate: number | null;
  annualDepreciation: number | null;
  depreciationPerKm: number | null;
}

export function calculateDepreciation(input: DepreciationInput): DepreciationResult {
  const purchasePrice = Math.max(0, input.purchasePrice);
  const currentValue = Math.max(0, input.currentValue);
  const yearsOwned = Math.max(0, input.yearsOwned);
  const totalMileage = Math.max(0, input.totalMileage);
  const totalDepreciation = Math.max(0, purchasePrice - currentValue);

  return {
    totalDepreciation,
    depreciationRate: purchasePrice > 0 ? totalDepreciation / purchasePrice * 100 : null,
    retainedValueRate: purchasePrice > 0 ? currentValue / purchasePrice * 100 : null,
    annualDepreciation: yearsOwned > 0 ? totalDepreciation / yearsOwned : null,
    depreciationPerKm: totalMileage > 0 ? totalDepreciation / totalMileage : null,
  };
}

export interface ChargingCostInput {
  distance: number;
  consumptionPer100Km: number;
  electricityPrice: number;
  chargingLossPercent: number;
}

export interface ChargingCostResult {
  vehicleEnergy: number;
  gridEnergy: number;
  totalCost: number;
  costPerKm: number | null;
  costPer100Km: number;
}

export function calculateChargingCost(input: ChargingCostInput): ChargingCostResult {
  const distance = Math.max(0, input.distance);
  const consumptionPer100Km = Math.max(0, input.consumptionPer100Km);
  const electricityPrice = Math.max(0, input.electricityPrice);
  const chargingLossPercent = Math.min(99, Math.max(0, input.chargingLossPercent));
  const vehicleEnergy = distance * consumptionPer100Km / 100;
  const gridEnergy = vehicleEnergy / (1 - chargingLossPercent / 100);
  const totalCost = gridEnergy * electricityPrice;

  return {
    vehicleEnergy,
    gridEnergy,
    totalCost,
    costPerKm: distance > 0 ? totalCost / distance : null,
    costPer100Km: distance > 0 ? totalCost / distance * 100 : 0,
  };
}

export interface CarLoanInput {
  vehiclePrice: number;
  downPaymentPercent: number;
  loanTermMonths: number;
  annualRate: number;
  repaymentMethod: LoanParams["repaymentMethod"];
}

export interface CarLoanResult extends LoanResult {
  totalCashOutlay: number;
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const result = calculateLoanCost({
    vehiclePrice: Math.max(0, input.vehiclePrice),
    downPaymentRatio: Math.min(100, Math.max(0, input.downPaymentPercent)) / 100,
    loanTermMonths: Math.max(0, Math.round(input.loanTermMonths)),
    annualRate: Math.max(0, input.annualRate),
    repaymentMethod: input.repaymentMethod,
  });

  return {
    ...result,
    totalCashOutlay: Math.round((result.downPayment + result.totalPayment) * 100) / 100,
  };
}
