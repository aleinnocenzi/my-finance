import type { Holiday, TransactionWithRefs } from "@/lib/types";
import { findHolidayForDate } from "@/lib/spendingGrouping";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { DeleteTransactionButton } from "./DeleteTransactionButton";

export function TransactionsTable({
  transactions,
  holidays,
  t,
  locale,
}: {
  transactions: TransactionWithRefs[];
  holidays: Holiday[];
  t: Dictionary;
  locale: Locale;
}) {
  if (transactions.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral">{t.transactions.noTransactions}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wide text-neutral">
            <th className="py-2 pr-4">{t.transactions.tableDate}</th>
            <th className="py-2 pr-4">{t.transactions.tableName}</th>
            <th className="py-2 pr-4">{t.transactions.tableCategory}</th>
            <th className="py-2 pr-4">{t.transactions.tableAccount}</th>
            <th className="py-2 pr-4">{t.transactions.tableHoliday}</th>
            <th className="py-2 pr-4 text-right">{t.transactions.tableAmount}</th>
            <th className="py-2 pr-2" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const holiday = tx.category.kind === "expense" ? findHolidayForDate(holidays, tx.occurred_on) : undefined;
            return (
              <tr key={tx.id} className="border-b border-surface-border/60 hover:bg-surface-hover">
                <td className="py-2.5 pr-4 whitespace-nowrap text-neutral">
                  {formatDate(tx.occurred_on, locale)}
                </td>
                <td className="py-2.5 pr-4 text-gray-100">{tx.name}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                    style={{ backgroundColor: `${tx.category.color}22`, color: tx.category.color }}
                  >
                    {tx.category.name}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-neutral">{tx.account.name}</td>
                <td className="py-2.5 pr-4 text-neutral">{holiday ? holiday.name : "—"}</td>
                <td
                  className={`py-2.5 pr-4 text-right font-medium whitespace-nowrap ${
                    tx.category.kind === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {tx.category.kind === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount, locale)}
                </td>
                <td className="py-2.5 pr-2 text-right">
                  <DeleteTransactionButton id={tx.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
