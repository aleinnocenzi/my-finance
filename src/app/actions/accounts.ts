"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

/**
 * Sets the authoritative current balance for an account. This is the source
 * of truth for net worth - transactions never recompute it. Every update is
 * also logged to account_balance_history so net worth can be charted over time.
 */
export async function updateAccountBalance(accountId: string, newBalance: number) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const { error: updateError } = await supabase
    .from("accounts")
    .update({ current_balance: newBalance, balance_updated_at: new Date().toISOString() })
    .eq("id", accountId);

  if (updateError) throw new Error(updateError.message);

  const { error: historyError } = await supabase.from("account_balance_history").insert({
    account_id: accountId,
    user_id: userData.user.id,
    balance: newBalance,
  });

  if (historyError) throw new Error(historyError.message);

  revalidatePath("/");
  revalidatePath("/accounts");
}

export async function createAccount(formData: FormData) {
  const supabase = await createClient();
  const { t } = await getT();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const isLiability = formData.get("is_liability") === "on";
  const initialBalance = Number(formData.get("initial_balance") ?? 0);

  if (!name || !type || !Number.isFinite(initialBalance)) {
    throw new Error(t.accounts.errorRequired);
  }

  const { count } = await supabase
    .from("accounts")
    .select("id", { count: "exact", head: true });

  const { data: account, error: insertError } = await supabase
    .from("accounts")
    .insert({
      user_id: userData.user.id,
      name,
      type,
      is_liability: isLiability,
      current_balance: initialBalance,
      display_order: (count ?? 0) + 1,
    })
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  const { error: historyError } = await supabase.from("account_balance_history").insert({
    account_id: account.id,
    user_id: userData.user.id,
    balance: initialBalance,
  });

  if (historyError) throw new Error(historyError.message);

  revalidatePath("/");
  revalidatePath("/accounts");
}

export async function deleteAccount(accountId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("accounts").delete().eq("id", accountId);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/accounts");
}
