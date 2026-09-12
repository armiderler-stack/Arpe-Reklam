"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";

export async function createBusinessAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Giriş yapmalısınız." };

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoFile = formData.get("logo") as File | null;

  if (!name) return { error: "İşletme adı gerekli." };

  // Benzersiz slug üret (çakışma ihtimaline karşı birkaç kez dene)
  let slug = generateSlug();
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = generateSlug();
  }

  let logo_url: string | null = null;
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop();
    const path = `${user.id}/${slug}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, logoFile, { upsert: true });
    if (!uploadError) {
      const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
      logo_url = pub.publicUrl;
    }
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
      user_id: user.id,
      name,
      description: description || null,
      logo_url,
      slug,
    })
    .select()
    .single();

  if (error || !business) {
    return { error: "İşletme oluşturulamadı: " + (error?.message ?? "") };
  }

  redirect(`/dashboard/${business.id}/links`);
}

export async function updateBusinessAction(
  businessId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const logoFile = formData.get("logo") as File | null;

  if (!name) return { error: "İşletme adı gerekli." };

  const updates: Record<string, unknown> = {
    name,
    description: description || null,
  };

  if (logoFile && logoFile.size > 0) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ext = logoFile.name.split(".").pop();
    const path = `${user?.id}/${businessId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, logoFile, { upsert: true });
    if (!uploadError) {
      const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
      updates.logo_url = pub.publicUrl;
    }
  }

  const { error } = await supabase
    .from("businesses")
    .update(updates)
    .eq("id", businessId);

  if (error) return { error: "Güncellenemedi: " + error.message };

  revalidatePath(`/dashboard/${businessId}/edit`);
  revalidatePath("/dashboard");
  return {};
}

export async function deleteBusinessAction(businessId: string) {
  const supabase = await createClient();
  await supabase.from("businesses").delete().eq("id", businessId);
  revalidatePath("/dashboard");
}
