import type { TransactionWithRefs } from "./types";
import type { MonthlyTotals } from "@/components/charts/IncomeVsExpenseChart";

export function groupIncomeVsExpenseByMonth(transactions: TransactionWithRefs[]): MonthlyTotals[] {
  const byMonth = new Map<string, MonthlyTotals>();

  for (const tx of transactions) {
    const month = tx.occurred_on.slice(0, 7);
    if (!byMonth.has(month)) byMonth.set(month, { month, income: 0, expense: 0 });
    const row = byMonth.get(month)!;
    if (tx.category.kind === "income") row.income += tx.amount;
    else row.expense += tx.amount;
  }

  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
}
