// BarChart.tsx
// Monthly expenses bar chart (react-chartjs-2)

import React, { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getWeekOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
}

const BarChart = () => {
  const workspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const pageId = useAppStore((s) => s.selectedPageId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId || !pageId) return;
    setLoading(true);
    API.getTransactions(workspaceId, pageId)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [workspaceId, pageId]);

  // Group by week and day for current month
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Prepare data: week -> day -> { credit, debit }
  const weekData: { [week: number]: { [day: number]: { credit: number; debit: number } } } = {};
  for (let w = 1; w <= 5; w++) {
    weekData[w] = {};
    for (let d = 1; d <= daysInMonth; d++) {
      weekData[w][d] = { credit: 0, debit: 0 };
    }
  }
  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      const week = getWeekOfMonth(d);
      weekData[week][day][t.status] += t.amount;
    }
  });

  // For current week, show bars for each day
  const currentWeek = getWeekOfMonth(now);
  const data = {
    labels: dayLabels.filter(day => getWeekOfMonth(new Date(year, month, day)) === currentWeek),
    datasets: [
      {
        label: "Credit",
        backgroundColor: "#22c55e",
        data: dayLabels.filter(day => getWeekOfMonth(new Date(year, month, day)) === currentWeek).map(day => weekData[currentWeek][day].credit),
      },
      {
        label: "Debit",
        backgroundColor: "#ef4444",
        data: dayLabels.filter(day => getWeekOfMonth(new Date(year, month, day)) === currentWeek).map(day => weekData[currentWeek][day].debit),
      },
    ],
  };

  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="mb-2 font-semibold">Monthly Expenses (Week {currentWeek})</div>
      {loading ? (
        <div className="text-center text-muted-foreground">Loading...</div>
      ) : (
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      )}
    </div>
  );
};


export default BarChart;
