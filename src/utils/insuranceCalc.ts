import type { InsuranceParams, VehicleType, CalculationResult } from "@/types";
import {
  COMPULSORY_6_SEAT_BELOW,
  COMPULSORY_6_SEAT_ABOVE,
  VEHICLE_DAMAGE_RATE,
  THIRD_PARTY_RATES,
  PASSENGER_LIABILITY_PER_SEAT,
  EV_INSURANCE_SURCHARGE,
  NO_CLAIM_DISCOUNTS,
} from "./constants";

export function calculateInsuranceCost(
  params: InsuranceParams,
  vehicleType: VehicleType
): CalculationResult {
  let totalYearly = 0;

  if (params.compulsory) {
    totalYearly +=
      params.seatCount <= 6
        ? COMPULSORY_6_SEAT_BELOW
        : COMPULSORY_6_SEAT_ABOVE;
  }

  if (params.vehicleDamage) {
    totalYearly += params.vehiclePrice * VEHICLE_DAMAGE_RATE;
  }

  if (params.thirdPartyLiability) {
    const rate =
      THIRD_PARTY_RATES[params.thirdPartyAmount] ??
      THIRD_PARTY_RATES[200];
    totalYearly += rate;
  }

  if (params.passengerLiability) {
    totalYearly += PASSENGER_LIABILITY_PER_SEAT * params.passengerSeats;
  }

  if (vehicleType === "electric" && params.additionalEV) {
    totalYearly += 1000;
  }

  if (vehicleType === "electric") {
    totalYearly *= 1 + EV_INSURANCE_SURCHARGE;
  }

  const discountKey = Math.min(params.noClaimYears, 4);
  const discount = NO_CLAIM_DISCOUNTS[discountKey] ?? 1.0;
  totalYearly *= discount;

  const monthlyCost = totalYearly / 12;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    yearlyCost: Math.round(totalYearly * 100) / 100,
  };
}
