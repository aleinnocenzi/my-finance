"use client";

import { useTransition } from "react";
import { clsx } from "clsx";
import { setLocale } from "@/app/actions/locale";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "it", label: "IT" },
  { value: "en", label: "EN" },
];

export function LocaleSwitcher() {
  const { locale } = useTranslations();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex rounded-lg border border-surface-border bg-background p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          disabled={isPending}
          onClick={() => startTransition(() => setLocale(option.value))}
          className={clsx(
            "rounded-md px-2.5 py-1 text-xs font-medium transition disabled:opacity-60",
            locale === option.value
              ? "bg-accent text-white"
              : "text-neutral hover:text-gray-100"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
