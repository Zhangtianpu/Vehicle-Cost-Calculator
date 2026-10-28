import type { LoanParams, LoanResult } from "@/types";
import { calculateLoanCost } from "./loanCalc";

export type MonthlyCarEnergyType = "gas" | "electric";
export type MonthlyCarUnitSystem = "us" | "metric";

export interface LeaseVsBuyInput {
  purchasePrice: number;
  buyDownPayment: number;
  buyTaxAndFees: number;
  loanAnnualRate: number;
  loanTermMonths: number;
  comparisonMonths: number;
  estimatedResaleValue: number;
  buyOtherCosts: number;
  leaseMonthlyPayment: number;
  leaseDueAtSigning: number;
  leaseAcquisitionFee: number;
  leaseDispositionFee: number;
  leaseEndCharges: number;
}

export type LeaseVsBuyChoice = "buy" | "lease" | "equal";

export interface LeaseVsBuyResult {
  buyLoanAmount: number;
  buyMonthlyPayment: number;
  buyPaymentsMade: number;
  buyInterestPaid: number;
  remainingLoanBalance: number;
  buyerEquity: number;
  buyCashPaid: number;
  buyNetCost: number;
  leaseTotalCost: number;
  buyMonthlyEquivalent: number;
  leaseMonthlyEquivalent: number;
  difference: number;
  lowerCostChoice: LeaseVsBuyChoice;
}

export function calculateLeaseVsBuy(input: LeaseVsBuyInput): LeaseVsBuyResult {
  const purchasePrice = Math.max(0, input.purchasePrice);
  const buyDownPayment = Math.min(purchasePrice, Math.max(0, input.buyDownPayment));
  const buyLoanAmount = Math.max(0, purchasePrice - buyDownPayment);
  const loanTermMonths = Math.max(0, Math.round(input.loanTermMonths));
  const comparisonMonths = Math.max(0, Math.round(input.comparisonMonths));
  const monthlyRate = Math.max(0, input.loanAnnualRate) / 100 / 12;
  const buyMonthlyPayment = buyLoanAmount === 0 || loanTermMonths === 0
    ? 0
    : monthlyRate === 0
      ? buyLoanAmount / loanTermMonths
      : buyLoanAmount * monthlyRate / (1 - (1 + monthlyRate) ** -loanTermMonths);
  const buyPaymentsMade = Math.min(comparisonMonths, loanTermMonths);
  const remainingLoanBalance = buyLoanAmount === 0 || buyPaymentsMade >= loanTermMonths
    ? 0
    : monthlyRate === 0
      ? Math.max(0, buyLoanAmount - buyMonthlyPayment * buyPaymentsMade)
      : Math.max(0, buyLoanAmount * (1 + monthlyRate) ** buyPaymentsMade - buyMonthlyPayment * (((1 + monthlyRate) ** buyPaymentsMade - 1) / monthlyRate));
  const principalPaid = buyLoanAmount - remainingLoanBalance;
  const buyInterestPaid = Math.max(0, buyMonthlyPayment * buyPaymentsMade - principalPaid);
  const buyerEquity = Math.max(0, input.estimatedResaleValue) - remainingLoanBalance;
  const buyCashPaid = buyDownPayment
    + Math.max(0, input.buyTaxAndFees)
    + buyMonthlyPayment * buyPaymentsMade
    + Math.max(0, input.buyOtherCosts);
  const buyNetCost = buyCashPaid - buyerEquity;
  const leaseTotalCost = Math.max(0, input.leaseDueAtSigning)
    + Math.max(0, input.leaseAcquisitionFee)
    + Math.max(0, input.leaseMonthlyPayment) * comparisonMonths
    + Math.max(0, input.leaseDispositionFee)
    + Math.max(0, input.leaseEndCharges);
  const difference = Math.abs(buyNetCost - leaseTotalCost);
  const lowerCostChoice: LeaseVsBuyChoice = difference < 0.01
    ? "equal"
    : buyNetCost < leaseTotalCost ? "buy" : "lease";

  return {
    buyLoanAmount,
    buyMonthlyPayment,
    buyPaymentsMade,
    buyInterestPaid,
    remainingLoanBalance,
    buyerEquity,
    buyCashPaid,
    buyNetCost,
    leaseTotalCost,
    buyMonthlyEquivalent: comparisonMonths > 0 ? buyNetCost / comparisonMonths : 0,
    leaseMonthlyEquivalent: comparisonMonths > 0 ? leaseTotalCost / comparisonMonths : 0,
    difference,
    lowerCostChoice,
  };
}

