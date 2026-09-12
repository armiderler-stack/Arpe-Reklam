import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Business, BusinessLink, Menu } from "@/types";
import PublicLinkButton from "@/components/PublicLinkButton";
import type { Metadata } from "next";

export const revalidate = 0;

async function getData(slug: string) {
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!business) return null;

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("business_id", business.id)
    .maybeSingle();

  let menuUrl: string | null = null;
  if (menu) {
    if (menu.menu_type === "link") {
      menuUrl = menu.menu_url;
    } else if (menu.pdf_file_path) {
      const { data } = supabase.storage.from("menus").getPublicUrl(menu.pdf_file_path);
      menuUrl = data.publicUrl;
    }
  }

  return {
    business: business as Business,
    links: (links ?? []) as BusinessLink[],
    menu: menu as Menu | null,
    menuUrl,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) return { title: "ARPE REKLAM" };
  return {
    title: data.business.name,
    description: data.business.description ?? undefined,
  };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getData(slug);
  if (!data) notFound();

  const { business, links, menuUrl } = data;

  return (
    <div className="flex min-h-screen flex-col items-center bg-paper px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
            {business.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.logo_url}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-3xl text-muted">
                {business.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {business.name}
          </h1>
          {business.description && (
            <p className="mt-2 text-sm text-muted">{business.description}</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {links.map((link) => (
            <PublicLinkButton key={link.id} link={link} />
          ))}

          {menuUrl && (
            <a
              href={menuUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-medium text-white shadow-sm transition-transform active:scale-[0.98]"
            >
              📋 Menüyü Gör
            </a>
          )}

          {links.length === 0 && !menuUrl && (
            <p className="text-center text-sm text-muted">
              Bu işletme henüz bağlantı eklemedi.
            </p>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-muted">Powered by ARPE REKLAM</p>
      </div>
    </div>
  );
}
