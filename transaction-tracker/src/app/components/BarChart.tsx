import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import API from "@/lib/api";
import { Transaction } from "@/types";
import { useAppStore } from "@/lib/store";
import { processTransactionData } from "@/lib/utils/transactionUtils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const workspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const pageId = useAppStore((s) => s.selectedPageId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const now = new Date();

  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  useEffect(() => {
    if (!workspaceId || !pageId) return;
    setLoading(true);
    API.getTransactions(workspaceId, pageId)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [workspaceId, pageId]);

  const { data } = useMemo(
    () => processTransactionData(transactions, selectedYear, selectedMonth, selectedWeek),
    [transactions, selectedYear, selectedMonth, selectedWeek]
  );

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow transition-all duration-300">
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label className="block text-xs mb-1 font-semibold">Select Year:</label>
          <select
            className="border rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-1 font-semibold">Select Month:</label>
          <select
            className="border rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-1 font-semibold">Select Week:</label>
          <select
            className="border rounded-lg px-3 py-2 bg-zinc-50 dark:bg-zinc-800 text-sm"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading...</div>
      ) : (
        <>
          <div className="mb-2 font-semibold text-center">
            Monthly Expenses ({selectedYear} - {new Date(0, selectedMonth).toLocaleString("default", { month: "long" })} - Week {selectedWeek})
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-2 shadow">
            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BarChart;
