import assert from "node:assert/strict";
import { calculateLoanCost } from "../src/utils/loanCalc";
import { calculateFuelCost as calculateOwnershipEnergyCost, convertFuelParamsUnit } from "../src/utils/fuelCalc";
import { calculateMultiYearCosts, type VehicleCalcParams } from "../src/utils/multiYearCalc";
import type { ModuleToggle } from "../src/types";
import {
  calculateCostPerKm,
  calculateCarLoan,
  calculateChargingCost,
  calculateDepreciation,
  calculateEvBreakEven,
  calculateUsEvBreakEven,
  calculateFuelCost,
  calculateUsFuelCost,
  calculateUsChargingCost,
  calculateMonthlyCarCost,
  calculateCarAffordability,
  calculateLeaseVsBuy,
} from "../src/utils/quickTools";

const leaseVsBuy = calculateLeaseVsBuy({
  purchasePrice: 40000,
  buyDownPayment: 5000,
  buyTaxAndFees: 3500,
  loanAnnualRate: 6,
  loanTermMonths: 60,
  comparisonMonths: 36,
  estimatedResaleValue: 25000,
  buyOtherCosts: 500,
  leaseMonthlyPayment: 500,
  leaseDueAtSigning: 3000,
  leaseAcquisitionFee: 695,
  leaseDispositionFee: 395,
  leaseEndCharges: 500,
});
assert.ok(Math.abs(leaseVsBuy.buyMonthlyPayment - 676.6481) < 0.01);
assert.ok(Math.abs(leaseVsBuy.remainingLoanBalance - 15267.1195) < 0.01);
assert.ok(Math.abs(leaseVsBuy.buyerEquity - 9732.8805) < 0.01);
assert.ok(Math.abs(leaseVsBuy.buyNetCost - 23626.4494) < 0.01);
assert.equal(leaseVsBuy.leaseTotalCost, 22590);
assert.equal(leaseVsBuy.lowerCostChoice, "lease");
assert.ok(Math.abs(leaseVsBuy.difference - 1036.4494) < 0.01);

const zeroRatePurchase = calculateLeaseVsBuy({
  ...leaseVsBuy,
  purchasePrice: 12000,
  buyDownPayment: 0,
  buyTaxAndFees: 0,
  loanAnnualRate: 0,
  loanTermMonths: 24,
  comparisonMonths: 12,
  estimatedResaleValue: 9000,
  buyOtherCosts: 0,
  leaseMonthlyPayment: 0,
  leaseDueAtSigning: 0,
  leaseAcquisitionFee: 0,
  leaseDispositionFee: 0,
  leaseEndCharges: 0,
});
assert.equal(zeroRatePurchase.buyMonthlyPayment, 500);
assert.equal(zeroRatePurchase.remainingLoanBalance, 6000);
assert.equal(zeroRatePurchase.buyInterestPaid, 0);
assert.equal(zeroRatePurchase.buyNetCost, 3000);

const affordability = calculateCarAffordability({
  monthlyTakeHomeIncome: 6000,
  transportationBudgetPercent: 15,
  monthlyInsurance: 150,
  monthlyEnergy: 150,
  monthlyMaintenance: 75,
  monthlyParking: 50,
  monthlyRegistration: 25,
  downPayment: 5000,
  tradeInValue: 3000,
  tradeInPayoff: 1000,
  annualRate: 6,
  loanTermMonths: 60,
  salesTaxPercent: 8,
  upfrontFees: 1000,
});
assert.equal(affordability.transportationBudgetMonthly, 900);
assert.equal(affordability.nonLoanCostsMonthly, 450);
assert.equal(affordability.maxLoanPayment, 450);
assert.ok(Math.abs(affordability.maxLoanAmount - 23276.5024) < 0.01);
assert.ok(Math.abs(affordability.maxVehiclePrice - 27107.8725) < 0.01);
assert.ok(Math.abs(affordability.totalInterest - 3723.4976) < 0.01);
assert.equal(affordability.paymentToIncomePercent, 7.5);
assert.equal(affordability.totalCostToIncomePercent, 15);

