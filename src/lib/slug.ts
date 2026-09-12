import { customAlphabet } from "nanoid";

// Karışabilecek karakterleri (0/O, 1/I/l) çıkardık, kart üzerinde/elle
// okurken hata olmasın diye. Büyük harf + rakam.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const generate = customAlphabet(ALPHABET, 5);

export function generateSlug(): string {
  return generate();
}

export function getBusinessUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://go.aron.com.tr";
  return `${base}/a/${slug}`;
}
