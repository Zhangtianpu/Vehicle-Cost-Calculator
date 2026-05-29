import { useState, useEffect, useRef } from "react";
import { TrendingUp, Calendar, CalendarDays } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    if (Math.abs(diff) < 0.01) {
      setDisplay(end);
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  return <span>¥{Math.round(display).toLocaleString()}</span>;
}

function SummaryRow({ label, monthly, yearly, period }: {
  label: string;
  monthly: number;
  yearly: number;
  period: "monthly" | "yearly";
}) {
  if (monthly === 0 && yearly === 0) return null;
  return (
    <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-50">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-800">
        <AnimatedNumber value={period === "monthly" ? monthly : yearly} />
      </span>
    </div>
  );
}

export default function CostSummary() {
  const { costSummary, vehicleType, moduleToggle, maintenanceParams, carWashParams, depreciationParams, violationTollParams, parkingParams } = useVehicleStore();
  const { t } = useLanguageStore();
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const isElectric = vehicleType === "electric";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">{t.summary.title}</h2>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setPeriod("monthly")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              period === "monthly"
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            style={
              period === "monthly"
                ? { backgroundColor: isElectric ? "#10B981" : "#F97316" }
                : {}
            }
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.summary.monthly}
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              period === "yearly"
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            style={
              period === "yearly"
                ? { backgroundColor: isElectric ? "#10B981" : "#F97316" }
                : {}
            }
          >
            <CalendarDays className="w-3.5 h-3.5" />
            {t.summary.yearly}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SummaryRow
          label={isElectric ? t.summary.chargingCost : t.summary.fuelCost}
          monthly={costSummary.fuel.monthlyCost}
          yearly={costSummary.fuel.yearlyCost}
          period={period}
        />
        {moduleToggle.insurance && (
          <SummaryRow
            label={t.summary.insuranceCost}
            monthly={costSummary.insurance.monthlyCost}
            yearly={costSummary.insurance.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.loan && (
          <SummaryRow
            label={t.summary.loanCost}
            monthly={costSummary.loan.monthlyCost}
            yearly={costSummary.loan.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.maintenance && maintenanceParams.enabled && (
          <SummaryRow
            label={t.summary.maintenanceCost}
            monthly={costSummary.maintenance.monthlyCost}
            yearly={costSummary.maintenance.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.carWash && carWashParams.enabled && (
          <SummaryRow
            label={t.summary.carWashCost}
            monthly={costSummary.carWash.monthlyCost}
            yearly={costSummary.carWash.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.depreciation && depreciationParams.enabled && (
          <SummaryRow
            label={t.summary.depreciationCost}
            monthly={costSummary.depreciation.monthlyCost}
            yearly={costSummary.depreciation.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.violationToll && violationTollParams.enabled && (
          <SummaryRow
            label={t.summary.violationTollCost}
            monthly={costSummary.violationToll.monthlyCost}
            yearly={costSummary.violationToll.yearlyCost}
            period={period}
          />
        )}
        {moduleToggle.parking && parkingParams.enabled && (
          <SummaryRow
            label={t.summary.parkingCost}
            monthly={costSummary.parking.monthlyCost}
            yearly={costSummary.parking.yearlyCost}
            period={period}
          />
        )}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-700">
            {period === "monthly" ? t.summary.totalMonthly : t.summary.totalYearly}
          </span>
          <span
            className="text-2xl font-bold"
            style={{ color: isElectric ? "#10B981" : "#F97316" }}
          >
            <AnimatedNumber
              value={
                period === "monthly"
                  ? costSummary.totalMonthly
                  : costSummary.totalYearly
              }
            />
          </span>
        </div>
      </div>
    </div>
  );
}
