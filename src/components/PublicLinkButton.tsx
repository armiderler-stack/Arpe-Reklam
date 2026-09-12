import { getLinkTypeConfig } from "@/types";
import type { BusinessLink } from "@/types";

export default function PublicLinkButton({ link }: { link: BusinessLink }) {
  const config = getLinkTypeConfig(link.type);
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
