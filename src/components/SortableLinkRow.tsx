"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { BusinessLink } from "@/types";
import { getLinkTypeConfig, LINK_TYPES } from "@/types";
import {
  deleteLinkAction,
  toggleLinkVisibilityAction,
  updateLinkAction,
} from "@/lib/actions/links";

export default function SortableLinkRow({ link }: { link: BusinessLink }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const config = getLinkTypeConfig(link.type);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleSave(formData: FormData) {
    setPending(true);
    await updateLinkAction(link.id, link.business_id, {}, formData);
    setPending(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Bu bağlantıyı silmek istiyor musunuz?")) return;
    await deleteLinkAction(link.id, link.business_id);
  }

  async function handleToggle() {
    await toggleLinkVisibilityAction(link.id, link.business_id, !link.is_visible);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-line bg-panel p-3"
    >
      {!editing ? (
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-muted active:cursor-grabbing"
            aria-label="Sürükle"
          >
            ⠿
          </button>
          <span className="text-lg">{config.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {link.label || config.label}
            </p>
            <p className="truncate text-xs text-muted">{link.url}</p>
          </div>
          <button
            onClick={handleToggle}
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
              link.is_visible
                ? "bg-accent/10 text-accent"
                : "bg-black/5 text-muted"
            }`}
          >
            {link.is_visible ? "Görünür" : "Gizli"}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs text-muted hover:text-ink"
          >
            Düzenle
          </button>
          <button
            onClick={handleDelete}
            className="shrink-0 text-xs text-danger hover:underline"
          >
            Sil
          </button>
        </div>
      ) : (
        <form action={handleSave} className="flex flex-col gap-2">
          <select
            name="type"
            defaultValue={link.type}
            className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
          >
            {LINK_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
          <input
            name="label"
            defaultValue={link.label ?? ""}
            placeholder="Özel başlık (opsiyonel)"
            className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
          />
          <input
            name="value"
            defaultValue={link.url}
            required
            placeholder={config.placeholder}
            className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-accent px-3 py-1.5 text-xs text-white disabled:opacity-50"
            >
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-ink"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
