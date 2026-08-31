"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Account } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { CurrencyTooltip } from "./ChartTooltip";

const TYPE_COLORS: Record<string, string> = {
  bank: "#3b82f6",
  investment: "#8b5cf6",
  voucher: "#f59e0b",
  credit: "#ef4444",
  other: "#64748b",
};

export function NetWorthByAccountChart({
  accounts,
  locale,
  balanceLabel = "Balance",
}: {
  accounts: Account[];
  locale?: Locale;
  balanceLabel?: string;
}) {
  const data = accounts
    .map((a) => ({
      name: a.name,
      value: a.is_liability ? -a.current_balance : a.current_balance,
      color: TYPE_COLORS[a.type] ?? "#64748b",
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
        <CartesianGrid stroke="#26263a" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} stroke="#26263a" />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          stroke="#26263a"
        />
        <Tooltip content={<CurrencyTooltip locale={locale} />} cursor={{ fill: "#1b1b27" }} />
        <Bar dataKey="value" name={balanceLabel} radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
