import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { YearlyCostBreakdown } from "@/utils/multiYearCalc";

interface MultiYearChartProps {
  fuelData: YearlyCostBreakdown[];
  electricData: YearlyCostBreakdown[];
}

export default function MultiYearChart({ fuelData, electricData }: MultiYearChartProps) {
  const { t } = useLanguageStore();

  const chartData = fuelData.map((fuelItem, index) => ({
    year: `${t.compare.year} ${fuelItem.year}`,
    fuelCumulative: fuelItem.cumulative,
    electricCumulative: electricData[index].cumulative,
    fuelYearly: fuelItem.total,
    electricYearly: electricData[index].total,
  }));

  const fuelCarLabel = t.compare.fuelCar;
  const electricCarLabel = t.compare.electricCar;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-4">
        {t.compare.multiYearChartTitle}
      </h2>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                return [`¥${value.toLocaleString()}`, name];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="fuelCumulative"
              name={fuelCarLabel}
              stroke="#F97316"
              fill="#FDBA74"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="electricCumulative"
              name={electricCarLabel}
              stroke="#10B981"
              fill="#6EE7B7"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
