"use client";

import { useState, useTransition } from "react";
import type { HolidaySummary } from "@/lib/spendingGrouping";
import { deleteHoliday } from "@/app/actions/holidays";
import { formatCurrency, formatDate } from "@/lib/format";
import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function HolidayCard({ summary }: { summary: HolidaySummary }) {
  const { t, locale } = useTranslations();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { holiday, total, transactionCount, byCategory } = summary;

  const maxAmount = Math.max(...byCategory.map((c) => c.amount), 1);

  return (
    <div className="rounded-lg border border-surface-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <button
          className="flex-1 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <p className="text-sm font-medium text-gray-100">
            {expanded ? "▾" : "▸"} {holiday.name}
          </p>
          <p className="mt-0.5 text-xs text-neutral">
            {formatDate(holiday.start_date, locale)} – {formatDate(holiday.end_date, locale)} ·{" "}
            {t.holidays.transactionsCount(transactionCount)}
          </p>
        </button>

        <p className="text-sm font-semibold text-expense">{formatCurrency(total, locale)}</p>

        <button
          onClick={() =>
            startTransition(async () => {
              await deleteHoliday(holiday.id);
            })
          }
          disabled={isPending}
          className="text-xs text-neutral hover:text-expense"
        >
          {t.common.delete}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2 border-t border-surface-border pt-4">
          {byCategory.length === 0 && (
            <p className="text-xs text-neutral">{t.holidays.noExpenses}</p>
          )}
          {byCategory.map((cat) => (
            <div key={cat.categoryId} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-xs text-neutral">{cat.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(cat.amount / maxAmount) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-xs font-medium text-gray-100">
                {formatCurrency(cat.amount, locale)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
