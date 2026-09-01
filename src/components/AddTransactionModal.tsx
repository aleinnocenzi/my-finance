"use client";

import { useState, useTransition } from "react";
import type { Account, Category, TransactionKind } from "@/lib/types";
import { createTransaction } from "@/app/actions/transactions";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddTransactionModal({
  categories,
  accounts,
}: {
  categories: Category[];
  accounts: Account[];
}) {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TransactionKind>("expense");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleCategories = categories.filter((c) => c.kind === kind);

  function close() {
    setOpen(false);
    setError(null);
    setKind("expense");
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createTransaction(formData);
        close();
      } catch (err) {
        setError(err instanceof Error ? err.message : t.common.somethingWrong);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-muted"
      >
        {t.addTransaction.trigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 sm:items-center">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-100">{t.addTransaction.heading}</h2>
              <button onClick={close} className="text-neutral hover:text-gray-100">
                ✕
              </button>
            </div>

            <div className="mb-4 flex rounded-lg border border-surface-border bg-background p-1">
              {(["expense", "income"] as TransactionKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                    kind === k ? "bg-accent text-white" : "text-neutral hover:text-gray-100"
                  }`}
                >
                  {k === "expense" ? t.addTransaction.expense : t.addTransaction.income}
                </button>
              ))}
            </div>

            <form action={handleSubmit} className="space-y-3">
              <input type="hidden" name="kind" value={kind} />

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral">{t.common.name}</label>
                <input
                  name="name"
                  required
                  autoFocus
                  placeholder={
                    kind === "expense"
                      ? t.addTransaction.namePlaceholderExpense
                      : t.addTransaction.namePlaceholderIncome
                  }
                  className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">
                    {t.addTransaction.amountLabel}
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">
                    {t.addTransaction.dateLabel}
                  </label>
                  <input
                    name="occurred_on"
                    type="date"
                    required
                    defaultValue={todayISO()}
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">
                    {t.addTransaction.categoryLabel}
                  </label>
                  <select
                    name="category_id"
                    required
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  >
                    {visibleCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">
                    {t.addTransaction.accountLabel}
                  </label>
                  <select
                    name="account_id"
                    required
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-expense/10 px-3 py-2 text-xs text-expense">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-muted disabled:opacity-60"
              >
                {isPending ? t.common.saving : t.addTransaction.saveLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
