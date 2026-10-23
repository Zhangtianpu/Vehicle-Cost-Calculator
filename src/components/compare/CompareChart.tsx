import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { CompareData } from "@/types";

interface CompareChartProps {
  data: CompareData[];
}

export default function CompareChart({ data }: CompareChartProps) {
  const { t } = useLanguageStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-4">
        {t.compare.chartTitle}
      </h2>
      <div className="h-[320px]">
        {isClient ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 800, height: 320 }}
          >
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#CBD5E1" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#CBD5E1" }}
              tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            <Bar
              dataKey="fuel"
              name={t.compare.fuelCar}
              fill="#F97316"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="electric"
              name={t.compare.electricCar}
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
