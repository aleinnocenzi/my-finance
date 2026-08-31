import { DEFAULT_LOCALE, INTL_LOCALE, type Locale } from "./i18n/config";

export function formatCurrency(value: number, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date, locale: Locale = DEFAULT_LOCALE): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatMonthLabel(value: string | Date, locale: Locale = DEFAULT_LOCALE): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: "short", year: "2-digit" }).format(date);
}
