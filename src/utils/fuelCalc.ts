import type { FuelParams, MileagePeriod, CalculationResult, UnitSystem, VehicleType } from "@/types";

const KM_PER_MILE = 1.609344;
const LITERS_PER_US_GALLON = 3.785411784;
const MPG_L_PER_100KM_FACTOR = 235.214583;

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

export function calculateFuelCost(params: FuelParams, vehicleType: VehicleType): CalculationResult {
  const { mileage, mileagePeriod, fuelPrice, efficiency, unitSystem } = params;
  const monthlyMileage = toMonthlyMileage(mileage, mileagePeriod);
  const monthlyCost = unitSystem === "us" && vehicleType === "fuel"
    ? efficiency > 0 ? (monthlyMileage / efficiency) * fuelPrice : 0
    : (monthlyMileage / 100) * efficiency * fuelPrice;
  const yearlyCost = monthlyCost * 12;
  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    yearlyCost: Math.round(yearlyCost * 100) / 100,
  };
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function convertFuelParamsUnit(
  params: FuelParams,
  vehicleType: VehicleType,
  target: UnitSystem,
): FuelParams {
  if (params.unitSystem === target) return { ...params };

  const toUs = target === "us";
  const mileage = toUs ? params.mileage / KM_PER_MILE : params.mileage * KM_PER_MILE;

  if (vehicleType === "electric") {
    const efficiency = toUs ? params.efficiency * KM_PER_MILE : params.efficiency / KM_PER_MILE;
    return {
      ...params,
      unitSystem: target,
      mileage: round(mileage, 2),
      efficiency: round(efficiency, 2),
    };
  }

  const fuelPrice = toUs
    ? params.fuelPrice * LITERS_PER_US_GALLON
    : params.fuelPrice / LITERS_PER_US_GALLON;
  const efficiency = params.efficiency > 0 ? MPG_L_PER_100KM_FACTOR / params.efficiency : 0;

  return {
    ...params,
    unitSystem: target,
    mileage: round(mileage, 2),
    fuelPrice: round(fuelPrice, 4),
    efficiency: round(efficiency, 2),
  };
}
