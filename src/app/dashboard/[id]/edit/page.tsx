import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import EditBusinessForm from "@/components/EditBusinessForm";
import { getBusinessUrl } from "@/lib/slug";
import type { Business } from "@/types";

export default async function EditBusinessPage({
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

  const url = getBusinessUrl((business as Business).slug);

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-md px-4 py-8">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← İşletmelerim
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-ink">
          {(business as Business).name}
        </h1>
        <p className="mt-1 break-all text-sm text-accent">{url}</p>

        <div className="mt-4 flex gap-2 text-sm">
          <Link
            href={`/dashboard/${id}/links`}
            className="rounded-lg border border-line px-3 py-2 hover:border-ink"
          >
            Bağlantılar
          </Link>
          <Link
            href={`/dashboard/${id}/menu`}
            className="rounded-lg border border-line px-3 py-2 hover:border-ink"
          >
            Menü
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-panel p-6">
          <EditBusinessForm business={business as Business} />
        </div>
      </main>
    </div>
  );
}
