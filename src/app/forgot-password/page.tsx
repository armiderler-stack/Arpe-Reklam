"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction, type ActionResult } from "@/lib/actions/auth";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    requestPasswordResetAction,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          ARPE REKLAM
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Şifremi Unuttum</h1>
        <p className="mt-1 text-sm text-muted">
          Hesabına kayıtlı e-posta adresini gir, sana şifre sıfırlama linki gönderelim.
        </p>

        {state.success ? (
          <div className="mt-6 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
            E-posta adresine bir sıfırlama linki gönderdik. Gelen kutunu (ve spam
            klasörünü) kontrol et, linke tıklayıp yeni şifreni belirle.
          </div>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <input
              name="email"
              type="email"
              required
              placeholder="E-posta"
              className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <FormError message={state.error} />
            <Button type="submit" fullWidth>
              Sıfırlama Linki Gönder
            </Button>
          </form>
        )}

        <p className="mt-4 text-sm text-muted">
          <Link href="/login" className="text-accent hover:underline">
            ← Girişe dön
          </Link>
        </p>
      </div>
    </div>
  );
}
