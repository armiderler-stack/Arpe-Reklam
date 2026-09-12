import Link from "next/link";

const FEATURES = [
  {
    title: "Tek dokunuş",
    text: "Müşteri kartı telefonuna yaklaştırır, işletmenin sayfası anında açılır.",
  },
  {
    title: "Sınırsız işletme",
    text: "Kart satan bayiler, her müşterisi için ayrı ve sabit bir sayfa oluşturur.",
  },
  {
    title: "Kart hiç değişmez",
    text: "Bağlantılarınızı istediğiniz an güncelleyin, kartı yeniden yazmanıza gerek kalmaz.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <span className="font-display text-xl font-semibold">ARON</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-muted hover:text-ink">
            Giriş yap
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-accent px-4 py-2 font-medium text-white hover:bg-accent-dark"
          >
            Ücretsiz Başla
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:py-24 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Tek NFC kart,
            <br />
            sınırsız bağlantı.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            İşletmenizin WhatsApp&apos;ından menüsüne, Instagram&apos;ından Google
            haritasına kadar her şeyi tek bir mobil sayfada toplayın. Karta tek
            bir sabit link yazılır — geri kalanı panelden yönetilir.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-accent px-5 py-3 font-medium text-white hover:bg-accent-dark"
            >
              Hemen Dene
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-line px-5 py-3 font-medium text-ink hover:border-ink"
            >
              Giriş yap
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[280px]">
          <div className="rounded-[2rem] border border-line bg-panel p-4 shadow-sm">
            <div className="rounded-2xl bg-paper p-6 text-center">
              <div className="mx-auto mb-3 h-14 w-14 rounded-xl bg-accent/10" />
              <p className="font-display font-semibold">ABC RESTAURANT</p>
              <p className="mt-1 text-xs text-muted">Şehrin en iyi lezzetleri</p>
              <div className="mt-5 flex flex-col gap-2">
                {["WhatsApp", "Google Haritalar", "Instagram", "Menüyü Gör"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-lg border border-line bg-panel px-3 py-2 text-xs font-medium"
                    >
                      {label}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-5 py-10 text-center text-sm text-muted">
        © {new Date().getFullYear()} ARON
      </footer>
    </div>
  );
}
