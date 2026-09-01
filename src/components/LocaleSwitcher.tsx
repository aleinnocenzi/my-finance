"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { clsx } from "clsx";
import { setLocale } from "@/app/actions/locale";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

function ItalyFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <rect width="20" height="30" fill="#009246" />
      <rect x="20" width="20" height="30" fill="#fff" />
      <rect x="40" width="20" height="30" fill="#CE2B37" />
    </svg>
  );
}

function UkFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const OPTIONS: { value: Locale; Flag: typeof ItalyFlag; label: string }[] = [
  { value: "it", Flag: ItalyFlag, label: "Italiano" },
  { value: "en", Flag: UkFlag, label: "English" },
];

export function LocaleSwitcher() {
  const { locale } = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((option) => option.value === locale) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((value) => !value)}
        aria-label="Change language"
        className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ring-1 ring-surface-border transition hover:ring-accent disabled:opacity-60"
      >
        <current.Flag className="h-full w-full object-cover" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-surface-border bg-surface shadow-lg">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              onClick={() => {
                setOpen(false);
                startTransition(() => setLocale(option.value));
              }}
              className={clsx(
                "flex w-full items-center gap-2 whitespace-nowrap px-3 py-1.5 text-left text-xs transition disabled:opacity-60",
                option.value === locale
                  ? "bg-accent text-white"
                  : "text-neutral hover:bg-surface-hover hover:text-gray-100"
              )}
            >
              <span className="h-3.5 w-5 overflow-hidden rounded-sm">
                <option.Flag className="h-full w-full object-cover" />
              </span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
