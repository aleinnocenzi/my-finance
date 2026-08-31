import { getAccounts, getCategories, getHolidays, getTransactions } from "@/lib/data";
import { getT } from "@/lib/i18n/server";
import { localizeCategories, localizeTransactions } from "@/lib/i18n/localize";
import { Card } from "@/components/ui/Card";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionFiltersBar } from "@/components/TransactionFiltersBar";
import { TransactionsTable } from "@/components/TransactionsTable";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; account?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const { locale, t } = await getT();

  const [accounts, rawCategories, holidays, rawTransactions] = await Promise.all([
    getAccounts(),
    getCategories(),
    getHolidays(),
    getTransactions({
      categoryId: params.category,
      accountId: params.account,
      since: params.from,
      until: params.to,
    }),
  ]);

  const categories = localizeCategories(rawCategories, t);
  const transactions = localizeTransactions(rawTransactions, t);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">{t.transactions.title}</h1>
          <p className="mt-1 text-sm text-neutral">{t.transactions.subtitle}</p>
        </div>
        <AddTransactionModal categories={categories} accounts={accounts} />
      </div>

      <TransactionFiltersBar
        categories={categories}
        accounts={accounts}
        filters={{
          category: params.category,
          account: params.account,
          from: params.from,
          to: params.to,
        }}
        t={t}
      />

      <Card subtitle={t.transactions.countLabel(transactions.length)}>
        <TransactionsTable transactions={transactions} holidays={holidays} t={t} locale={locale} />
      </Card>
    </div>
  );
}
