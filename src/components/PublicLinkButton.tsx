"use client";

import { useState } from "react";
import { getLinkTypeConfig } from "@/types";
import type { BusinessLink } from "@/types";

export default function PublicLinkButton({ link }: { link: BusinessLink }) {
  const config = getLinkTypeConfig(link.type);
  const [copied, setCopied] = useState(false);

  // IBAN bir "gidilecek" link değil, kopyalanacak bir numara.
  // Bu yüzden diğer butonlardan farklı davranıyor: tıklanınca kopyalanır.
  if (link.type === "iban") {
    async function handleCopy() {
      try {
        await navigator.clipboard.writeText(link.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // clipboard erişimi yoksa sessizce geç
      }
    }
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3.5 text-left text-ink shadow-sm transition-transform active:scale-[0.98]"
      >
        <span className="text-xl">{config.icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{link.label || config.label}</span>
          <span className="block truncate text-xs text-muted">{link.url}</span>
        </span>
        <span className="shrink-0 text-xs text-accent">
          {copied ? "Kopyalandı ✓" : "Kopyala"}
        </span>
      </button>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3.5 text-ink shadow-sm transition-transform active:scale-[0.98]"
    >
      <span className="text-xl">{config.icon}</span>
      <span className="font-medium">{link.label || config.label}</span>
    </a>
  );
}
