import { createClient } from "@/lib/supabase/server";
import type { Account, AccountBalanceHistoryRow, Category, Holiday, TransactionWithRefs } from "@/lib/types";

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getHolidays(): Promise<Holiday[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("holidays")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface TransactionFilters {
  since?: string;
  until?: string;
  categoryId?: string;
  accountId?: string;
}

export async function getTransactions(options?: TransactionFilters): Promise<TransactionWithRefs[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*, category:categories(*), account:accounts(id, name, type)")
    .order("occurred_on", { ascending: false });

  if (options?.since) query = query.gte("occurred_on", options.since);
  if (options?.until) query = query.lte("occurred_on", options.until);
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.accountId) query = query.eq("account_id", options.accountId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TransactionWithRefs[];
}

export async function getBalanceHistory(): Promise<AccountBalanceHistoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_balance_history")
    .select("id, account_id, balance, recorded_at")
    .order("recorded_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
