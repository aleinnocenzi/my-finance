# My Finance

A personal finance dashboard: expenses, income, net worth by account, holiday-mode
expense grouping, and spending charts. Dark theme, built with Next.js (App Router),
Supabase (Postgres + Auth) and Tailwind CSS. Deploys to Vercel.

## Stack

- **Next.js 14** (App Router, Server Actions, Server Components)
- **Supabase**: Postgres database, Auth (email/password), Row Level Security
- **Tailwind CSS** for the dark UI
- **Recharts** for charts

## How the app is organized

- `supabase/schema.sql` - full database schema, RLS policies, seed categories, and
  a seed block for your 10 accounts.
- `src/lib/data.ts` - all read queries (accounts, categories, holidays, transactions).
- `src/app/actions/*.ts` - all mutations (Server Actions): create/delete transactions,
  create/delete holidays, update account balances, sign out.
- `src/app/(app)/*` - the protected dashboard (Overview, Transactions, Accounts, Holidays).
- `src/app/login` - the sign-in page. `middleware.ts` redirects unauthenticated visitors here.
- `src/lib/netWorth.ts`, `src/lib/spendingGrouping.ts`, `src/lib/incomeExpense.ts` -
  the calculation logic behind every chart.

### Key design decisions (per your requirements)

- **Account balances are manual and authoritative.** Updating a balance on the
  Accounts page overwrites `accounts.current_balance` directly and appends a row to
  `account_balance_history` (used for the net worth trend chart). Transactions
  never recalculate a balance - they only feed analytics/charts.
- **Holiday mode** is a date-range lens, not a stored link on each transaction.
  Any expense whose date falls inside a holiday's `start_date`/`end_date` is
  automatically grouped under that holiday in the spending charts. Expanding a
  holiday on the Holidays page shows the same category breakdown as normal
  (Fuel, Groceries, ...) but scoped to that trip.
- **Investments** (ETF, Stocks, Crypto) are just expense categories (money leaving
  an account) plus a couple of investment-type accounts you track in net worth,
  as you clarified - no separate "investment" data model yet.

## Local setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Authentication -> Users**, click **Add user** and create yourself a
   login (email + password). This app has no public sign-up page on purpose -
   it's a single-user personal dashboard.
3. In **SQL Editor**, paste the contents of `supabase/schema.sql` and run it.
   - It creates all tables, enables RLS, and seeds the fixed category list.
   - It also seeds your 10 accounts (Trade Republic, Banca di Imola, Trade
     Republic Investment Account, PayPal, Revolut, Satispay, Buoni Pasto,
     Buoni Cad-hoc, Bwin, Credit) attached to the first user it finds in
     `auth.users` - so run it *after* step 2.
   - All balances start at 0. Set the real ones from the Accounts page once
     you're logged in.
4. Grab your API keys from **Project Settings -> API**: the `Project URL` and
   the `anon public` key.

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the
values from step 1.

### 3. Install and run

```bash
npm install
npm run dev
```

Open **http://localhost:3000** and sign in with the user you created in Supabase.

## Deploying to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), import the repository.
3. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in **Project Settings -> Environment Variables**.
4. Deploy. No other configuration is needed - it's a standard Next.js app.

## What's next (ideas, not built yet)

- Editing existing transactions (currently: add + delete).
- Recurring transactions (e.g. monthly rent/salary auto-entry).
- Budgets per category with progress bars.
- CSV import/export.
- Turning "investment" into its own tracked model (units, price history, gains).
