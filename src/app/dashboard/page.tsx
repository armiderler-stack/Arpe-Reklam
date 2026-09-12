import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import BusinessCard from "@/components/BusinessCard";
import type { Business } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (businesses ?? []) as Business[];

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} isAdmin={profile?.is_admin} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ink">İşletmelerim</h1>
          <Link
            href="/dashboard/new"
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark"
          >
            + Yeni İşletme
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-panel p-10 text-center">
            <p className="text-ink">Henüz bir işletmeniz yok.</p>
            <p className="mt-1 text-sm text-muted">
              İlk işletmenizi oluşturun, sabit NFC linkiniz otomatik üretilsin.
            </p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-block rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark"
            >
              + Yeni İşletme
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
