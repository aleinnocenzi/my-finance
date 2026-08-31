"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { t } = await getT();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const name = String(formData.get("name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const occurredOn = String(formData.get("occurred_on") ?? "");
  const categoryId = String(formData.get("category_id") ?? "");
  const accountId = String(formData.get("account_id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !occurredOn || !categoryId || !accountId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error(t.addTransaction.errorRequired);
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: userData.user.id,
    name,
    amount,
    occurred_on: occurredOn,
    category_id: categoryId,
    account_id: accountId,
    notes: notes || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/holidays");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/holidays");
}
