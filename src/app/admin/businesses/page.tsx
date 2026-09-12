import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import AdminBusinessRow from "@/components/AdminBusinessRow";
import type { Business } from "@/types";

export default async function AdminBusinessesPage() {
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

  const { data: businesses } = await supabase
    .from("businesses")
    .select("*, profiles(email)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} isAdmin />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/admin" className="text-sm text-muted hover:text-ink">
          ← Admin
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-semibold text-ink">İşletmeler</h1>

        <div className="flex flex-col gap-2">
          {(businesses ?? []).map((b) => (
            <AdminBusinessRow
              key={b.id}
              business={b as Business}
              ownerEmail={(b as unknown as { profiles?: { email?: string } }).profiles?.email}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
