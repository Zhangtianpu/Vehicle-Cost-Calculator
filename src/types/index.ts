export type VehicleType = "fuel" | "electric";
export type MileagePeriod = "daily" | "monthly" | "yearly";

export interface FuelParams {
  mileage: number;
  mileagePeriod: MileagePeriod;
  fuelPrice: number;
  consumptionPer100km: number;
}

export interface InsuranceParams {
  vehiclePrice: number;
  seatCount: number;
  vehicleAge: number;
  compulsory: boolean;
  vehicleDamage: boolean;
  thirdPartyLiability: boolean;
  thirdPartyAmount: number;
  passengerLiability: boolean;
  passengerSeats: number;
  noClaimYears: number;
  additionalEV: boolean;
  customYearlyCost: number | null;
}

export interface LoanParams {
  vehiclePrice: number;
  downPaymentRatio: number;
  loanTermMonths: number;
  annualRate: number;
  repaymentMethod: "equal_installment" | "equal_principal";
}

export interface MaintenanceParams {
  enabled: boolean;
  yearlyCost: number;
}

export interface CarWashParams {
  enabled: boolean;
  timesPerMonth: number;
  costPerTime: number;
}

export interface DepreciationParams {
  enabled: boolean;
  vehiclePrice: number;
  yearlyRate: number;
}

export interface ViolationTollParams {
  enabled: boolean;
  monthlyCost: number;
}

export interface ParkingParams {
  enabled: boolean;
  monthlyCost: number;
}

export interface ModuleToggle {
  insurance: boolean;
  loan: boolean;
  maintenance: boolean;
  carWash: boolean;
  depreciation: boolean;
  violationToll: boolean;
  parking: boolean;
}

export interface CalculationResult {
  monthlyCost: number;
  yearlyCost: number;
}

export interface LoanResult extends CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  downPayment: number;
  loanAmount: number;
}

export interface CostSummary {
  fuel: CalculationResult;
  insurance: CalculationResult;
  loan: CalculationResult;
  maintenance: CalculationResult;
  carWash: CalculationResult;
  depreciation: CalculationResult;
  violationToll: CalculationResult;
  parking: CalculationResult;
  totalMonthly: number;
  totalYearly: number;
}

export interface CompareData {
  category: string;
  fuel: number;
  electric: number;
}

export interface VehicleSnapshot {
  fuelParams: FuelParams;
  insuranceParams: InsuranceParams;
  loanParams: LoanParams;
  maintenanceParams: MaintenanceParams;
  depreciationParams: DepreciationParams;
}
