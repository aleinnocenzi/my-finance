"use client";

import { useTransition } from "react";
import { deleteTransaction } from "@/app/actions/transactions";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function DeleteTransactionButton({ id }: { id: string }) {
  const { t } = useTranslations();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => deleteTransaction(id))}
      disabled={isPending}
      className="text-xs text-neutral hover:text-expense disabled:opacity-60"
    >
      {t.common.delete}
    </button>
  );
}
