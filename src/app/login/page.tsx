"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionResult } from "@/lib/actions/auth";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

function DeactivatedNotice() {
  const searchParams = useSearchParams();
  const isDeactivated = searchParams.get("deactivated") === "1";
  if (!isDeactivated) return null;
  return (
    <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
      Hesabınız yönetici tarafından pasif hale getirildi.
    </p>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          ARPE REKLAM
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Giriş yap</h1>
        <p className="mt-1 text-sm text-muted">
          İşletmelerinizi yönetmek için hesabınıza girin.
        </p>

        <Suspense fallback={null}>
          <DeactivatedNotice />
        </Suspense>

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
            placeholder="Şifre"
            className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-accent hover:underline">
              Şifremi unuttum
            </Link>
          </div>
          <FormError message={state.error} />
          <Button type="submit" fullWidth>
            Giriş yap
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  );
}
