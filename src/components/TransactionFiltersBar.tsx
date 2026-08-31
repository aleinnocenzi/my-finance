import type { Account, Category } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function TransactionFiltersBar({
  categories,
  accounts,
  filters,
  t,
}: {
  categories: Category[];
  accounts: Account[];
  filters: { category?: string; account?: string; from?: string; to?: string };
  t: Dictionary;
}) {
  const hasFilters = !!(filters.category || filters.account || filters.from || filters.to);

  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-surface-border bg-background p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.transactions.filterCategory}</label>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        >
          <option value="">{t.transactions.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.transactions.filterAccount}</label>
        <select
          name="account"
          defaultValue={filters.account ?? ""}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        >
          <option value="">{t.transactions.allAccounts}</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.transactions.filterFrom}</label>
        <input
          type="date"
          name="from"
          defaultValue={filters.from ?? ""}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.transactions.filterTo}</label>
        <input
          type="date"
          name="to"
          defaultValue={filters.to ?? ""}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-muted"
      >
        {t.common.filter}
      </button>

      {hasFilters && (
        <a href="/transactions" className="rounded-lg px-3 py-2 text-sm text-neutral hover:text-gray-100">
          {t.common.clear}
        </a>
      )}
    </form>
  );
}
