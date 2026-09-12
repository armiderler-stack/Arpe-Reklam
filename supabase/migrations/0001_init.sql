-- ARON veritabanı şeması
-- ==========================================

-- Profiller (auth.users tablosuna ek bilgiler için)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Yeni kullanıcı kayıt olunca otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- İşletmeler
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  slug text not null unique, -- örn: X82K1, sabit ve değişmez
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_businesses_user_id on public.businesses(user_id);
create index if not exists idx_businesses_slug on public.businesses(slug);

-- Bağlantılar
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null, -- whatsapp, instagram, google_maps, google_review, sahibinden, website, tiktok, youtube, facebook, phone, email, custom
  label text, -- özel bağlantı için kullanıcı başlığı
  url text not null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_links_business_id on public.links(business_id);

-- Menü (link veya PDF)
create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  menu_type text not null check (menu_type in ('link','pdf')),
  menu_url text,
  pdf_file_path text,
  updated_at timestamptz not null default now()
);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.links enable row level security;
alter table public.menus enable row level security;

-- Yardımcı fonksiyon: giriş yapan kullanıcı admin mi?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$ language sql stable security definer;

-- PROFILES politikaları
create policy "Kullanıcı kendi profilini görebilir"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Admin profilleri güncelleyebilir"
  on public.profiles for update
  using (public.is_admin());

-- BUSINESSES politikaları
create policy "Herkes aktif işletmeyi slug ile görebilir (public sayfa için)"
  on public.businesses for select
  using (is_active = true or user_id = auth.uid() or public.is_admin());

create policy "Kullanıcı kendi işletmesini oluşturabilir"
  on public.businesses for insert
  with check (user_id = auth.uid());

create policy "Kullanıcı kendi işletmesini güncelleyebilir"
  on public.businesses for update
  using (user_id = auth.uid() or public.is_admin());

create policy "Kullanıcı kendi işletmesini silebilir"
  on public.businesses for delete
  using (user_id = auth.uid() or public.is_admin());

-- LINKS politikaları
create policy "Herkes aktif işletmenin görünür linklerini görebilir"
  on public.links for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = links.business_id
      and (b.is_active = true or b.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Sahip kendi işletmesinin linklerini yönetebilir (insert)"
  on public.links for insert
  with check (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

create policy "Sahip kendi işletmesinin linklerini yönetebilir (update)"
  on public.links for update
  using (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

create policy "Sahip kendi işletmesinin linklerini yönetebilir (delete)"
  on public.links for delete
  using (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

-- MENUS politikaları
create policy "Herkes aktif işletmenin menüsünü görebilir"
  on public.menus for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = menus.business_id
      and (b.is_active = true or b.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "Sahip kendi menüsünü yönetebilir (insert)"
  on public.menus for insert
  with check (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

create policy "Sahip kendi menüsünü yönetebilir (update)"
  on public.menus for update
  using (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

create policy "Sahip kendi menüsünü yönetebilir (delete)"
  on public.menus for delete
  using (
    exists (select 1 from public.businesses b where b.id = business_id and b.user_id = auth.uid())
  );

-- ==========================================
-- STORAGE (PDF menüler ve logolar için)
-- ==========================================
insert into storage.buckets (id, name, public)
values ('menus', 'menus', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "Herkes menu PDF dosyalarını okuyabilir"
  on storage.objects for select
  using (bucket_id = 'menus');

create policy "Giriş yapan kullanıcı PDF yükleyebilir"
  on storage.objects for insert
  with check (bucket_id = 'menus' and auth.role() = 'authenticated');

create policy "Giriş yapan kullanıcı kendi PDF sini güncelleyebilir"
  on storage.objects for update
  using (bucket_id = 'menus' and auth.role() = 'authenticated');

create policy "Giriş yapan kullanıcı kendi PDF sini silebilir"
  on storage.objects for delete
  using (bucket_id = 'menus' and auth.role() = 'authenticated');

create policy "Herkes logoları okuyabilir"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "Giriş yapan kullanıcı logo yükleyebilir"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.role() = 'authenticated');

create policy "Giriş yapan kullanıcı logo güncelleyebilir"
  on storage.objects for update
  using (bucket_id = 'logos' and auth.role() = 'authenticated');
