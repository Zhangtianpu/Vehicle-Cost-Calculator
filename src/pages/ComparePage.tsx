import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { FileDown, Loader2 } from "lucide-react";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { calculateMultiYearCosts, type VehicleCalcParams, type YearlyCostBreakdown } from "@/utils/multiYearCalc";
import { generateReport } from "@/utils/generateReport";
import ReportView from "@/components/compare/ReportView";
import CompareChart from "@/components/compare/CompareChart";
import CompareTable from "@/components/compare/CompareTable";
import MultiYearChart from "@/components/compare/MultiYearChart";
import AdBanner from "@/components/layout/AdBanner";
import type { CompareData, VehicleType } from "@/types";

const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function buildCompareDataFromBreakdown(
  fuelBreakdown: YearlyCostBreakdown,
  electricBreakdown: YearlyCostBreakdown,
  moduleToggle: ReturnType<typeof useVehicleStore.getState>["moduleToggle"],
  t: ReturnType<typeof useLanguageStore.getState>["t"]
): CompareData[] {
  const data: CompareData[] = [];

  data.push({
    category: t.compare.energyCost,
    fuel: fuelBreakdown.fuel,
    electric: electricBreakdown.fuel,
  });

  if (moduleToggle.insurance) {
    data.push({
      category: t.compare.insuranceCost,
      fuel: fuelBreakdown.insurance,
      electric: electricBreakdown.insurance,
    });
  }

  if (moduleToggle.loan) {
    data.push({
      category: t.compare.loanCostYearly,
      fuel: fuelBreakdown.loan,
      electric: electricBreakdown.loan,
    });
  }

  if (moduleToggle.maintenance) {
    data.push({
      category: t.compare.maintenanceCost,
      fuel: fuelBreakdown.maintenance,
      electric: electricBreakdown.maintenance,
    });
  }

  if (moduleToggle.carWash) {
    data.push({
      category: t.compare.carWashCost,
      fuel: fuelBreakdown.carWash,
      electric: electricBreakdown.carWash,
    });
  }

  if (moduleToggle.depreciation) {
    data.push({
      category: t.compare.depreciationCost,
      fuel: fuelBreakdown.depreciation,
      electric: electricBreakdown.depreciation,
    });
  }

  if (moduleToggle.violationToll) {
    data.push({
      category: t.compare.violationTollCost,
      fuel: fuelBreakdown.violationToll,
      electric: electricBreakdown.violationToll,
    });
  }

  if (moduleToggle.parking) {
    data.push({
      category: t.compare.parkingCost,
      fuel: fuelBreakdown.parking,
      electric: electricBreakdown.parking,
    });
  }

  return data;
}

