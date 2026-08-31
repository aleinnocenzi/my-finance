import type { Account, AccountBalanceHistoryRow } from "./types";

export interface NetWorthSummary {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
}

export function summarizeNetWorth(accounts: Account[]): NetWorthSummary {
  let totalAssets = 0;
  let totalLiabilities = 0;

  for (const account of accounts) {
    if (account.is_liability) {
      totalLiabilities += account.current_balance;
    } else {
      totalAssets += account.current_balance;
    }
  }

  return {
    netWorth: totalAssets - totalLiabilities,
    totalAssets,
    totalLiabilities,
  };
}

export interface NetWorthPoint {
  date: string;
  netWorth: number;
}

/**
 * Every balance update writes a history row, so the net worth over time is a
 * step function: replay history rows in chronological order, keeping the
 * latest known balance per account, and re-sum after each event.
 */
export function computeNetWorthTimeline(
  accounts: Account[],
  history: AccountBalanceHistoryRow[]
): NetWorthPoint[] {
  const liabilityByAccount = new Map(accounts.map((a) => [a.id, a.is_liability]));
  const latestBalance = new Map<string, number>();

  const sorted = [...history].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const points: NetWorthPoint[] = [];

  for (const entry of sorted) {
    latestBalance.set(entry.account_id, entry.balance);

    let netWorth = 0;
    for (const [accountId, balance] of latestBalance.entries()) {
      const isLiability = liabilityByAccount.get(accountId) ?? false;
      netWorth += isLiability ? -balance : balance;
    }

    points.push({ date: entry.recorded_at, netWorth });
  }

  return points;
}
