"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/actions/accounts";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function DeleteAccountButton({ id }: { id: string }) {
  const { t } = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="text-right">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            try {
              await deleteAccount(id);
            } catch (err) {
              setError(err instanceof Error ? t.accounts.deleteBlocked : t.common.somethingWrong);
            }
          })
        }
        disabled={isPending}
        className="text-xs text-neutral hover:text-expense disabled:opacity-60"
      >
        {t.common.delete}
      </button>
      {error && <p className="mt-1 text-xs text-expense">{error}</p>}
    </div>
  );
}
