"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";
import type { LinkType } from "@/types";
import { getLinkTypeConfig } from "@/types";

function buildUrl(type: LinkType, rawValue: string): string {
  const value = rawValue.trim();
  const config = getLinkTypeConfig(type);
  if (!config.urlPrefix) return value;
  // Kullanıcı zaten tam link/numara girmişse tekrar prefix ekleme
  if (value.startsWith("http") || value.startsWith(config.urlPrefix)) {
    return value;
  }
  if (type === "whatsapp" || type === "phone") {
    // sadece rakamları al
    const digits = value.replace(/\D/g, "");
    return config.urlPrefix + digits;
  }
  return config.urlPrefix + value;
}

export async function addLinkAction(
  businessId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const type = String(formData.get("type") || "custom") as LinkType;
  const label = String(formData.get("label") || "").trim();
  const rawValue = String(formData.get("value") || "").trim();

  if (!rawValue) return { error: "Bağlantı değeri boş olamaz." };

  const url = buildUrl(type, rawValue);

  const { data: maxRow } = await supabase
    .from("links")
    .select("sort_order")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("links").insert({
    business_id: businessId,
    type,
    label: label || null,
    url,
    sort_order: nextOrder,
  });

  if (error) return { error: "Bağlantı eklenemedi: " + error.message };

  revalidatePath(`/dashboard/${businessId}/links`);
  return {};
}

export async function updateLinkAction(
  linkId: string,
  businessId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const type = String(formData.get("type") || "custom") as LinkType;
  const label = String(formData.get("label") || "").trim();
  const rawValue = String(formData.get("value") || "").trim();

  if (!rawValue) return { error: "Bağlantı değeri boş olamaz." };

  const url = buildUrl(type, rawValue);

  const { error } = await supabase
    .from("links")
    .update({ type, label: label || null, url })
    .eq("id", linkId);

  if (error) return { error: "Güncellenemedi: " + error.message };

  revalidatePath(`/dashboard/${businessId}/links`);
  return {};
}

export async function deleteLinkAction(linkId: string, businessId: string) {
  const supabase = await createClient();
  await supabase.from("links").delete().eq("id", linkId);
  revalidatePath(`/dashboard/${businessId}/links`);
}

export async function toggleLinkVisibilityAction(
  linkId: string,
  businessId: string,
  isVisible: boolean
) {
  const supabase = await createClient();
  await supabase.from("links").update({ is_visible: isVisible }).eq("id", linkId);
  revalidatePath(`/dashboard/${businessId}/links`);
}

export async function reorderLinksAction(
  businessId: string,
  orderedIds: string[]
) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("links").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath(`/dashboard/${businessId}/links`);
}
