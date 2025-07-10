import { Transaction } from "@/types";

interface ChartDataResult {
  data: {
    labels: number[];
    datasets: {
      label: string;
      backgroundColor: string;
      data: number[];
    }[];
  };
}

const getWeekOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
};

export const processTransactionData = (
  transactions: Transaction[],
  year: number,
  month: number,
  week: number
): ChartDataResult => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    credit: 0,
    debit: 0,
  }));

  transactions.forEach(({ date, status, amount }) => {
    const d = new Date(date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      weekData[day - 1][status] += amount;
    }
  });

  const weekDays = weekData.filter(({ day }) =>
    getWeekOfMonth(new Date(year, month, day)) === week
  );

  const labels = weekDays.map(({ day }) => day);
  const creditData = weekDays.map(({ credit }) => credit);
  const debitData = weekDays.map(({ debit }) => debit);

  return {
    data: {
      labels,
      datasets: [
        { label: "Credit", backgroundColor: "#22c55e", data: creditData },
        { label: "Debit", backgroundColor: "#ef4444", data: debitData },
      ],
    },
  };
};
