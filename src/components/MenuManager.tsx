"use client";

import { useActionState, useState } from "react";
import {
  saveMenuLinkAction,
  uploadMenuPdfAction,
  deleteMenuAction,
} from "@/lib/actions/menu";
import type { ActionResult } from "@/lib/actions/auth";
import type { Menu } from "@/types";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useRouter } from "next/navigation";

export default function MenuManager({
  businessId,
  menu,
  pdfUrl,
}: {
  businessId: string;
  menu: Menu | null;
  pdfUrl: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"link" | "pdf">(menu?.menu_type ?? "link");

  const linkAction = saveMenuLinkAction.bind(null, businessId);
  const [linkState, linkFormAction] = useActionState<ActionResult, FormData>(
    linkAction,
    {}
  );

  const pdfAction = uploadMenuPdfAction.bind(null, businessId);
  const [pdfState, pdfFormAction] = useActionState<ActionResult, FormData>(
    pdfAction,
    {}
  );

  async function handleRemove() {
    if (!confirm("Menüyü kaldırmak istiyor musunuz?")) return;
    await deleteMenuAction(businessId);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("link")}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium ${
            mode === "link"
              ? "border-accent bg-accent/10 text-accent"
              : "border-line text-ink"
          }`}
        >
          Menü Linki
        </button>
        <button
          onClick={() => setMode("pdf")}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium ${
            mode === "pdf"
              ? "border-accent bg-accent/10 text-accent"
              : "border-line text-ink"
          }`}
        >
          PDF Menü
        </button>
      </div>

      {mode === "link" ? (
        <form
          action={linkFormAction}
          className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-4"
        >
          <label className="text-sm font-medium text-ink">Menü linki</label>
          <input
            name="menu_url"
            required
            defaultValue={menu?.menu_type === "link" ? menu.menu_url ?? "" : ""}
            placeholder="https://ornek.com/menu"
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
          <FormError message={linkState.error} />
          <Button type="submit">Kaydet</Button>
        </form>
      ) : (
        <form
          action={pdfFormAction}
          className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-4"
        >
          <label className="text-sm font-medium text-ink">PDF dosyası</label>
          {menu?.menu_type === "pdf" && pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Mevcut PDF&apos;i görüntüle ↗
            </a>
          )}
          <input
            name="pdf"
            type="file"
            accept="application/pdf"
            required
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-paper file:px-3 file:py-1.5"
          />
          <FormError message={pdfState.error} />
          <Button type="submit">
            {menu?.menu_type === "pdf" ? "Yeni PDF Yükle" : "PDF Yükle"}
          </Button>
        </form>
      )}

      {menu && (
        <button
          onClick={handleRemove}
          className="self-start text-sm text-danger hover:underline"
        >
          Menüyü kaldır
        </button>
      )}
    </div>
  );
}
