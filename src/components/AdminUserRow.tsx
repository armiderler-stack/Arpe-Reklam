"use client";

import { useTransition } from "react";
import { toggleUserActiveAction } from "@/lib/actions/admin";
import type { Profile } from "@/types";

export default function AdminUserRow({ profile }: { profile: Profile }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-panel p-4">
      <div>
        <p className="text-sm font-medium text-ink">{profile.email}</p>
        <p className="text-xs text-muted">
          {profile.is_admin ? "Admin · " : ""}
          {new Date(profile.created_at).toLocaleDateString("tr-TR")}
        </p>
      </div>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(() => toggleUserActiveAction(profile.id, !profile.is_active))
        }
        className={`rounded-lg px-3 py-2 text-sm ${
          profile.is_active
            ? "border border-danger text-danger hover:bg-danger/10"
            : "bg-accent text-white hover:bg-accent-dark"
        } disabled:opacity-50`}
      >
        {profile.is_active ? "Pasif Yap" : "Aktif Yap"}
      </button>
    </div>
  );
}
