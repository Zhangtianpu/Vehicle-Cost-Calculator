import { create } from "zustand";
import type {
  VehicleType,
  FuelParams,
  InsuranceParams,
  LoanParams,
  MaintenanceParams,
  CarWashParams,
  DepreciationParams,
  ViolationTollParams,
  ParkingParams,
  ModuleToggle,
  CostSummary,
  CalculationResult,
  LoanResult,
  VehicleSnapshot,
} from "@/types";
import {
  DEFAULT_FUEL_PARAMS,
  DEFAULT_INSURANCE_PARAMS,
  DEFAULT_LOAN_PARAMS,
  DEFAULT_MAINTENANCE_PARAMS,
  DEFAULT_CAR_WASH_PARAMS,
  DEFAULT_DEPRECIATION_PARAMS,
  DEFAULT_VIOLATION_TOLL_PARAMS,
  DEFAULT_PARKING_PARAMS,
  EV_ANNUAL_RATE,
  FUEL_ANNUAL_RATE,
} from "@/utils/constants";
import { calculateFuelCost } from "@/utils/fuelCalc";
import { calculateInsuranceCost } from "@/utils/insuranceCalc";
import { calculateLoanCost } from "@/utils/loanCalc";

const ZERO_RESULT: CalculationResult = { monthlyCost: 0, yearlyCost: 0 };

function computeSummary(
  vehicleType: VehicleType,
  fuelParams: FuelParams,
  insuranceParams: InsuranceParams,
  loanParams: LoanParams,
  maintenanceParams: MaintenanceParams,
  carWashParams: CarWashParams,
  depreciationParams: DepreciationParams,
  violationTollParams: ViolationTollParams,
  parkingParams: ParkingParams,
  moduleToggle: ModuleToggle
): { costSummary: CostSummary; loanResult: LoanResult } {
  const fuel = calculateFuelCost(fuelParams);
  const calculatedInsurance = calculateInsuranceCost(insuranceParams, vehicleType);
  const insurance: CalculationResult = moduleToggle.insurance
    ? insuranceParams.customYearlyCost !== null && insuranceParams.customYearlyCost > 0
      ? { monthlyCost: insuranceParams.customYearlyCost / 12, yearlyCost: insuranceParams.customYearlyCost }
      : calculatedInsurance
    : ZERO_RESULT;
  const loanResult = calculateLoanCost(loanParams);
  const loan: CalculationResult = moduleToggle.loan
    ? { monthlyCost: loanResult.monthlyPayment, yearlyCost: loanResult.monthlyPayment * 12 }
    : ZERO_RESULT;
  const maintenance: CalculationResult = moduleToggle.maintenance && maintenanceParams.enabled
    ? { monthlyCost: maintenanceParams.yearlyCost / 12, yearlyCost: maintenanceParams.yearlyCost }
    : ZERO_RESULT;
  const carWash: CalculationResult = moduleToggle.carWash && carWashParams.enabled
    ? { monthlyCost: carWashParams.timesPerMonth * carWashParams.costPerTime, yearlyCost: carWashParams.timesPerMonth * carWashParams.costPerTime * 12 }
    : ZERO_RESULT;
  const depreciation: CalculationResult = moduleToggle.depreciation && depreciationParams.enabled
    ? { monthlyCost: (depreciationParams.vehiclePrice * depreciationParams.yearlyRate / 100) / 12, yearlyCost: depreciationParams.vehiclePrice * depreciationParams.yearlyRate / 100 }
    : ZERO_RESULT;
  const violationToll: CalculationResult = moduleToggle.violationToll && violationTollParams.enabled
    ? { monthlyCost: violationTollParams.monthlyCost, yearlyCost: violationTollParams.monthlyCost * 12 }
    : ZERO_RESULT;
  const parking: CalculationResult = moduleToggle.parking && parkingParams.enabled
    ? { monthlyCost: parkingParams.monthlyCost, yearlyCost: parkingParams.monthlyCost * 12 }
    : ZERO_RESULT;

  const totalMonthly = fuel.monthlyCost + insurance.monthlyCost + loan.monthlyCost + maintenance.monthlyCost + carWash.monthlyCost + depreciation.monthlyCost + violationToll.monthlyCost + parking.monthlyCost;
  const totalYearly = fuel.yearlyCost + insurance.yearlyCost + loan.yearlyCost + maintenance.yearlyCost + carWash.yearlyCost + depreciation.yearlyCost + violationToll.yearlyCost + parking.yearlyCost;

  return {
    costSummary: {
      fuel,
      insurance,
      loan,
      maintenance,
      carWash,
      depreciation,
      violationToll,
      parking,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
    },
    loanResult,
  };
}

