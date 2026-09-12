import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import AdminUserRow from "@/components/AdminUserRow";
import type { Profile } from "@/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!myProfile?.is_admin) redirect("/dashboard");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} isAdmin />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/admin" className="text-sm text-muted hover:text-ink">
          ← Admin
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-semibold text-ink">Kullanıcılar</h1>

        <div className="flex flex-col gap-2">
          {(profiles ?? []).map((p) => (
            <AdminUserRow key={p.id} profile={p as Profile} />
          ))}
        </div>
      </main>
    </div>
  );
}
