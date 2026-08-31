"use client";

import { useState, useTransition } from "react";
import { createHoliday } from "@/app/actions/holidays";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function CreateHolidayForm() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createHoliday(formData);
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.common.somethingWrong);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-muted"
      >
        {t.holidays.addTrigger}
      </button>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-surface-border bg-background p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.common.name}</label>
        <input
          name="name"
          required
          placeholder={t.holidays.namePlaceholder}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.holidays.startDateLabel}</label>
        <input
          name="start_date"
          type="date"
          required
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.holidays.endDateLabel}</label>
        <input
          name="end_date"
          type="date"
          required
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-muted disabled:opacity-60"
      >
        {isPending ? t.common.saving : t.holidays.createLabel}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-lg px-3 py-2 text-sm text-neutral hover:text-gray-100"
      >
        {t.common.cancel}
      </button>

      {error && <p className="w-full text-xs text-expense">{error}</p>}
    </form>
  );
}
