import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import LinksManager from "@/components/LinksManager";
import type { Business, BusinessLink } from "@/types";

export default async function LinksPage({
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

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("business_id", id)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-md px-4 py-8">
        <Link href={`/dashboard/${id}/edit`} className="text-sm text-muted hover:text-ink">
          ← {(business as Business).name}
        </Link>
        <h1 className="mt-3 mb-1 text-2xl font-semibold text-ink">Bağlantılar</h1>
        <p className="mb-6 text-sm text-muted">
          Ekle, düzenle, gizle veya sürükleyerek sırala. Değişiklikler anında yayınlanır.
        </p>

        <LinksManager
          businessId={id}
          initialLinks={(links ?? []) as BusinessLink[]}
        />
      </main>
    </div>
  );
}
