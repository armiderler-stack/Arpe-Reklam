"use client";

import { useActionState } from "react";
import { updateBusinessAction, deleteBusinessAction } from "@/lib/actions/business";
import type { ActionResult } from "@/lib/actions/auth";
import type { Business } from "@/types";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useRouter } from "next/navigation";

export default function EditBusinessForm({ business }: { business: Business }) {
  const router = useRouter();
  const action = updateBusinessAction.bind(null, business.id);
  const [state, formAction] = useActionState<ActionResult, FormData>(
    action,
    {}
  );

  async function handleDelete() {
    if (!confirm(`"${business.name}" işletmesini kalıcı olarak silmek istediğinize emin misiniz? Bu NFC kartını çalışmaz hale getirir.`)) {
      return;
    }
    await deleteBusinessAction(business.id);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            İşletme adı
          </label>
          <input
            name="name"
            required
            defaultValue={business.name}
            className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Logo
          </label>
          {business.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={business.name}
              className="mb-2 h-16 w-16 rounded-lg border border-line object-cover"
            />
          )}
          <input
            name="logo"
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-paper file:px-3 file:py-1.5 file:text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Kısa açıklama
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={business.description ?? ""}
            className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <FormError message={state.error} />

        <Button type="submit">Değişiklikleri Kaydet</Button>
      </form>

      <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
        <p className="text-sm font-medium text-ink">Tehlikeli Bölge</p>
        <p className="mt-1 text-sm text-muted">
          İşletmeyi silerseniz, bu işletmeye ait NFC kartı artık hiçbir sayfa açmaz.
        </p>
        <button
          onClick={handleDelete}
          className="mt-3 rounded-lg border border-danger px-3 py-2 text-sm text-danger hover:bg-danger/10"
        >
          İşletmeyi Sil
        </button>
      </div>
    </div>
  );
}
