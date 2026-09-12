"use client";

import { useTransition } from "react";
import { toggleBusinessActiveAction } from "@/lib/actions/admin";
import type { Business } from "@/types";
import { getBusinessUrl } from "@/lib/slug";

export default function AdminBusinessRow({
  business,
  ownerEmail,
}: {
  business: Business;
  ownerEmail?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-panel p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{business.name}</p>
        <p className="truncate text-xs text-muted">
          {ownerEmail ? `${ownerEmail} · ` : ""}
          {getBusinessUrl(business.slug)}
        </p>
      </div>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            toggleBusinessActiveAction(business.id, !business.is_active)
          )
        }
        className={`shrink-0 rounded-lg px-3 py-2 text-sm ${
          business.is_active
            ? "border border-danger text-danger hover:bg-danger/10"
            : "bg-accent text-white hover:bg-accent-dark"
        } disabled:opacity-50`}
      >
        {business.is_active ? "Pasif Yap" : "Aktif Yap"}
      </button>
    </div>
  );
}
