"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMonthLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { CurrencyTooltip } from "./ChartTooltip";

export interface MonthlyTotals {
  month: string;
  income: number;
  expense: number;
}

export function IncomeVsExpenseChart({
  data,
  locale,
  incomeLabel = "Income",
  expenseLabel = "Expense",
  emptyLabel = "Not enough data yet.",
}: {
  data: MonthlyTotals[];
  locale?: Locale;
  incomeLabel?: string;
  expenseLabel?: string;
  emptyLabel?: string;
}) {
  const chartData = data.map((row) => ({
    month: formatMonthLabel(`${row.month}-01`, locale),
    income: row.income,
    expense: row.expense,
  }));

  if (chartData.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral">{emptyLabel}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
        <CartesianGrid stroke="#26263a" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <Tooltip content={<CurrencyTooltip locale={locale} />} cursor={{ fill: "#1b1b27" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Bar dataKey="income" name={incomeLabel} fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name={expenseLabel} fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
