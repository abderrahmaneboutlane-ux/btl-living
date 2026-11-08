export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.btl-living.com";

export const WHATSAPP = "212708029551"; // international, no "+"
export const PHONE_DISPLAY = "+212 708 029 551";
export const EMAIL = "contact@btl-living.com";
export const ADDRESS = "Souk Kriaa, Casablanca";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/** 12900 -> "12 900 MAD" (space thousands, locale-independent) */
export function formatMAD(n: number): string {
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} MAD`;
}