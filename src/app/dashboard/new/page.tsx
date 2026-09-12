import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import NewBusinessForm from "@/components/NewBusinessForm";

export default async function NewBusinessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <DashboardHeader email={user.email} />
      <main className="mx-auto max-w-md px-4 py-8">
        <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
          ← İşletmelerim
        </Link>
        <h1 className="mt-3 mb-6 text-2xl font-semibold text-ink">
          Yeni İşletme
        </h1>
        <div className="rounded-xl border border-line bg-panel p-6">
          <NewBusinessForm />
        </div>
        <p className="mt-4 text-sm text-muted">
          Oluşturduktan sonra benzersiz ve sabit bir NFC linki otomatik üretilecek.
        </p>
      </main>
    </div>
  );
}
