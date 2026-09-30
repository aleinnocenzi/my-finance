import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function DateRangeFilter({
  from,
  to,
  isCustom,
  t,
}: {
  from: string;
  to: string;
  isCustom: boolean;
  t: Dictionary;
}) {
  const inputClass =
    "rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent";

  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-surface-border bg-background p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.overview.dateFrom}</label>
        <input type="date" name="from" defaultValue={from} max={to} required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral">{t.overview.dateTo}</label>
        <input type="date" name="to" defaultValue={to} min={from} required className={inputClass} />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-muted"
      >
        {t.overview.apply}
      </button>
      {isCustom && (
        <Link href="/" className="rounded-lg px-3 py-2 text-sm text-neutral hover:text-gray-100">
          {t.overview.resetRange}
        </Link>
      )}
    </form>
  );
}
