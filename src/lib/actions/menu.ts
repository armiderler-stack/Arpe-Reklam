"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";

export async function saveMenuLinkAction(
  businessId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const menuUrl = String(formData.get("menu_url") || "").trim();

  if (!menuUrl) return { error: "Menü linki boş olamaz." };

  const { error } = await supabase.from("menus").upsert(
    {
      business_id: businessId,
      menu_type: "link",
      menu_url: menuUrl,
      pdf_file_path: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id" }
  );

  if (error) return { error: "Kaydedilemedi: " + error.message };

  revalidatePath(`/dashboard/${businessId}/menu`);
  return {};
}

export async function uploadMenuPdfAction(
  businessId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const file = formData.get("pdf") as File | null;

  if (!file || file.size === 0) return { error: "PDF dosyası seçilmedi." };
  if (file.type !== "application/pdf") return { error: "Sadece PDF yükleyebilirsiniz." };

  const path = `${businessId}/menu-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("menus")
    .upload(path, file, { upsert: true, contentType: "application/pdf" });

  if (uploadError) return { error: "Yükleme başarısız: " + uploadError.message };

  const { error } = await supabase.from("menus").upsert(
    {
      business_id: businessId,
      menu_type: "pdf",
      menu_url: null,
      pdf_file_path: path,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id" }
  );

  if (error) return { error: "Kaydedilemedi: " + error.message };

  revalidatePath(`/dashboard/${businessId}/menu`);
  return {};
}

export async function deleteMenuAction(businessId: string) {
  const supabase = await createClient();
  await supabase.from("menus").delete().eq("business_id", businessId);
  revalidatePath(`/dashboard/${businessId}/menu`);
}
