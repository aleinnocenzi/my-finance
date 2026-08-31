export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";
export const LOCALE_COOKIE = "locale";

export const INTL_LOCALE: Record<Locale, string> = {
  it: "it-IT",
  en: "en-GB",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