const noRoomAffordability = calculateCarAffordability({
  ...affordability,
  monthlyTakeHomeIncome: 1000,
  transportationBudgetPercent: 10,
  monthlyInsurance: 150,
  monthlyEnergy: 100,
  monthlyMaintenance: 0,
  monthlyParking: 0,
  monthlyRegistration: 0,
  downPayment: 10000,
  tradeInValue: 0,
  tradeInPayoff: 0,
  annualRate: 0,
  loanTermMonths: 0,
  salesTaxPercent: 0,
  upfrontFees: 0,
});
assert.equal(noRoomAffordability.maxVehiclePrice, 0);
assert.equal(noRoomAffordability.operatingCostOverBudget, 150);

const monthlyGasCost = calculateMonthlyCarCost({
  unitSystem: "us",
  energyType: "gas",
  annualDistance: 12000,
  efficiency: 25,
  energyPrice: 3.5,
  annualInsurance: 1500,
  monthlyLoanPayment: 500,
  annualLoanInterest: 1200,
  annualMaintenance: 800,
  monthlyParkingAndTolls: 150,
  annualRegistration: 200,
  annualDepreciation: 5000,
});
assert.equal(monthlyGasCost.monthlyEnergy, 140);
assert.ok(Math.abs(monthlyGasCost.operatingMonthly - 498.3333333333) < 0.000001);
assert.ok(Math.abs(monthlyGasCost.cashBudgetMonthly - 998.3333333333) < 0.000001);
assert.equal(monthlyGasCost.monthlyLoanInterest, 100);
assert.equal(monthlyGasCost.ownershipCostMonthly, 1015);
assert.equal(monthlyGasCost.ownershipCostPerDistance, 1.015);

const monthlyEvCost = calculateMonthlyCarCost({
  ...monthlyGasCost,
  unitSystem: "us",
  energyType: "electric",
  annualDistance: 12000,
  efficiency: 30,
  energyPrice: 0.18,
  annualInsurance: 1500,
  monthlyLoanPayment: 500,
  annualLoanInterest: 1200,
  annualMaintenance: 800,
  monthlyParkingAndTolls: 150,
  annualRegistration: 200,
  annualDepreciation: 5000,
});
assert.equal(monthlyEvCost.monthlyEnergy, 54);
assert.equal(calculateMonthlyCarCost({ ...monthlyEvCost, unitSystem: "metric", energyType: "gas", annualDistance: 0, efficiency: 0, energyPrice: 0, annualInsurance: 0, monthlyLoanPayment: 0, annualLoanInterest: 0, annualMaintenance: 0, monthlyParkingAndTolls: 0, annualRegistration: 0, annualDepreciation: 0 }).ownershipCostPerDistance, null);

const equalPrincipal = calculateLoanCost({
  vehiclePrice: 120000,
  downPaymentRatio: 0,
  loanTermMonths: 12,
  annualRate: 12,
  repaymentMethod: "equal_principal",
});

assert.equal(equalPrincipal.monthlyPayment, 11200);
assert.equal(equalPrincipal.totalInterest, 7800);
assert.equal(equalPrincipal.yearlyCost, 127800);

const interestFree = calculateLoanCost({
  vehiclePrice: 120000,
  downPaymentRatio: 0,
  loanTermMonths: 12,
  annualRate: 0,
  repaymentMethod: "equal_installment",
});

assert.equal(interestFree.monthlyPayment, 10000);
assert.equal(interestFree.yearlyCost, 120000);
assert.equal(interestFree.totalInterest, 0);

const vehicleParams: VehicleCalcParams = {
  fuelParams: { unitSystem: "metric", mileage: 0, mileagePeriod: "yearly", fuelPrice: 0, efficiency: 0 },
  insuranceParams: {
    vehiclePrice: 120000,
    seatCount: 5,
    vehicleAge: 1,
    compulsory: false,
    vehicleDamage: false,
    thirdPartyLiability: false,
    thirdPartyAmount: 200,
    passengerLiability: false,
    passengerSeats: 5,
    noClaimYears: 0,
    additionalEV: false,
    customYearlyCost: null,
  },
  loanParams: {
    vehiclePrice: 120000,
    downPaymentRatio: 0,
    loanTermMonths: 24,
    annualRate: 12,
    repaymentMethod: "equal_principal",
  },
  maintenanceParams: { enabled: false, yearlyCost: 0 },
  depreciationParams: { enabled: false, vehiclePrice: 120000, yearlyRate: 0 },
};

