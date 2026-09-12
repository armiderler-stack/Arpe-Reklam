"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addLinkAction } from "@/lib/actions/links";
import type { ActionResult } from "@/lib/actions/auth";
import { LINK_TYPES, getLinkTypeConfig } from "@/types";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

export default function AddLinkForm({ businessId }: { businessId: string }) {
  const action = addLinkAction.bind(null, businessId);
  const [state, formAction] = useActionState<ActionResult, FormData>(
    action,
    {}
  );
  const [type, setType] = useState("whatsapp");
  const [resetKey, setResetKey] = useState(0);
  const isFirstRender = useRef(true);
  const config = getLinkTypeConfig(type);

  // Başarılı bir ekleme sonrası formu temizle (uncontrolled inputları
  // remount ederek sıfırlıyoruz), böylece kullanıcı elle silmek zorunda kalmaz.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      setResetKey((k) => k + 1);
      setType("whatsapp");
    }
  }, [state]);

  return (
    <form
      action={formAction}
      key={resetKey}
      className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-4"
    >
      <p className="text-sm font-medium text-ink">Yeni bağlantı ekle</p>
      <select
        name="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
      >
        {LINK_TYPES.map((t) => (
          <option key={t.type} value={t.type}>
            {t.icon} {t.label}
          </option>
        ))}
      </select>
      {type === "custom" && (
        <input
          name="label"
          placeholder="Başlık (örn: Randevu Al)"
          className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
        />
      )}
      <input
        name="value"
        required
        placeholder={config.placeholder}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
      />
      <FormError message={state.error} />
      <Button type="submit">Ekle</Button>
    </form>
  );
}
