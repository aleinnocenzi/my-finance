import { clsx } from "clsx";
import { formatCurrency } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function StatCard({
  label,
  value,
  tone = "neutral",
  locale,
}: {
  label: string;
  value: number;
  tone?: "neutral" | "income" | "expense" | "accent";
  locale?: Locale;
}) {
  const toneClass = {
    neutral: "text-gray-100",
    income: "text-income",
    expense: "text-expense",
    accent: "text-accent",
  }[tone];

  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral">{label}</p>
      <p className={clsx("mt-2 text-2xl font-semibold", toneClass)}>
        {formatCurrency(value, locale)}
      </p>
    </div>
  );
}
