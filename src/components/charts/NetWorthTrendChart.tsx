"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NetWorthPoint } from "@/lib/netWorth";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { CurrencyTooltip } from "./ChartTooltip";

export function NetWorthTrendChart({
  points,
  locale,
  netWorthLabel = "Net worth",
  emptyLabel = "Update a couple of account balances to start seeing your net worth trend.",
}: {
  points: NetWorthPoint[];
  locale?: Locale;
  netWorthLabel?: string;
  emptyLabel?: string;
}) {
  if (points.length < 2) {
    return <p className="py-10 text-center text-sm text-neutral">{emptyLabel}</p>;
  }

  const data = points.map((p) => ({ date: formatDate(p.date, locale), netWorth: p.netWorth }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid stroke="#26263a" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <Tooltip content={<CurrencyTooltip locale={locale} />} />
        <Line
          type="monotone"
          dataKey="netWorth"
          name={netWorthLabel}
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 3, fill: "#6366f1" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
