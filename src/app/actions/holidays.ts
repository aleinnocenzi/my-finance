"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

export async function createHoliday(formData: FormData) {
  const supabase = await createClient();
  const { t } = await getT();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not authenticated");

  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");

  if (!name || !startDate || !endDate || endDate < startDate) {
    throw new Error(t.holidays.errorRequired);
  }

  const { error } = await supabase.from("holidays").insert({
    user_id: userData.user.id,
    name,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/holidays");
}

export async function deleteHoliday(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("holidays").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/holidays");
}
