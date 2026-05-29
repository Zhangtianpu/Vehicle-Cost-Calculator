import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { CompareData } from "@/types";
import type { YearlyCostBreakdown } from "@/utils/multiYearCalc";

interface ReportViewProps {
  allYearsCompareData: Record<number, CompareData[]>;
  totalCompareData: CompareData[];
  fuelData: YearlyCostBreakdown[];
  electricData: YearlyCostBreakdown[];
  ownershipYears: number;
}

export default function ReportView({
  allYearsCompareData,
  totalCompareData,
  fuelData,
  electricData,
  ownershipYears,
}: ReportViewProps) {
  const { t } = useLanguageStore();

  const trendChartData = fuelData.map((fuelItem, index) => ({
    year: `${t.compare.year} ${fuelItem.year}`,
    fuelCumulative: fuelItem.cumulative,
    electricCumulative: electricData[index].cumulative,
  }));

  const finalFuelCumulative = fuelData[fuelData.length - 1]?.cumulative || 0;
  const finalElectricCumulative = electricData[electricData.length - 1]?.cumulative || 0;
  const totalDiff = finalFuelCumulative - finalElectricCumulative;
  const isElectricCheaper = totalDiff > 0;

  const CHART_WIDTH = 710;

  const renderCompareBarChart = (data: CompareData[]) => (
    <BarChart width={CHART_WIDTH} height={data.length * 40 + 40} data={data} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
      <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v) => `¥${v.toLocaleString()}`} />
      <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "#334155" }} width={75} />
      <Tooltip
        formatter={(value: number) => [`¥${value.toLocaleString()}`]}
        contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px" }}
      />
      <Legend wrapperStyle={{ fontSize: "12px" }} />
      <Bar dataKey="fuel" name={t.compare.fuelCar} fill="#F97316" radius={[0, 4, 4, 0]} barSize={16} />
      <Bar dataKey="electric" name={t.compare.electricCar} fill="#10B981" radius={[0, 4, 4, 0]} barSize={16} />
    </BarChart>
  );

  const renderTable = (data: CompareData[], showTotal?: boolean) => {
    const totalFuel = data.reduce((s, d) => s + d.fuel, 0);
    const totalElectric = data.reduce((s, d) => s + d.electric, 0);
    const diff = totalFuel - totalElectric;

    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-300">
            <th className="text-left py-2 px-3 text-slate-600 font-medium">{t.compare.category}</th>
            <th className="text-right py-2 px-3 text-orange-500 font-medium">{t.compare.fuelCar}</th>
            <th className="text-right py-2 px-3 text-emerald-500 font-medium">{t.compare.electricCar}</th>
            <th className="text-right py-2 px-3 text-slate-500 font-medium">{t.compare.difference}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowDiff = row.fuel - row.electric;
            return (
              <tr key={row.category} className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-700">{row.category}</td>
                <td className="py-2 px-3 text-right text-slate-800">¥{row.fuel.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-slate-800">¥{row.electric.toLocaleString()}</td>
                <td className={`py-2 px-3 text-right font-medium ${rowDiff > 0 ? "text-emerald-600" : rowDiff < 0 ? "text-orange-600" : "text-slate-400"}`}>
                  {rowDiff > 0 ? "+" : ""}¥{rowDiff.toLocaleString()}
                </td>
              </tr>
            );
          })}
          {showTotal && (
            <tr className="bg-slate-50 font-semibold">
              <td className="py-2 px-3 text-slate-800">{t.compare.yearlyTotal}</td>
              <td className="py-2 px-3 text-right text-orange-600">¥{totalFuel.toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-emerald-600">¥{totalElectric.toLocaleString()}</td>
              <td className={`py-2 px-3 text-right ${diff > 0 ? "text-emerald-600" : "text-orange-600"}`}>
                {diff > 0 ? "+" : ""}¥{diff.toLocaleString()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ width: "800px", padding: "24px", backgroundColor: "#F8FAFC" }}>
      <div className="report-section" style={{ backgroundColor: "#0F172A", padding: "20px 24px", borderRadius: "12px", marginBottom: "24px" }}>
        <h1 style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          {t.compare.title}
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "4px" }}>
          {t.compare.ownershipYears}: {ownershipYears}{t.compare.yearUnit}
        </p>
      </div>

      <div className="report-section" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>
          {t.compare.multiYearChartTitle}
        </h2>
        <AreaChart width={CHART_WIDTH} height={280} data={trendChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`} />
          <Tooltip formatter={(value: number, name: string) => [`¥${value.toLocaleString()}`, name]} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Area type="monotone" dataKey="fuelCumulative" name={t.compare.fuelCar} stroke="#F97316" fill="#FDBA74" fillOpacity={0.4} strokeWidth={2} />
          <Area type="monotone" dataKey="electricCumulative" name={t.compare.electricCar} stroke="#10B981" fill="#6EE7B7" fillOpacity={0.4} strokeWidth={2} />
        </AreaChart>
      </div>

      <div className="report-section" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>
          {t.compare.total} ({ownershipYears}{t.compare.yearUnit})
        </h2>
        {renderCompareBarChart(totalCompareData)}
        <div style={{ marginTop: "16px" }}>
          {renderTable(totalCompareData, true)}
        </div>
      </div>

      {Array.from({ length: ownershipYears }, (_, i) => i + 1).map((year) => {
        const yearData = allYearsCompareData[year];
        if (!yearData) return null;
        return (
          <div key={year} className="report-section" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "16px", border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B", marginBottom: "12px" }}>
              {t.compare.year} {year}{t.compare.yearUnit}
            </h3>
            {renderTable(yearData, true)}
          </div>
        );
      })}

      <div className="report-section" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", border: "1px solid #E2E8F0" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1E293B", marginBottom: "16px" }}>
          {t.compare.multiYearSummary}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px" }}>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 4px 0" }}>{t.compare.fuelCar} {t.compare.totalCost}</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#EA580C", margin: 0 }}>¥{finalFuelCumulative.toLocaleString()}</p>
          </div>
          <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
            <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 4px 0" }}>{t.compare.electricCar} {t.compare.totalCost}</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#059669", margin: 0 }}>¥{finalElectricCumulative.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: isElectricCheaper ? "#ECFDF5" : "#FFF7ED", color: isElectricCheaper ? "#059669" : "#EA580C", fontSize: "14px" }}>
          {isElectricCheaper ? (
            <p style={{ margin: 0 }}>{ownershipYears}{t.compare.yearUnit}{t.compare.saveEV} <strong>¥{Math.abs(totalDiff).toLocaleString()}</strong></p>
          ) : (
            <p style={{ margin: 0 }}>{ownershipYears}{t.compare.yearUnit}{t.compare.saveFuel} <strong>¥{Math.abs(totalDiff).toLocaleString()}</strong></p>
          )}
        </div>
      </div>
    </div>
  );
}
