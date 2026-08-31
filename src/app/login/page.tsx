import { signIn } from "./actions";
import { getT } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { t } = await getT();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-surface-border bg-surface p-8 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-100">{t.login.title}</h1>
          <LocaleSwitcher />
        </div>
        <p className="mt-1 text-sm text-neutral">{t.login.subtitle}</p>

        <form action={signIn} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral">{t.login.email}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral">{t.login.password}</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-surface-border bg-background px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-expense/10 px-3 py-2 text-xs text-expense">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-muted"
          >
            {t.login.signIn}
          </button>
        </form>

        <p className="mt-6 text-xs text-neutral">{t.login.noAccount}</p>
      </div>
    </main>
  );
}
