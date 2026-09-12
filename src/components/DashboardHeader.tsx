import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

export default function DashboardHeader({
  email,
  isAdmin,
}: {
  email?: string;
  isAdmin?: boolean;
}) {
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="font-display text-lg font-semibold text-ink">
          ARPE REKLAM
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {isAdmin && (
            <Link href="/admin" className="text-muted hover:text-ink">
              Admin
            </Link>
          )}
          <span className="hidden text-muted sm:inline">{email}</span>
          <form action={logoutAction}>
            <button className="text-muted hover:text-ink">Çıkış</button>
          </form>
        </div>
      </div>
    </header>
  );
}
