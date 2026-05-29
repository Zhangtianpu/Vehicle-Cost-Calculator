import { useLanguageStore } from "@/store/useLanguageStore";
import type { CompareData } from "@/types";

interface CompareTableProps {
  data: CompareData[];
  showTotalHint?: boolean;
}

export default function CompareTable({ data, showTotalHint = false }: CompareTableProps) {
  const { t } = useLanguageStore();
  const totalFuel = data.reduce((sum, d) => sum + d.fuel, 0);
  const totalElectric = data.reduce((sum, d) => sum + d.electric, 0);
  const diff = totalFuel - totalElectric;
  const isElectricCheaper = diff > 0;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-slate-500 font-medium">
                {t.compare.category}
              </th>
              <th className="text-right py-3 px-4 text-orange-500 font-medium">
                {t.compare.fuelCar}
              </th>
              <th className="text-right py-3 px-4 text-emerald-500 font-medium">
                {t.compare.electricCar}
              </th>
              <th className="text-right py-3 px-4 text-slate-500 font-medium">
                {t.compare.difference}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const rowDiff = row.fuel - row.electric;
              return (
                <tr
                  key={row.category}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-700">{row.category}</td>
                  <td className="py-3 px-4 text-right text-slate-800 font-medium">
                    ¥{row.fuel.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-800 font-medium">
                    ¥{row.electric.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-medium ${
                      rowDiff > 0
                        ? "text-emerald-600"
                        : rowDiff < 0
                        ? "text-orange-600"
                        : "text-slate-400"
                    }`}
                  >
                    {rowDiff > 0 ? "+" : ""}
                    ¥{rowDiff.toLocaleString()}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-50 font-semibold">
              <td className="py-3 px-4 text-slate-800">{t.compare.yearlyTotal}</td>
              <td className="py-3 px-4 text-right text-orange-600">
                ¥{totalFuel.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right text-emerald-600">
                ¥{totalElectric.toLocaleString()}
              </td>
              <td
                className={`py-3 px-4 text-right ${
                  isElectricCheaper ? "text-emerald-600" : "text-orange-600"
                }`}
              >
                {diff > 0 ? "+" : ""}
                ¥{diff.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showTotalHint && (
        <p className="mt-3 text-xs text-slate-400">
          {t.compare.totalHint}
        </p>
      )}
    </div>
  );
}
