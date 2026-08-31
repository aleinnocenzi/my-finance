"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import { dictionaries } from "./dictionaries";

const LocaleContext = createContext<Locale | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useTranslations() {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error("useTranslations must be used within a LocaleProvider");
  return { locale, t: dictionaries[locale] };
}