const modules: ModuleToggle = {
  insurance: false,
  loan: true,
  maintenance: false,
  carWash: false,
  depreciation: false,
  violationToll: false,
  parking: false,
};

const multiYear = calculateMultiYearCosts(
  vehicleParams,
  vehicleParams,
  { enabled: false, timesPerMonth: 0, costPerTime: 0 },
  { enabled: false, monthlyCost: 0 },
  { enabled: false, monthlyCost: 0 },
  modules,
  2,
);

assert.equal(multiYear.fuel[0].loan, 71100);
assert.equal(multiYear.fuel[1].loan, 63900);
assert.equal(multiYear.fuel[1].cumulative, 135000);

const usGasOwnership = {
  unitSystem: "us" as const,
  mileage: 1000,
  mileagePeriod: "monthly" as const,
  fuelPrice: 3.5,
  efficiency: 25,
};
assert.deepEqual(calculateOwnershipEnergyCost(usGasOwnership, "fuel"), { monthlyCost: 140, yearlyCost: 1680 });

const usEvOwnership = {
  unitSystem: "us" as const,
  mileage: 1000,
  mileagePeriod: "monthly" as const,
  fuelPrice: 0.18,
  efficiency: 30,
};
assert.deepEqual(calculateOwnershipEnergyCost(usEvOwnership, "electric"), { monthlyCost: 54, yearlyCost: 648 });

const metricGasOwnership = convertFuelParamsUnit(usGasOwnership, "fuel", "metric");
const metricEvOwnership = convertFuelParamsUnit(usEvOwnership, "electric", "metric");
assert.equal(metricGasOwnership.unitSystem, "metric");
assert.equal(metricEvOwnership.unitSystem, "metric");
assert.ok(Math.abs(calculateOwnershipEnergyCost(metricGasOwnership, "fuel").monthlyCost - 140) < 0.1);
assert.ok(Math.abs(calculateOwnershipEnergyCost(metricEvOwnership, "electric").monthlyCost - 54) < 0.1);
assert.deepEqual(calculateOwnershipEnergyCost({ ...usGasOwnership, efficiency: 0 }, "fuel"), { monthlyCost: 0, yearlyCost: 0 });

const perKm = calculateCostPerKm({
  annualMileage: 15000,
  energy: 9000,
  insurance: 5000,
  maintenance: 1800,
  parking: 3600,
  tolls: 1200,
  washing: 840,
  other: 500,
  depreciation: 18000,
});
assert.equal(perKm.cashCost, 21940);
assert.equal(perKm.fullCost, 39940);
assert.ok(Math.abs(perKm.cashPerKm! - 1.4626666667) < 0.000001);
assert.equal(calculateCostPerKm({ ...perKm, annualMileage: 0, energy: 0, insurance: 0, maintenance: 0, parking: 0, tolls: 0, washing: 0, other: 0, depreciation: 0 }).cashPerKm, null);

const breakEven = calculateEvBreakEven({
  annualMileage: 15000,
  fuelConsumption: 8,
  fuelPrice: 7.5,
  evConsumption: 15,
  electricityPrice: 0.6,
  pricePremium: 30000,
  annualFixedDifference: 500,
});
assert.equal(breakEven.fuelPer100, 60);
assert.equal(breakEven.evPer100, 9);
assert.equal(breakEven.netAnnualSaving, 7150);
assert.ok(Math.abs(breakEven.years! - 30000 / 7150) < 0.000001);

const noBreakEven = calculateEvBreakEven({
  annualMileage: 10000,
  fuelConsumption: 5,
  fuelPrice: 7,
  evConsumption: 20,
  electricityPrice: 2,
  pricePremium: 20000,
  annualFixedDifference: 0,
});
assert.equal(noBreakEven.canBreakEven, false);
assert.equal(noBreakEven.years, null);

const usBreakEven = calculateUsEvBreakEven({
  annualMiles: 12000,
  mpg: 25,
  fuelPricePerGallon: 3.5,
  evKwhPer100Miles: 30,
  electricityPrice: 0.18,
  pricePremium: 5000,
  annualFixedDifference: 250,
});
assert.equal(usBreakEven.fuelPer100, 14);
assert.ok(Math.abs(usBreakEven.evPer100 - 5.4) < 0.000001);
assert.ok(Math.abs(usBreakEven.netAnnualSaving - 782) < 0.000001);
assert.ok(Math.abs(usBreakEven.years! - 5000 / 782) < 0.000001);

