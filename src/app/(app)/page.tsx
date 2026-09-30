import { startOfMonth, formatISO, isValid, parseISO } from "date-fns";
import { getAccounts, getBalanceHistory, getCategories, getHolidays, getTransactions } from "@/lib/data";
import { summarizeNetWorth, computeNetWorthTimeline } from "@/lib/netWorth";
import { groupExpensesForChart, groupExpensesByMonth } from "@/lib/spendingGrouping";
import { groupIncomeVsExpenseByMonth } from "@/lib/incomeExpense";
import { getT } from "@/lib/i18n/server";
import { localizeCategories, localizeTransactions } from "@/lib/i18n/localize";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/Card";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { NetWorthByAccountChart } from "@/components/charts/NetWorthByAccountChart";
import { SpendingByCategoryChart } from "@/components/charts/SpendingByCategoryChart";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import { IncomeVsExpenseChart } from "@/components/charts/IncomeVsExpenseChart";
import { NetWorthTrendChart } from "@/components/charts/NetWorthTrendChart";
import { formatCurrency, formatDate } from "@/lib/format";

const isoDate = (d: Date) => formatISO(d, { representation: "date" });

function validDate(value?: string): string | undefined {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value)) ? value : undefined;
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const { locale, t } = await getT();

  // Default range: the current month up to today.
  const defaultFrom = isoDate(startOfMonth(new Date()));
  const defaultTo = isoDate(new Date());
  let rangeFrom = validDate(params.from) ?? defaultFrom;
  let rangeTo = validDate(params.to) ?? defaultTo;
  if (rangeFrom > rangeTo) [rangeFrom, rangeTo] = [rangeTo, rangeFrom];
  const isCustomRange = rangeFrom !== defaultFrom || rangeTo !== defaultTo;

  const [accounts, rawCategories, holidays, rawTransactions, history] = await Promise.all([
    getAccounts(),
    getCategories(),
    getHolidays(),
    getTransactions({ since: rangeFrom, until: rangeTo }),
    getBalanceHistory(),
  ]);

  const categories = localizeCategories(rawCategories, t);
  const transactions = localizeTransactions(rawTransactions, t);

  const netWorth = summarizeNetWorth(accounts);
  const netWorthTimeline = computeNetWorthTimeline(accounts, history);

  const expenseTx = transactions.filter((tx) => tx.category.kind === "expense");
  const periodIncome = transactions
    .filter((tx) => tx.category.kind === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const periodSpend = expenseTx.reduce((sum, tx) => sum + tx.amount, 0);

  const spendingBuckets = groupExpensesForChart(expenseTx, holidays);
  const { series: monthlySeries, bucketKeys } = groupExpensesByMonth(expenseTx, holidays);
  const incomeVsExpense = groupIncomeVsExpenseByMonth(transactions);

  const recentTransactions = transactions.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">{t.overview.title}</h1>
          <p className="mt-1 text-sm text-neutral">{t.overview.subtitle}</p>
        </div>
        <AddTransactionModal categories={categories} accounts={accounts} />
      </div>

      <DateRangeFilter from={rangeFrom} to={rangeTo} isCustom={isCustomRange} t={t} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label={t.overview.netWorth} value={netWorth.netWorth} tone="accent" locale={locale} />
        <StatCard label={t.overview.assets} value={netWorth.totalAssets} tone="neutral" locale={locale} />
        <StatCard label={t.overview.liabilities} value={netWorth.totalLiabilities} tone="expense" locale={locale} />
        <StatCard label={t.overview.monthSpend} value={periodSpend} tone="expense" locale={locale} />
        <StatCard label={t.overview.monthIncome} value={periodIncome} tone="income" locale={locale} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.overview.netWorthByAccount}>
          <NetWorthByAccountChart accounts={accounts} locale={locale} balanceLabel={t.common.balance} />
        </Card>
        <Card title={t.overview.netWorthOverTime} subtitle={t.overview.netWorthOverTimeSubtitle}>
          <NetWorthTrendChart
            points={netWorthTimeline}
            locale={locale}
            netWorthLabel={t.overview.netWorth}
            emptyLabel={t.overview.netWorthTrendEmpty}
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t.overview.spendingByCategory} subtitle={t.overview.spendingByCategorySubtitle}>
          <SpendingByCategoryChart
            buckets={spendingBuckets}
            locale={locale}
            emptyLabel={t.overview.noExpensesInPeriod}
          />
        </Card>
        <Card title={t.overview.spendingTrend} subtitle={t.overview.spendingTrendSubtitle}>
          <MonthlyTrendChart
            series={monthlySeries}
            bucketKeys={bucketKeys}
            locale={locale}
            emptyLabel={t.overview.notEnoughData}
          />
        </Card>
      </div>

      <Card title={t.overview.incomeVsExpense} subtitle={t.overview.incomeVsExpenseSubtitle}>
        <IncomeVsExpenseChart
          data={incomeVsExpense}
          locale={locale}
          incomeLabel={t.addTransaction.income}
          expenseLabel={t.addTransaction.expense}
          emptyLabel={t.overview.notEnoughData}
        />
      </Card>

      <Card
        title={t.overview.recentTransactions}
        action={
          <a href="/transactions" className="text-xs text-accent hover:underline">
            {t.overview.viewAll}
          </a>
        }
      >
        {recentTransactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-neutral">{t.overview.noTransactions}</p>
        ) : (
          <ul className="divide-y divide-surface-border/60">
            {recentTransactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-gray-100">{tx.name}</p>
                  <p className="text-xs text-neutral">
                    {formatDate(tx.occurred_on, locale)} · {tx.category.name} · {tx.account.name}
                  </p>
                </div>
                <p
                  className={`shrink-0 font-medium ${
                    tx.category.kind === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {tx.category.kind === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount, locale)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
