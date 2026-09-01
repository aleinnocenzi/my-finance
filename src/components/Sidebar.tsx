"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { signOut } from "@/app/actions/auth";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.overview },
    { href: "/transactions", label: t.nav.transactions },
    { href: "/accounts", label: t.nav.accounts },
    { href: "/holidays", label: t.nav.holidays },
  ];

  return (
    <>
      <header className="flex items-center justify-between border-b border-surface-border bg-surface px-4 py-3 lg:hidden">
        <p className="text-lg font-semibold text-gray-100">{t.brand.name}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-neutral transition hover:bg-surface-hover hover:text-gray-100"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-surface-border bg-surface px-4 py-6 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:w-56 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-semibold text-gray-100">{t.brand.name}</p>
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1 text-neutral transition hover:bg-surface-hover hover:text-gray-100 lg:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          {email && <p className="mt-0.5 truncate text-xs text-neutral">{email}</p>}
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-accent text-white"
                    : "text-neutral hover:bg-surface-hover hover:text-gray-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral transition hover:bg-surface-hover hover:text-gray-100"
            >
              {t.nav.signOut}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
