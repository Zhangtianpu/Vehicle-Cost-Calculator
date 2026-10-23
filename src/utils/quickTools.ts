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