const fuelCost = calculateFuelCost({
  distance: 500,
  consumptionPer100Km: 8,
  fuelPrice: 7.5,
});
assert.equal(fuelCost.liters, 40);
assert.equal(fuelCost.totalCost, 300);
assert.equal(fuelCost.costPerKm, 0.6);
assert.equal(fuelCost.costPer100Km, 60);
assert.equal(calculateFuelCost({ distance: 0, consumptionPer100Km: 8, fuelPrice: 7.5 }).costPerKm, null);

const usFuelCost = calculateUsFuelCost({
  distanceMiles: 300,
  mpg: 25,
  fuelPricePerGallon: 3.5,
});
assert.equal(usFuelCost.gallons, 12);
assert.equal(usFuelCost.totalCost, 42);
assert.equal(usFuelCost.costPerMile, 0.14);
assert.ok(Math.abs(usFuelCost.costPer100Miles! - 14) < 0.000001);
assert.equal(calculateUsFuelCost({ distanceMiles: 300, mpg: 0, fuelPricePerGallon: 3.5 }).costPerMile, null);

const depreciation = calculateDepreciation({
  purchasePrice: 150000,
  currentValue: 90000,
  yearsOwned: 3,
  totalMileage: 45000,
});
assert.equal(depreciation.totalDepreciation, 60000);
assert.equal(depreciation.depreciationRate, 40);
assert.equal(depreciation.retainedValueRate, 60);
assert.equal(depreciation.annualDepreciation, 20000);
assert.ok(Math.abs(depreciation.depreciationPerKm! - 4 / 3) < 0.000001);
assert.equal(calculateDepreciation({ purchasePrice: 0, currentValue: 0, yearsOwned: 0, totalMileage: 0 }).depreciationRate, null);
assert.equal(calculateDepreciation({ purchasePrice: 100000, currentValue: 110000, yearsOwned: 1, totalMileage: 10000 }).totalDepreciation, 0);

const chargingCost = calculateChargingCost({
  distance: 500,
  consumptionPer100Km: 15,
  electricityPrice: 0.8,
  chargingLossPercent: 10,
});
assert.equal(chargingCost.vehicleEnergy, 75);
assert.ok(Math.abs(chargingCost.gridEnergy - 83.3333333333) < 0.000001);
assert.ok(Math.abs(chargingCost.totalCost - 66.6666666667) < 0.000001);
assert.ok(Math.abs(chargingCost.costPerKm! - 0.1333333333) < 0.000001);
assert.equal(calculateChargingCost({ distance: 0, consumptionPer100Km: 15, electricityPrice: 0.8, chargingLossPercent: 10 }).costPerKm, null);

const usChargingCost = calculateUsChargingCost({
  distanceMiles: 300,
  consumptionPer100Miles: 30,
  electricityPrice: 0.18,
  chargingLossPercent: 10,
});
assert.equal(usChargingCost.vehicleEnergy, 90);
assert.equal(usChargingCost.gridEnergy, 100);
assert.equal(usChargingCost.totalCost, 18);
assert.equal(usChargingCost.costPerMile, 0.06);
assert.equal(usChargingCost.costPer100Miles, 6);

const carLoan = calculateCarLoan({
  vehiclePrice: 150000,
  downPaymentPercent: 30,
  loanTermMonths: 36,
  annualRate: 4.8,
  repaymentMethod: "equal_installment",
});
assert.equal(carLoan.downPayment, 45000);
assert.equal(carLoan.loanAmount, 105000);
assert.equal(carLoan.totalCashOutlay, carLoan.downPayment + carLoan.totalPayment);
assert.ok(carLoan.monthlyPayment > 0);
assert.ok(carLoan.totalInterest > 0);

const cashPurchase = calculateCarLoan({
  vehiclePrice: 150000,
  downPaymentPercent: 100,
  loanTermMonths: 36,
  annualRate: 4.8,
  repaymentMethod: "equal_installment",
});
assert.equal(cashPurchase.loanAmount, 0);
assert.equal(cashPurchase.totalPayment, 0);
assert.equal(cashPurchase.totalCashOutlay, 150000);

console.log("Calculation verification passed.");