function createDefaultSnapshot(type: VehicleType): VehicleSnapshot {
  return {
    fuelParams: { ...DEFAULT_FUEL_PARAMS[type] },
    insuranceParams: { ...DEFAULT_INSURANCE_PARAMS, additionalEV: type === "electric" },
    loanParams: { ...DEFAULT_LOAN_PARAMS, annualRate: type === "electric" ? EV_ANNUAL_RATE : FUEL_ANNUAL_RATE },
    maintenanceParams: { ...DEFAULT_MAINTENANCE_PARAMS[type] },
    depreciationParams: { ...DEFAULT_DEPRECIATION_PARAMS[type] },
  };
}

const initialVehicleType: VehicleType = "fuel";
const initialModuleToggle: ModuleToggle = {
  insurance: true,
  loan: true,
  maintenance: true,
  carWash: true,
  depreciation: true,
  violationToll: true,
  parking: true,
};
const initialSnapshot = createDefaultSnapshot(initialVehicleType);
const initialSnapshots: Record<VehicleType, VehicleSnapshot> = {
  fuel: createDefaultSnapshot("fuel"),
  electric: createDefaultSnapshot("electric"),
};
const initialCarWashParams = { ...DEFAULT_CAR_WASH_PARAMS };
const initialViolationTollParams = { ...DEFAULT_VIOLATION_TOLL_PARAMS };
const initialParkingParams = { ...DEFAULT_PARKING_PARAMS };
const initialComputed = computeSummary(
  initialVehicleType,
  initialSnapshot.fuelParams,
  initialSnapshot.insuranceParams,
  initialSnapshot.loanParams,
  initialSnapshot.maintenanceParams,
  initialCarWashParams,
  initialSnapshot.depreciationParams,
  initialViolationTollParams,
  initialParkingParams,
  initialModuleToggle
);

interface VehicleState {
  vehicleType: VehicleType;
  fuelParams: FuelParams;
  insuranceParams: InsuranceParams;
  loanParams: LoanParams;
  maintenanceParams: MaintenanceParams;
  carWashParams: CarWashParams;
  depreciationParams: DepreciationParams;
  violationTollParams: ViolationTollParams;
  parkingParams: ParkingParams;
  moduleToggle: ModuleToggle;
  costSummary: CostSummary;
  loanResult: LoanResult;
  vehicleSnapshots: Record<VehicleType, VehicleSnapshot>;
  ownershipYears: number;
  setVehicleType: (type: VehicleType) => void;
  setFuelParams: (params: Partial<FuelParams>) => void;
  setInsuranceParams: (params: Partial<InsuranceParams>) => void;
  setLoanParams: (params: Partial<LoanParams>) => void;
  setMaintenanceParams: (params: Partial<MaintenanceParams>) => void;
  setCarWashParams: (params: Partial<CarWashParams>) => void;
  setDepreciationParams: (params: Partial<DepreciationParams>) => void;
  setViolationTollParams: (params: Partial<ViolationTollParams>) => void;
  setParkingParams: (params: Partial<ParkingParams>) => void;
  setModuleToggle: (toggle: Partial<ModuleToggle>) => void;
  setVehiclePrice: (price: number) => void;
  setOwnershipYears: (years: number) => void;
  syncToOther: () => void;
}

function recompute(state: VehicleState) {
  return computeSummary(
    state.vehicleType,
    state.fuelParams,
    state.insuranceParams,
    state.loanParams,
    state.maintenanceParams,
    state.carWashParams,
    state.depreciationParams,
    state.violationTollParams,
    state.parkingParams,
    state.moduleToggle
  );
}

