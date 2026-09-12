import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";

export default async function AdminPage() {
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

  if (!profile?.is_admin) redirect("/dashboard");

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: businessCount } = await supabase
    .from("businesses")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} isAdmin />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-ink">Admin Paneli</h1>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/users"
            className="rounded-xl border border-line bg-panel p-6 hover:border-ink"
          >
            <p className="text-3xl font-display font-semibold text-ink">{userCount ?? 0}</p>
            <p className="mt-1 text-sm text-muted">Kullanıcılar →</p>
          </Link>
          <Link
            href="/admin/businesses"
            className="rounded-xl border border-line bg-panel p-6 hover:border-ink"
          >
            <p className="text-3xl font-display font-semibold text-ink">{businessCount ?? 0}</p>
            <p className="mt-1 text-sm text-muted">İşletmeler →</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
