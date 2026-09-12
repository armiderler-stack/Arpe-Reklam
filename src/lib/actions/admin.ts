"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Giriş yapılmamış.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Yetkiniz yok.");
  return supabase;
}

export async function toggleUserActiveAction(userId: string, isActive: boolean) {
  const supabase = await assertAdmin();
  await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function toggleBusinessActiveAction(businessId: string, isActive: boolean) {
  const supabase = await assertAdmin();
  await supabase.from("businesses").update({ is_active: isActive }).eq("id", businessId);
  revalidatePath("/admin/businesses");
}