function saveCurrentSnapshot(state: VehicleState): Record<VehicleType, VehicleSnapshot> {
  return {
    ...state.vehicleSnapshots,
    [state.vehicleType]: {
      fuelParams: state.fuelParams,
      insuranceParams: state.insuranceParams,
      loanParams: state.loanParams,
      maintenanceParams: state.maintenanceParams,
      depreciationParams: state.depreciationParams,
    },
  };
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicleType: initialVehicleType,
  fuelParams: initialSnapshot.fuelParams,
  insuranceParams: initialSnapshot.insuranceParams,
  loanParams: initialSnapshot.loanParams,
  maintenanceParams: initialSnapshot.maintenanceParams,
  carWashParams: initialCarWashParams,
  depreciationParams: initialSnapshot.depreciationParams,
  violationTollParams: initialViolationTollParams,
  parkingParams: initialParkingParams,
  moduleToggle: initialModuleToggle,
  costSummary: initialComputed.costSummary,
  loanResult: initialComputed.loanResult,
  vehicleSnapshots: initialSnapshots,
  ownershipYears: 5,

  setVehicleType: (type) =>
    set((state) => {
      if (state.vehicleType === type) return state;
      const updatedSnapshots = saveCurrentSnapshot(state);
      const targetSnapshot = updatedSnapshots[type];
      const newState = {
        ...state,
        vehicleType: type,
        fuelParams: targetSnapshot.fuelParams,
        insuranceParams: targetSnapshot.insuranceParams,
        loanParams: targetSnapshot.loanParams,
        maintenanceParams: targetSnapshot.maintenanceParams,
        depreciationParams: targetSnapshot.depreciationParams,
        vehicleSnapshots: updatedSnapshots,
      };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setFuelParams: (params) =>
    set((state) => {
      const newState = { ...state, fuelParams: { ...state.fuelParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setInsuranceParams: (params) =>
    set((state) => {
      const newState = { ...state, insuranceParams: { ...state.insuranceParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setLoanParams: (params) =>
    set((state) => {
      const newState = { ...state, loanParams: { ...state.loanParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setMaintenanceParams: (params) =>
    set((state) => {
      const newState = { ...state, maintenanceParams: { ...state.maintenanceParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setCarWashParams: (params) =>
    set((state) => {
      const newState = { ...state, carWashParams: { ...state.carWashParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setDepreciationParams: (params) =>
    set((state) => {
      const newState = { ...state, depreciationParams: { ...state.depreciationParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setViolationTollParams: (params) =>
    set((state) => {
      const newState = { ...state, violationTollParams: { ...state.violationTollParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setParkingParams: (params) =>
    set((state) => {
      const newState = { ...state, parkingParams: { ...state.parkingParams, ...params } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setModuleToggle: (toggle) =>
    set((state) => {
      const newState = { ...state, moduleToggle: { ...state.moduleToggle, ...toggle } };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setVehiclePrice: (price) =>
    set((state) => {
      const newState = {
        ...state,
        insuranceParams: { ...state.insuranceParams, vehiclePrice: price },
        loanParams: { ...state.loanParams, vehiclePrice: price },
        depreciationParams: { ...state.depreciationParams, vehiclePrice: price },
      };
      return { ...newState, ...recompute(newState as VehicleState) };
    }),

  setOwnershipYears: (years) =>
    set({ ownershipYears: years }),

  syncToOther: () =>
    set((state) => {
      const otherType: VehicleType = state.vehicleType === "fuel" ? "electric" : "fuel";
      const syncedSnapshot: VehicleSnapshot = {
        fuelParams: {
          ...state.fuelParams,
          fuelPrice: DEFAULT_FUEL_PARAMS[otherType].fuelPrice,
          consumptionPer100km: DEFAULT_FUEL_PARAMS[otherType].consumptionPer100km,
        },
        insuranceParams: {
          ...state.insuranceParams,
          additionalEV: otherType === "electric",
        },
        loanParams: {
          ...state.loanParams,
          annualRate: otherType === "electric" ? EV_ANNUAL_RATE : FUEL_ANNUAL_RATE,
        },
        maintenanceParams: {
          ...state.maintenanceParams,
          yearlyCost: DEFAULT_MAINTENANCE_PARAMS[otherType].yearlyCost,
        },
        depreciationParams: {
          ...state.depreciationParams,
          yearlyRate: DEFAULT_DEPRECIATION_PARAMS[otherType].yearlyRate,
        },
      };
      const newSnapshots = {
        ...state.vehicleSnapshots,
        [otherType]: syncedSnapshot,
      };
      return { vehicleSnapshots: newSnapshots };
    }),
}));
