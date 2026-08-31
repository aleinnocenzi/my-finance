"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthlyBucketSeries, SpendingBucket } from "@/lib/spendingGrouping";
import { formatMonthLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { CurrencyTooltip } from "./ChartTooltip";

export function MonthlyTrendChart({
  series,
  bucketKeys,
  locale,
  emptyLabel = "Not enough data yet.",
}: {
  series: MonthlyBucketSeries[];
  bucketKeys: SpendingBucket[];
  locale?: Locale;
  emptyLabel?: string;
}) {
  const data = series.map((row) => ({
    month: formatMonthLabel(`${row.month}-01`, locale),
    ...row.buckets,
  }));

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral">{emptyLabel}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid stroke="#26263a" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <Tooltip content={<CurrencyTooltip locale={locale} />} cursor={{ fill: "#1b1b27" }} />
        {bucketKeys.map((bucket) => (
          <Bar key={bucket.key} dataKey={bucket.key} name={bucket.label} stackId="spend" fill={bucket.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
