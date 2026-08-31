"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { signOut } from "@/app/actions/auth";
import { useTranslations } from "@/lib/i18n/LocaleProvider";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const { t } = useTranslations();

  const links = [
    { href: "/", label: t.nav.overview },
    { href: "/transactions", label: t.nav.transactions },
    { href: "/accounts", label: t.nav.accounts },
    { href: "/holidays", label: t.nav.holidays },
  ];

  return (
    <aside className="flex h-full w-56 flex-col border-r border-surface-border bg-surface px-4 py-6">
      <div className="mb-8 px-2">
        <p className="text-lg font-semibold text-gray-100">{t.brand.name}</p>
        {email && <p className="mt-0.5 truncate text-xs text-neutral">{email}</p>}
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
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
        <LocaleSwitcher />
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
  );
}
