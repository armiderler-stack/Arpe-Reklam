export type LinkType =
  | "whatsapp"
  | "instagram"
  | "google_maps"
  | "google_review"
  | "sahibinden"
  | "website"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "phone"
  | "email"
  | "custom";

export interface LinkTypeConfig {
  type: LinkType;
  label: string;
  icon: string; // emoji, basit tutmak için
  placeholder: string;
  urlPrefix?: string; // örn: tel:, mailto:, https://wa.me/
}

export const LINK_TYPES: LinkTypeConfig[] = [
  { type: "whatsapp", label: "WhatsApp", icon: "💬", placeholder: "905XXXXXXXXX", urlPrefix: "https://wa.me/" },
  { type: "instagram", label: "Instagram", icon: "📷", placeholder: "kullanici_adi", urlPrefix: "https://instagram.com/" },
  { type: "google_maps", label: "Google Haritalar", icon: "📍", placeholder: "https://maps.app.goo.gl/..." },
  { type: "google_review", label: "Google Yorum", icon: "⭐", placeholder: "https://g.page/r/..." },
  { type: "sahibinden", label: "Sahibinden", icon: "🏠", placeholder: "https://sahibinden.com/..." },
  { type: "website", label: "Web Sitesi", icon: "🌐", placeholder: "https://ornek.com" },
  { type: "tiktok", label: "TikTok", icon: "🎵", placeholder: "kullanici_adi", urlPrefix: "https://tiktok.com/@" },
  { type: "youtube", label: "YouTube", icon: "▶️", placeholder: "https://youtube.com/@kanal" },
  { type: "facebook", label: "Facebook", icon: "📘", placeholder: "https://facebook.com/sayfa" },
  { type: "phone", label: "Telefon", icon: "📞", placeholder: "905XXXXXXXXX", urlPrefix: "tel:" },
  { type: "email", label: "E-posta", icon: "✉️", placeholder: "ornek@eposta.com", urlPrefix: "mailto:" },
  { type: "custom", label: "Özel Bağlantı", icon: "🔗", placeholder: "https://..." },
];

export function getLinkTypeConfig(type: string): LinkTypeConfig {
  return LINK_TYPES.find((t) => t.type === type) ?? LINK_TYPES[LINK_TYPES.length - 1];
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface BusinessLink {
  id: string;
  business_id: string;
  type: LinkType;
  label: string | null;
  url: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface Menu {
  id: string;
  business_id: string;
  menu_type: "link" | "pdf";
  menu_url: string | null;
  pdf_file_path: string | null;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}
