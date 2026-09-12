"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import FormError from "@/components/FormError";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Kullanıcı e-postadaki linke tıkladığında Supabase, tarayıcıda otomatik
    // olarak geçici bir "kurtarma" oturumu açar. Bunun tamamlanmasını bekliyoruz.
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setReady(true);
      }
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Şifre güncellenemedi: " + updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          ARPE REKLAM
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Yeni Şifre Belirle</h1>

        {!ready ? (
          <p className="mt-6 text-sm text-muted">Kontrol ediliyor…</p>
        ) : !hasSession ? (
          <div className="mt-6 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
            Bu link geçersiz veya süresi dolmuş. Lütfen{" "}
            <Link href="/forgot-password" className="underline">
              yeni bir sıfırlama linki
            </Link>{" "}
            iste.
          </div>
        ) : done ? (
          <p className="mt-6 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
            Şifren güncellendi. Panele yönlendiriliyorsun…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              required
              placeholder="Yeni şifre (en az 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <input
              type="password"
              required
              placeholder="Yeni şifre (tekrar)"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-lg border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <FormError message={error} />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
            >
              {loading ? "Kaydediliyor…" : "Şifreyi Güncelle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
