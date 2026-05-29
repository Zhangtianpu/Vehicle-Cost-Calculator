import type { VehicleType, FuelParams, InsuranceParams, LoanParams, MaintenanceParams, CarWashParams, DepreciationParams, ViolationTollParams, ParkingParams } from "@/types";

export const DEFAULT_FUEL_PARAMS: Record<VehicleType, FuelParams> = {
  fuel: {
    mileage: 1500,
    mileagePeriod: "monthly",
    fuelPrice: 7.5,
    consumptionPer100km: 8,
  },
  electric: {
    mileage: 1500,
    mileagePeriod: "monthly",
    fuelPrice: 0.6,
    consumptionPer100km: 15,
  },
};

export const DEFAULT_INSURANCE_PARAMS: InsuranceParams = {
  vehiclePrice: 150000,
  seatCount: 5,
  vehicleAge: 1,
  compulsory: true,
  vehicleDamage: true,
  thirdPartyLiability: true,
  thirdPartyAmount: 200,
  passengerLiability: false,
  passengerSeats: 5,
  noClaimYears: 0,
  additionalEV: false,
  customYearlyCost: null,
};

export const DEFAULT_LOAN_PARAMS: LoanParams = {
  vehiclePrice: 150000,
  downPaymentRatio: 0.3,
  loanTermMonths: 36,
  annualRate: 4.5,
  repaymentMethod: "equal_installment",
};

export const DEFAULT_MAINTENANCE_PARAMS: Record<VehicleType, MaintenanceParams> = {
  fuel: { enabled: false, yearlyCost: 3000 },
  electric: { enabled: false, yearlyCost: 1500 },
};

export const DEFAULT_CAR_WASH_PARAMS: CarWashParams = {
  enabled: false,
  timesPerMonth: 2,
  costPerTime: 35,
};

export const DEFAULT_DEPRECIATION_PARAMS: Record<VehicleType, DepreciationParams> = {
  fuel: { enabled: false, vehiclePrice: 150000, yearlyRate: 10 },
  electric: { enabled: false, vehiclePrice: 150000, yearlyRate: 15 },
};

export const DEFAULT_VIOLATION_TOLL_PARAMS: ViolationTollParams = {
  enabled: false,
  monthlyCost: 200,
};

export const DEFAULT_PARKING_PARAMS: ParkingParams = {
  enabled: false,
  monthlyCost: 300,
};

export const EV_ANNUAL_RATE = 3.5;
export const FUEL_ANNUAL_RATE = 4.5;

export const THIRD_PARTY_RATES: Record<number, number> = {
  50: 800,
  100: 1200,
  200: 1600,
  300: 2000,
};

export const COMPULSORY_6_SEAT_BELOW = 950;
export const COMPULSORY_6_SEAT_ABOVE = 1100;

export const VEHICLE_DAMAGE_RATE = 0.015;
export const PASSENGER_LIABILITY_PER_SEAT = 200;

export const EV_INSURANCE_SURCHARGE = 0.15;

export const NO_CLAIM_DISCOUNTS: Record<number, number> = {
  0: 1.0,
  1: 0.85,
  2: 0.7,
  3: 0.6,
  4: 0.5,
};

export const LOAN_TERM_OPTIONS = [12, 24, 36, 48, 60];

export const THIRD_PARTY_AMOUNT_OPTIONS = [50, 100, 200, 300];
