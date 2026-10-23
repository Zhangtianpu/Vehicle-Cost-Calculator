import assert from "node:assert/strict";
import { calculateLoanCost } from "../src/utils/loanCalc";
import { calculateMultiYearCosts, type VehicleCalcParams } from "../src/utils/multiYearCalc";
import type { ModuleToggle } from "../src/types";

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

console.log("Calculation verification passed.");
