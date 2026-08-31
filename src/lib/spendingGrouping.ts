import type { Holiday, TransactionWithRefs } from "./types";

const HOLIDAY_PALETTE = ["#f43f5e", "#0ea5e9", "#d946ef", "#fb923c", "#2dd4bf", "#a3e635"];

export function holidayColor(holidays: Holiday[], holidayId: string): string {
  const index = holidays.findIndex((h) => h.id === holidayId);
  return HOLIDAY_PALETTE[index % HOLIDAY_PALETTE.length] ?? "#f43f5e";
}

/** Finds the holiday (if any) whose date range covers this transaction's date. */
export function findHolidayForDate(holidays: Holiday[], occurredOn: string): Holiday | undefined {
  return holidays.find((h) => occurredOn >= h.start_date && occurredOn <= h.end_date);
}

export interface SpendingBucket {
  key: string;
  label: string;
  color: string;
  amount: number;
  isHoliday: boolean;
  holidayId?: string;
}

/**
 * Groups expense transactions into chart-ready buckets. Transactions that
 * fall inside a holiday's date range are lumped under that holiday instead
 * of their category, per the holiday-mode requirement - the category detail
 * is still available by expanding the holiday on the Holidays page.
 */
export function groupExpensesForChart(
  transactions: TransactionWithRefs[],
  holidays: Holiday[]
): SpendingBucket[] {
  const buckets = new Map<string, SpendingBucket>();

  for (const tx of transactions) {
    const holiday = findHolidayForDate(holidays, tx.occurred_on);

    const key = holiday ? `holiday:${holiday.id}` : `category:${tx.category_id}`;
    const existing = buckets.get(key);

    if (existing) {
      existing.amount += tx.amount;
    } else {
      buckets.set(key, {
        key,
        label: holiday ? holiday.name : tx.category.name,
        color: holiday ? holidayColor(holidays, holiday.id) : tx.category.color,
        amount: tx.amount,
        isHoliday: !!holiday,
        holidayId: holiday?.id,
      });
    }
  }

  return [...buckets.values()].sort((a, b) => b.amount - a.amount);
}

export interface HolidaySummary {
  holiday: Holiday;
  total: number;
  transactionCount: number;
  byCategory: { categoryId: string; name: string; color: string; amount: number }[];
}

/** Exploded, per-category breakdown of a single holiday - used on expand. */
export function summarizeHoliday(
  holiday: Holiday,
  transactions: TransactionWithRefs[]
): HolidaySummary {
  const inRange = transactions.filter(
    (tx) => tx.occurred_on >= holiday.start_date && tx.occurred_on <= holiday.end_date
  );

  const byCategoryMap = new Map<string, { categoryId: string; name: string; color: string; amount: number }>();

  for (const tx of inRange) {
    const existing = byCategoryMap.get(tx.category_id);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      byCategoryMap.set(tx.category_id, {
        categoryId: tx.category_id,
        name: tx.category.name,
        color: tx.category.color,
        amount: tx.amount,
      });
    }
  }

  return {
    holiday,
    total: inRange.reduce((sum, tx) => sum + tx.amount, 0),
    transactionCount: inRange.length,
    byCategory: [...byCategoryMap.values()].sort((a, b) => b.amount - a.amount),
  };
}

export interface MonthlyBucketSeries {
  month: string;
  buckets: Record<string, number>;
}

/** Builds per-month totals per bucket (category or holiday), for stacked trend charts. */
export function groupExpensesByMonth(
  transactions: TransactionWithRefs[],
  holidays: Holiday[]
): { series: MonthlyBucketSeries[]; bucketKeys: SpendingBucket[] } {
  const monthly = new Map<string, Map<string, number>>();
  const bucketMeta = new Map<string, SpendingBucket>();

  for (const tx of transactions) {
    const month = tx.occurred_on.slice(0, 7); // YYYY-MM
    const holiday = findHolidayForDate(holidays, tx.occurred_on);
    const key = holiday ? `holiday:${holiday.id}` : `category:${tx.category_id}`;

    if (!bucketMeta.has(key)) {
      bucketMeta.set(key, {
        key,
        label: holiday ? holiday.name : tx.category.name,
        color: holiday ? holidayColor(holidays, holiday.id) : tx.category.color,
        amount: 0,
        isHoliday: !!holiday,
        holidayId: holiday?.id,
      });
    }

    if (!monthly.has(month)) monthly.set(month, new Map());
    const monthMap = monthly.get(month)!;
    monthMap.set(key, (monthMap.get(key) ?? 0) + tx.amount);
  }

  const series = [...monthly.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, buckets]) => ({ month, buckets: Object.fromEntries(buckets) }));

  return { series, bucketKeys: [...bucketMeta.values()] };
}
