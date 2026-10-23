import assert from "node:assert/strict";
import { calculateLoanCost } from "../src/utils/loanCalc";
import { calculateMultiYearCosts, type VehicleCalcParams } from "../src/utils/multiYearCalc";
import type { ModuleToggle } from "../src/types";
import {
  calculateCostPerKm,
  calculateCarLoan,
  calculateChargingCost,
  calculateDepreciation,
  calculateEvBreakEven,
  calculateFuelCost,
} from "../src/utils/quickTools";

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
  fuelParams: { mileage: 0, mileagePeriod: "yearly", fuelPrice: 0, consumptionPer100km: 0 },
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
