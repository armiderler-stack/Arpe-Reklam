"use client";

import { useActionState } from "react";
import { createBusinessAction } from "@/lib/actions/business";
import type { ActionResult } from "@/lib/actions/auth";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

export default function NewBusinessForm() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    createBusinessAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          İşletme adı
        </label>
        <input
          name="name"
          required
          placeholder="Örn: ABC Restaurant"
          className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Logo <span className="text-muted font-normal">(opsiyonel)</span>
        </label>
        <input
          name="logo"
          type="file"
          accept="image/*"
          className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-paper file:px-3 file:py-1.5 file:text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Kısa açıklama <span className="text-muted font-normal">(opsiyonel)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Örn: Şehrin en iyi lezzetleri"
          className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <FormError message={state.error} />

      <Button type="submit" fullWidth>
        İşletmeyi Oluştur
      </Button>
    </form>
  );
}