export interface CarAffordabilityInput {
  monthlyTakeHomeIncome: number;
  transportationBudgetPercent: number;
  monthlyInsurance: number;
  monthlyEnergy: number;
  monthlyMaintenance: number;
  monthlyParking: number;
  monthlyRegistration: number;
  downPayment: number;
  tradeInValue: number;
  tradeInPayoff: number;
  annualRate: number;
  loanTermMonths: number;
  salesTaxPercent: number;
  upfrontFees: number;
}

export interface CarAffordabilityResult {
  transportationBudgetMonthly: number;
  nonLoanCostsMonthly: number;
  maxLoanPayment: number;
  maxLoanAmount: number;
  maxVehiclePrice: number;
  netTradeIn: number;
  totalLoanPayments: number;
  totalInterest: number;
  paymentToIncomePercent: number | null;
  totalCostToIncomePercent: number | null;
  operatingCostOverBudget: number;
}

export function calculateCarAffordability(input: CarAffordabilityInput): CarAffordabilityResult {
  const income = Math.max(0, input.monthlyTakeHomeIncome);
  const budgetRate = Math.max(0, input.transportationBudgetPercent) / 100;
  const transportationBudgetMonthly = income * budgetRate;
  const nonLoanCostsMonthly = [
    input.monthlyInsurance,
    input.monthlyEnergy,
    input.monthlyMaintenance,
    input.monthlyParking,
    input.monthlyRegistration,
  ].reduce((total, value) => total + Math.max(0, value), 0);
  const budgetRoom = transportationBudgetMonthly - nonLoanCostsMonthly;
  const maxLoanPayment = Math.max(0, budgetRoom);
  const term = Math.max(0, Math.round(input.loanTermMonths));
  const monthlyRate = Math.max(0, input.annualRate) / 100 / 12;
  const maxLoanAmount = term === 0
    ? 0
    : monthlyRate === 0
      ? maxLoanPayment * term
      : maxLoanPayment * (1 - (1 + monthlyRate) ** -term) / monthlyRate;
  const netTradeIn = Math.max(0, input.tradeInValue) - Math.max(0, input.tradeInPayoff);
  const availableForTaxedPrice = maxLoanAmount + Math.max(0, input.downPayment) + netTradeIn - Math.max(0, input.upfrontFees);
  const taxMultiplier = 1 + Math.max(0, input.salesTaxPercent) / 100;
  const maxVehiclePrice = budgetRoom < 0 ? 0 : Math.max(0, availableForTaxedPrice / taxMultiplier);
  const totalLoanPayments = maxLoanPayment * term;
  const totalInterest = Math.max(0, totalLoanPayments - maxLoanAmount);

  return {
    transportationBudgetMonthly,
    nonLoanCostsMonthly,
    maxLoanPayment,
    maxLoanAmount,
    maxVehiclePrice,
    netTradeIn,
    totalLoanPayments,
    totalInterest,
    paymentToIncomePercent: income > 0 ? maxLoanPayment / income * 100 : null,
    totalCostToIncomePercent: income > 0 ? (maxLoanPayment + nonLoanCostsMonthly) / income * 100 : null,
    operatingCostOverBudget: Math.max(0, -budgetRoom),
  };
}

export interface MonthlyCarCostInput {
  unitSystem: MonthlyCarUnitSystem;
  energyType: MonthlyCarEnergyType;
  annualDistance: number;
  efficiency: number;
  energyPrice: number;
  annualInsurance: number;
  monthlyLoanPayment: number;
  annualLoanInterest: number;
  annualMaintenance: number;
  monthlyParkingAndTolls: number;
  annualRegistration: number;
  annualDepreciation: number;
}

export interface MonthlyCarCostResult {
  monthlyEnergy: number;
  monthlyInsurance: number;
  monthlyLoanInterest: number;
  monthlyMaintenance: number;
  monthlyRegistration: number;
  operatingMonthly: number;
  cashBudgetMonthly: number;
  ownershipCostMonthly: number;
  ownershipCostPerDistance: number | null;
}

