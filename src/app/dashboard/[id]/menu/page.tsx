import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import MenuManager from "@/components/MenuManager";
import type { Business, Menu } from "@/types";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (!business) notFound();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("business_id", id)
    .maybeSingle();

  let pdfUrl: string | null = null;
  if (menu?.menu_type === "pdf" && menu.pdf_file_path) {
    const { data } = supabase.storage.from("menus").getPublicUrl(menu.pdf_file_path);
    pdfUrl = data.publicUrl;
  }

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-md px-4 py-8">
        <Link href={`/dashboard/${id}/edit`} className="text-sm text-muted hover:text-ink">
          ← {(business as Business).name}
        </Link>
        <h1 className="mt-3 mb-1 text-2xl font-semibold text-ink">Menü</h1>
        <p className="mb-6 text-sm text-muted">
          Menü linki paylaşabilir ya da PDF olarak yükleyebilirsiniz. Değiştirdiğinizde NFC linkiniz aynı kalır.
        </p>

        <MenuManager businessId={id} menu={menu as Menu | null} pdfUrl={pdfUrl} />
      </main>
    </div>
  );
}
