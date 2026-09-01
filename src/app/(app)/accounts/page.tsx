import { getAccounts } from "@/lib/data";
import { summarizeNetWorth } from "@/lib/netWorth";
import { getT } from "@/lib/i18n/server";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/Card";
import { AccountBalanceForm } from "@/components/AccountBalanceForm";
import { AddAccountModal } from "@/components/AddAccountModal";
import { NetWorthByAccountChart } from "@/components/charts/NetWorthByAccountChart";

export default async function AccountsPage() {
  const { locale, t } = await getT();
  const accounts = await getAccounts();
  const netWorth = summarizeNetWorth(accounts);

  const assets = accounts.filter((a) => !a.is_liability);
  const liabilities = accounts.filter((a) => a.is_liability);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">{t.accounts.title}</h1>
          <p className="mt-1 text-sm text-neutral">{t.accounts.subtitle}</p>
        </div>
        <AddAccountModal />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t.overview.netWorth} value={netWorth.netWorth} tone="accent" locale={locale} />
        <StatCard label={t.overview.assets} value={netWorth.totalAssets} tone="neutral" locale={locale} />
        <StatCard label={t.overview.liabilities} value={netWorth.totalLiabilities} tone="expense" locale={locale} />
      </div>

      <Card title={t.accounts.netWorthByAccount}>
        <NetWorthByAccountChart accounts={accounts} locale={locale} balanceLabel={t.common.balance} />
      </Card>

      <Card title={t.accounts.assetsTitle} subtitle={t.accounts.assetsSubtitle}>
        <div className="space-y-2">
          {assets.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral">{t.accounts.noAccounts}</p>
          ) : (
            assets.map((account) => <AccountBalanceForm key={account.id} account={account} />)
          )}
        </div>
      </Card>

      <Card title={t.accounts.liabilitiesTitle} subtitle={t.accounts.liabilitiesSubtitle}>
        <div className="space-y-2">
          {liabilities.length === 0 ? (
            <p className="py-6 text-center text-sm text-neutral">{t.accounts.noLiabilities}</p>
          ) : (
            liabilities.map((account) => <AccountBalanceForm key={account.id} account={account} />)
          )}
        </div>
      </Card>
    </div>
  );
}