export function calculateMonthlyCarCost(input: MonthlyCarCostInput): MonthlyCarCostResult {
  const annualDistance = Math.max(0, input.annualDistance);
  const efficiency = Math.max(0, input.efficiency);
  const energyPrice = Math.max(0, input.energyPrice);
  const annualEnergy = input.energyType === "gas" && input.unitSystem === "us"
    ? efficiency > 0 ? annualDistance / efficiency * energyPrice : 0
    : annualDistance / 100 * efficiency * energyPrice;
  const monthlyEnergy = annualEnergy / 12;
  const monthlyInsurance = Math.max(0, input.annualInsurance) / 12;
  const monthlyLoanInterest = Math.max(0, input.annualLoanInterest) / 12;
  const monthlyMaintenance = Math.max(0, input.annualMaintenance) / 12;
  const monthlyRegistration = Math.max(0, input.annualRegistration) / 12;
  const monthlyParkingAndTolls = Math.max(0, input.monthlyParkingAndTolls);
  const operatingMonthly = monthlyEnergy + monthlyInsurance + monthlyMaintenance + monthlyParkingAndTolls + monthlyRegistration;
  const cashBudgetMonthly = operatingMonthly + Math.max(0, input.monthlyLoanPayment);
  const ownershipCostMonthly = operatingMonthly + monthlyLoanInterest + Math.max(0, input.annualDepreciation) / 12;

  return {
    monthlyEnergy,
    monthlyInsurance,
    monthlyLoanInterest,
    monthlyMaintenance,
    monthlyRegistration,
    operatingMonthly,
    cashBudgetMonthly,
    ownershipCostMonthly,
    ownershipCostPerDistance: annualDistance > 0 ? ownershipCostMonthly * 12 / annualDistance : null,
  };
}

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

export interface UsEvBreakEvenInput {
  annualMiles: number;
  mpg: number;
  fuelPricePerGallon: number;
  evKwhPer100Miles: number;
  electricityPrice: number;
  pricePremium: number;
  annualFixedDifference: number;
}

export function calculateUsEvBreakEven(input: UsEvBreakEvenInput): EvBreakEvenResult {
  const annualMiles = Math.max(0, input.annualMiles);
  const mpg = Math.max(0, input.mpg);
  const fuelPer100 = mpg > 0 ? 100 / mpg * Math.max(0, input.fuelPricePerGallon) : 0;
  const evPer100 = Math.max(0, input.evKwhPer100Miles) * Math.max(0, input.electricityPrice);
  const savingPerMile = (fuelPer100 - evPer100) / 100;
  const annualEnergySaving = savingPerMile * annualMiles;
  const netAnnualSaving = annualEnergySaving - Math.max(0, input.annualFixedDifference);
  const immediate = input.pricePremium <= 0;
  const canBreakEven = immediate || (mpg > 0 && savingPerMile > 0 && netAnnualSaving > 0 && annualMiles > 0);
  const years = immediate ? 0 : canBreakEven ? input.pricePremium / netAnnualSaving : null;

  return {
    fuelPer100,
    evPer100,
    savingPerKm: savingPerMile,
    annualEnergySaving,
    netAnnualSaving,
    canBreakEven,
    immediate,
    years,
    distance: years === null ? null : years * annualMiles,
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

export interface UsFuelCostInput {
  distanceMiles: number;
  mpg: number;
  fuelPricePerGallon: number;
}

export interface UsFuelCostResult {
  gallons: number;
  totalCost: number;
  costPerMile: number | null;
  costPer100Miles: number | null;
}

export function calculateUsFuelCost(input: UsFuelCostInput): UsFuelCostResult {
  const distanceMiles = Math.max(0, input.distanceMiles);
  const mpg = Math.max(0, input.mpg);
  const fuelPricePerGallon = Math.max(0, input.fuelPricePerGallon);
  const gallons = mpg > 0 ? distanceMiles / mpg : 0;
  const totalCost = gallons * fuelPricePerGallon;
  const hasValidDistanceAndEconomy = distanceMiles > 0 && mpg > 0;

  return {
    gallons,
    totalCost,
    costPerMile: hasValidDistanceAndEconomy ? totalCost / distanceMiles : null,
    costPer100Miles: hasValidDistanceAndEconomy ? totalCost / distanceMiles * 100 : null,
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

export interface UsChargingCostInput {
  distanceMiles: number;
  consumptionPer100Miles: number;
  electricityPrice: number;
  chargingLossPercent: number;
}

export interface UsChargingCostResult {
  vehicleEnergy: number;
  gridEnergy: number;
  totalCost: number;
  costPerMile: number | null;
  costPer100Miles: number;
}

export function calculateUsChargingCost(input: UsChargingCostInput): UsChargingCostResult {
  const distanceMiles = Math.max(0, input.distanceMiles);
  const consumptionPer100Miles = Math.max(0, input.consumptionPer100Miles);
  const electricityPrice = Math.max(0, input.electricityPrice);
  const chargingLossPercent = Math.min(99, Math.max(0, input.chargingLossPercent));
  const vehicleEnergy = distanceMiles * consumptionPer100Miles / 100;
  const gridEnergy = vehicleEnergy / (1 - chargingLossPercent / 100);
  const totalCost = gridEnergy * electricityPrice;

  return {
    vehicleEnergy,
    gridEnergy,
    totalCost,
    costPerMile: distanceMiles > 0 ? totalCost / distanceMiles : null,
    costPer100Miles: distanceMiles > 0 ? totalCost / distanceMiles * 100 : 0,
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
