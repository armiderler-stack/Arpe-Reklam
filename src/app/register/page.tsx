"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionResult } from "@/lib/actions/auth";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

export default function RegisterPage() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    registerAction,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          ARON
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Kayıt ol</h1>
        <p className="mt-1 text-sm text-muted">
          Sınırsız işletme sayfası oluşturmaya hemen başlayın.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="E-posta"
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Şifre (en az 6 karakter)"
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <FormError message={state.error} />
          <Button type="submit" fullWidth>
            Kayıt ol
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
