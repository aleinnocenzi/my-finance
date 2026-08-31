"use client";

import { useState, useTransition } from "react";
import type { Account } from "@/lib/types";
import { updateAccountBalance } from "@/app/actions/accounts";
import { formatCurrency, formatDate } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { DeleteAccountButton } from "./DeleteAccountButton";

export function AccountBalanceForm({ account }: { account: Account }) {
  const { t, locale } = useTranslations();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(account.current_balance));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setError(t.accounts.errorEnterNumber);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await updateAccountBalance(account.id, parsed);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.accounts.errorUpdate);
      }
    });
  }

  return (
    <div className="rounded-lg border border-surface-border bg-background px-4 py-3">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-100">{account.name}</p>
        <p className="text-xs text-neutral">
          {t.accountTypes[account.type]} · {t.accounts.updatedOn(formatDate(account.balance_updated_at, locale))}
        </p>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 rounded-lg border border-surface-border bg-surface px-2 py-1 text-sm text-gray-100 outline-none focus:border-accent"
            autoFocus
          />
          <button
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-accent px-2 py-1 text-xs font-medium text-white hover:bg-accent-muted disabled:opacity-60"
          >
            {t.common.save}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setValue(String(account.current_balance));
              setError(null);
            }}
            className="rounded-lg px-2 py-1 text-xs text-neutral hover:text-gray-100"
          >
            {t.common.cancel}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <p
            className={`text-sm font-semibold ${
              account.is_liability ? "text-expense" : "text-gray-100"
            }`}
          >
            {formatCurrency(account.current_balance, locale)}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg px-2 py-1 text-xs text-accent hover:underline"
          >
            {t.common.update}
          </button>
          <DeleteAccountButton id={account.id} />
        </div>
      )}
    </div>
      {error && <p className="mt-2 text-xs text-expense">{error}</p>}
    </div>
  );
}