export default function ComparePage() {
  const {
    vehicleType,
    vehicleSnapshots,
    carWashParams,
    violationTollParams,
    parkingParams,
    moduleToggle,
    ownershipYears,
    setOwnershipYears,
    fuelParams,
    insuranceParams,
    loanParams,
    maintenanceParams,
    depreciationParams,
  } = useVehicleStore();
  const { t } = useLanguageStore();
  const [selectedYearTab, setSelectedYearTab] = useState<number | "total">(1);
  const [generating, setGenerating] = useState(false);

  const currentSnapshot: VehicleCalcParams = {
    fuelParams,
    insuranceParams,
    loanParams,
    maintenanceParams,
    depreciationParams,
  };

  const otherType: VehicleType = vehicleType === "fuel" ? "electric" : "fuel";
  const otherSnapshotParams = vehicleSnapshots[otherType];
  const otherSnapshot: VehicleCalcParams = {
    fuelParams: otherSnapshotParams.fuelParams,
    insuranceParams: otherSnapshotParams.insuranceParams,
    loanParams: otherSnapshotParams.loanParams,
    maintenanceParams: otherSnapshotParams.maintenanceParams,
    depreciationParams: otherSnapshotParams.depreciationParams,
  };

  const fuelVehicleParams = vehicleType === "fuel" ? currentSnapshot : otherSnapshot;
  const electricVehicleParams = vehicleType === "electric" ? currentSnapshot : otherSnapshot;

  const multiYearData = useMemo(
    () =>
      calculateMultiYearCosts(
        fuelVehicleParams,
        electricVehicleParams,
        carWashParams,
        violationTollParams,
        parkingParams,
        moduleToggle,
        ownershipYears
      ),
    [fuelVehicleParams, electricVehicleParams, carWashParams, violationTollParams, parkingParams, moduleToggle, ownershipYears]
  );

  const yearTabs = useMemo(() => {
    const tabs: { value: number | "total"; label: string }[] = [];
    for (let i = 1; i <= ownershipYears; i++) {
      tabs.push({ value: i, label: `${t.compare.year} ${i}${t.compare.yearUnit}` });
    }
    tabs.push({ value: "total", label: t.compare.total });
    return tabs;
  }, [ownershipYears, t]);

  const compareData = useMemo(() => {
    if (selectedYearTab === "total") {
      const fuelTotal = multiYearData.fuel.reduce(
        (acc, year) => ({
          fuel: acc.fuel + year.fuel,
          insurance: acc.insurance + year.insurance,
          loan: acc.loan + year.loan,
          maintenance: acc.maintenance + year.maintenance,
          carWash: acc.carWash + year.carWash,
          depreciation: acc.depreciation + year.depreciation,
          violationToll: acc.violationToll + year.violationToll,
          parking: acc.parking + year.parking,
          total: acc.total + year.total,
          cumulative: multiYearData.fuel[multiYearData.fuel.length - 1].cumulative,
          year: 0,
        }),
        { fuel: 0, insurance: 0, loan: 0, maintenance: 0, carWash: 0, depreciation: 0, violationToll: 0, parking: 0, total: 0, cumulative: 0, year: 0 }
      );
      const electricTotal = multiYearData.electric.reduce(
        (acc, year) => ({
          fuel: acc.fuel + year.fuel,
          insurance: acc.insurance + year.insurance,
          loan: acc.loan + year.loan,
          maintenance: acc.maintenance + year.maintenance,
          carWash: acc.carWash + year.carWash,
          depreciation: acc.depreciation + year.depreciation,
          violationToll: acc.violationToll + year.violationToll,
          parking: acc.parking + year.parking,
          total: acc.total + year.total,
          cumulative: multiYearData.electric[multiYearData.electric.length - 1].cumulative,
          year: 0,
        }),
        { fuel: 0, insurance: 0, loan: 0, maintenance: 0, carWash: 0, depreciation: 0, violationToll: 0, parking: 0, total: 0, cumulative: 0, year: 0 }
      );
      return buildCompareDataFromBreakdown(fuelTotal, electricTotal, moduleToggle, t);
    } else {
      const fuelBreakdown = multiYearData.fuel[selectedYearTab - 1];
      const electricBreakdown = multiYearData.electric[selectedYearTab - 1];
      return buildCompareDataFromBreakdown(fuelBreakdown, electricBreakdown, moduleToggle, t);
    }
  }, [selectedYearTab, multiYearData, moduleToggle, t]);

  const allYearsCompareData = useMemo(() => {
    const result: Record<number, CompareData[]> = {};
    for (let year = 1; year <= ownershipYears; year++) {
      result[year] = buildCompareDataFromBreakdown(
        multiYearData.fuel[year - 1],
        multiYearData.electric[year - 1],
        moduleToggle,
        t
      );
    }
    return result;
  }, [multiYearData, moduleToggle, t, ownershipYears]);

  const totalCompareData = useMemo(() => {
    const fuelTotal = multiYearData.fuel.reduce(
      (acc, year) => ({
        fuel: acc.fuel + year.fuel,
        insurance: acc.insurance + year.insurance,
        loan: acc.loan + year.loan,
        maintenance: acc.maintenance + year.maintenance,
        carWash: acc.carWash + year.carWash,
        depreciation: acc.depreciation + year.depreciation,
        violationToll: acc.violationToll + year.violationToll,
        parking: acc.parking + year.parking,
        total: acc.total + year.total,
        cumulative: multiYearData.fuel[multiYearData.fuel.length - 1].cumulative,
        year: 0,
      }),
      { fuel: 0, insurance: 0, loan: 0, maintenance: 0, carWash: 0, depreciation: 0, violationToll: 0, parking: 0, total: 0, cumulative: 0, year: 0 }
    );
    const electricTotal = multiYearData.electric.reduce(
      (acc, year) => ({
        fuel: acc.fuel + year.fuel,
        insurance: acc.insurance + year.insurance,
        loan: acc.loan + year.loan,
        maintenance: acc.maintenance + year.maintenance,
        carWash: acc.carWash + year.carWash,
        depreciation: acc.depreciation + year.depreciation,
        violationToll: acc.violationToll + year.violationToll,
        parking: acc.parking + year.parking,
        total: acc.total + year.total,
        cumulative: multiYearData.electric[multiYearData.electric.length - 1].cumulative,
        year: 0,
      }),
      { fuel: 0, insurance: 0, loan: 0, maintenance: 0, carWash: 0, depreciation: 0, violationToll: 0, parking: 0, total: 0, cumulative: 0, year: 0 }
    );
    return buildCompareDataFromBreakdown(fuelTotal, electricTotal, moduleToggle, t);
  }, [multiYearData, moduleToggle, t]);

  const finalFuelCumulative = multiYearData.fuel[multiYearData.fuel.length - 1]?.cumulative || 0;
  const finalElectricCumulative = multiYearData.electric[multiYearData.electric.length - 1]?.cumulative || 0;
  const totalDiff = finalFuelCumulative - finalElectricCumulative;
  const isElectricCheaper = totalDiff > 0;

  const handleGenerateReport = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = "800px";
      container.style.zIndex = "-1";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      const root = createRoot(container);
      await new Promise<void>((resolve) => {
        root.render(
          <ReportView
            allYearsCompareData={allYearsCompareData}
            totalCompareData={totalCompareData}
            fuelData={multiYearData.fuel}
            electricData={multiYearData.electric}
            ownershipYears={ownershipYears}
          />
        );
        setTimeout(resolve, 1500);
      });

      await generateReport(container, `vehicle-cost-report-${ownershipYears}year.png`);

      root.unmount();
      document.body.removeChild(container);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t.compare.title}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.compare.subtitle}
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          {generating ? t.compare.generating : t.compare.generateReport}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">
              {t.compare.ownershipYears}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {YEAR_OPTIONS.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setOwnershipYears(year);
                    if (selectedYearTab !== "total" && selectedYearTab > year) {
                      setSelectedYearTab(year);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    ownershipYears === year
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {year}{t.compare.yearUnit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <MultiYearChart
            fuelData={multiYearData.fuel}
            electricData={multiYearData.electric}
          />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {yearTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedYearTab(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedYearTab === tab.value
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <CompareChart data={compareData} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {yearTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedYearTab(tab.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedYearTab === tab.value
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <CompareTable data={compareData} showTotalHint={selectedYearTab === "total"} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">
              {t.compare.multiYearSummary}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">{t.compare.fuelCar} {t.compare.totalCost}</p>
                <p className="text-xl font-bold text-orange-600">
                  ¥{finalFuelCumulative.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">{t.compare.electricCar} {t.compare.totalCost}</p>
                <p className="text-xl font-bold text-emerald-600">
                  ¥{finalElectricCumulative.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                isElectricCheaper
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              {isElectricCheaper ? (
                <p>
                  {ownershipYears}{t.compare.yearUnit}{t.compare.saveEV}
                  <span className="font-bold">
                    ¥{Math.abs(totalDiff).toLocaleString()}
                  </span>
                </p>
              ) : (
                <p>
                  {ownershipYears}{t.compare.yearUnit}{t.compare.saveFuel}
                  <span className="font-bold">
                    ¥{Math.abs(totalDiff).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>

          <AdBanner />
        </div>
      </div>
    </div>
  );
}
