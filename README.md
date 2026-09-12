# ARON — NFC İşletme Profil Sistemi

Linktree mantığında, işletmeler için NFC destekli tek-link profil sistemi.

## Teknolojiler
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- Vercel (deploy için önerilir)

---

## 1. Supabase Projesi Kurulumu

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir hesap açın, **New Project** ile yeni proje oluşturun.
2. Proje oluşunca sol menüden **SQL Editor**'ü açın.
3. Bu depodaki `supabase/migrations/0001_init.sql` dosyasının tüm içeriğini kopyalayıp SQL Editor'e yapıştırın ve **Run** deyin.
   - Bu işlem: `profiles`, `businesses`, `links`, `menus` tablolarını, güvenlik kurallarını (RLS) ve `menus` / `logos` storage bucket'larını oluşturur.
4. Sol menüden **Project Settings → API** sayfasına gidin. Şu iki değeri not edin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### İlk admin kullanıcısını yapma
1. Siteye normal şekilde kayıt olun (`/register`).
2. Supabase panelinde **Table Editor → profiles** tablosuna gidin.
3. Kendi kaydınızı bulun, `is_admin` sütununu `true` yapın.
4. Artık `/admin` sayfasına erişebilirsiniz.

---

## 2. Yerel Geliştirme Ortamı

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` dosyasını açıp kendi Supabase bilgilerinizi girin:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_SITE_URL=https://go.aron.com.tr
```

> `NEXT_PUBLIC_SITE_URL`, NFC linklerinin önüne eklenen adrestir. Yerelde test ederken `http://localhost:3000` yazabilirsiniz, canlıya alınca gerçek alan adınızla değiştirin.

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

`http://localhost:3000` adresinden siteyi görebilirsiniz.

---

## 3. Vercel'e Deploy

1. Bu proje klasörünü bir GitHub reposuna yükleyin.
2. [vercel.com](https://vercel.com) üzerinden **New Project** ile bu repoyu içe aktarın.
3. **Environment Variables** kısmına şu 3 değeri girin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (örn: `https://go.aron.com.tr`)
4. **Deploy** butonuna basın.
5. Vercel size bir adres verecek (örn. `aron.vercel.app`). İsterseniz kendi alan adınızı (`go.aron.com.tr`) Vercel'in **Domains** ayarından bağlayabilirsiniz.

> Alan adınızı bağladıktan sonra Vercel ortam değişkenlerinde `NEXT_PUBLIC_SITE_URL` değerini gerçek alan adınızla güncellemeyi unutmayın, aksi halde "NFC Linkini Kopyala" butonu yanlış adres üretir.

---

## 4. Sistemin Çalışma Mantığı (Özet)

- Bir kullanıcı işletme oluşturduğunda sistem otomatik olarak benzersiz bir `slug` üretir (örn. `X82K1`) ve bu sabittir, asla değişmez.
- NFC karta yalnızca `https://SITE_URL/a/X82K1` yazılır (yazma işlemi ARON dışında bir NFC yazma uygulamasıyla yapılır — ör. "NFC Tools").
- `/a/[slug]` sayfası veritabanından o an güncel olan bağlantıları ve menüyü çeker. Kullanıcı panelden bağlantı/menü değiştirdiğinde kart hiç değişmeden yeni içerik gösterilir.
- Her kullanıcı sınırsız işletme oluşturabilir — toplu NFC kart satan bayiler için uygundur.
- Row Level Security (RLS) sayesinde bir kullanıcı yalnızca kendi işletmelerini görüp düzenleyebilir; admin ise hepsini görebilir.

---

## 5. Klasör Yapısı

```
src/
  app/
    page.tsx                  → Tanıtım sayfası
    login/, register/         → Giriş / kayıt
    dashboard/                → İşletmelerim (liste)
    dashboard/new/             → Yeni işletme oluştur
    dashboard/[id]/edit/       → İşletme bilgilerini düzenle
    dashboard/[id]/links/      → Bağlantı yönetimi (ekle/düzenle/sil/gizle/sırala)
    dashboard/[id]/menu/       → Menü linki veya PDF yükleme
    a/[slug]/                  → NFC'nin açtığı genel (public) işletme sayfası
    admin/                     → Basit admin paneli
  lib/
    supabase/                  → Supabase client (browser + server)
    actions/                   → Sunucu tarafı işlemler (auth, business, links, menu, admin)
    slug.ts                    → Benzersiz slug ve NFC URL üretici
  components/                  → Paylaşılan arayüz bileşenleri
  types/                       → Ortak TypeScript tipleri (bağlantı türleri dahil)
supabase/migrations/0001_init.sql → Veritabanı şeması + RLS + storage
```

---

## 6. Bilinen Sınırlamalar (Bilerek Yapılmadı)

Bu ilk sürümde şunlar **bilerek eklenmedi** (istek üzerine):
- Ödeme / abonelik sistemi
- Gelişmiş istatistik / analytics
- Yapay zeka özellikleri
- Karmaşık tema sistemi

Bunlar temel ürün oturduktan sonra ayrı adımlarla eklenebilir.
