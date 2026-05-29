import type { FuelParams, MileagePeriod, CalculationResult } from "@/types";

function toMonthlyMileage(mileage: number, period: MileagePeriod): number {
  switch (period) {
    case "daily":
      return mileage * 30;
    case "monthly":
      return mileage;
    case "yearly":
      return mileage / 12;
  }
}

export function calculateFuelCost(params: FuelParams): CalculationResult {
  const { mileage, mileagePeriod, fuelPrice, consumptionPer100km } = params;
  const monthlyMileage = toMonthlyMileage(mileage, mileagePeriod);
  const monthlyCost = (monthlyMileage / 100) * consumptionPer100km * fuelPrice;
  const yearlyCost = monthlyCost * 12;
  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    yearlyCost: Math.round(yearlyCost * 100) / 100,
  };
}
