import { formatCurrency } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function CurrencyTooltip({
  active,
  payload,
  label,
  locale,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
  locale?: Locale;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-surface-border bg-background px-3 py-2 text-xs shadow-xl">
      {label && <p className="mb-1 font-medium text-gray-200">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 text-neutral">
          {entry.color && (
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
          )}
          <span className="text-gray-300">{entry.name}:</span>
          <span className="font-medium text-gray-100">{formatCurrency(entry.value, locale)}</span>
        </p>
      ))}
    </div>
  );
}
