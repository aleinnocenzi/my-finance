"use client";

import { useState, useTransition } from "react";
import { createAccount } from "@/app/actions/accounts";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { AccountType } from "@/lib/types";

const ACCOUNT_TYPES: AccountType[] = ["bank", "investment", "voucher", "credit", "other"];

export function AddAccountModal() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createAccount(formData);
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
        className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-gray-100 transition hover:bg-surface-hover"
      >
        {t.accounts.addTrigger}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-100">{t.accounts.addHeading}</h2>
              <button onClick={close} className="text-neutral hover:text-gray-100">
                ✕
              </button>
            </div>

            <form action={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral">{t.common.name}</label>
                <input
                  name="name"
                  required
                  autoFocus
                  placeholder={t.accounts.namePlaceholder}
                  className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">{t.accounts.typeLabel}</label>
                  <select
                    name="type"
                    required
                    defaultValue="bank"
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t.accountTypes[type]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral">
                    {t.accounts.startingBalanceLabel}
                  </label>
                  <input
                    name="initial_balance"
                    type="number"
                    step="0.01"
                    defaultValue="0"
                    required
                    className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral">
                <input type="checkbox" name="is_liability" className="rounded border-surface-border" />
                {t.accounts.liabilityCheckboxLabel}
              </label>

              {error && (
                <p className="rounded-lg bg-expense/10 px-3 py-2 text-xs text-expense">{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-muted disabled:opacity-60"
              >
                {isPending ? t.common.saving : t.accounts.saveLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
