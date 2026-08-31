"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SpendingBucket } from "@/lib/spendingGrouping";
import { formatCurrency } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export function SpendingByCategoryChart({
  buckets,
  locale,
  emptyLabel = "No expenses in this period.",
}: {
  buckets: SpendingBucket[];
  locale?: Locale;
  emptyLabel?: string;
}) {
  if (buckets.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral">{emptyLabel}</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={buckets}
          dataKey="amount"
          nameKey="label"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {buckets.map((bucket) => (
            <Cell key={bucket.key} fill={bucket.color} stroke="#0a0a0f" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value, locale)}
          contentStyle={{
            background: "#0a0a0f",
            border: "1px solid #26263a",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
