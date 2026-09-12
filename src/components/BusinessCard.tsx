"use client";

import { useState } from "react";
import Link from "next/link";
import type { Business } from "@/types";
import { getBusinessUrl } from "@/lib/slug";

export default function BusinessCard({ business }: { business: Business }) {
  const [copied, setCopied] = useState(false);
  const url = getBusinessUrl(business.slug);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard erişimi yoksa sessizce geç
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-paper border border-line">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={business.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-lg text-muted">
              {business.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-ink">{business.name}</p>
          <p className="text-xs text-muted">
            {!business.is_active && (
              <span className="mr-2 rounded bg-danger/10 px-1.5 py-0.5 text-danger">
                Pasif
              </span>
            )}
            go.aron.com.tr/a/{business.slug}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/dashboard/${business.id}/edit`}
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink hover:border-ink"
        >
          Düzenle
        </Link>
        <Link
          href={`/dashboard/${business.id}/links`}
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink hover:border-ink"
        >
          Bağlantılar
        </Link>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-line px-3 py-2 text-sm text-ink hover:border-ink"
        >
          Sayfayı Gör
        </a>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-accent px-3 py-2 text-sm text-white hover:bg-accent-dark"
        >
          {copied ? "Kopyalandı ✓" : "NFC Linkini Kopyala"}
        </button>
      </div>
    </div>
  );
}
