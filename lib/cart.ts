import { formatMAD } from "./site";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  priceFrom?: boolean;
  qty: number;
}

export interface CustomerInfo {
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  note: string;
}

export function lineTotal(l: CartLine): number {
  return l.price * l.qty;
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + lineTotal(l), 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.qty, 0);
}

/** Any "à partir de" line makes the whole total indicative. */
export function hasEstimate(lines: CartLine[]): boolean {
  return lines.some((l) => l.priceFrom);
}

/** Formatted WhatsApp order message. */
export function buildOrderMessage(
  lines: CartLine[],
  c: CustomerInfo,
): string {
  const items = lines
    .map(
      (l) =>
        `• ${l.name} × ${l.qty} — ${formatMAD(lineTotal(l))}${
          l.priceFrom ? " (à partir de)" : ""
        }`,
    )
    .join("\n");

  const total = `${hasEstimate(lines) ? "Total indicatif" : "Total"} : ${formatMAD(
    cartSubtotal(lines),
  )}`;

  const details = [
    c.nom && `Nom : ${c.nom}`,
    c.telephone && `Téléphone : ${c.telephone}`,
    c.ville && `Ville : ${c.ville}`,
    c.adresse && `Adresse : ${c.adresse}`,
    c.note && `Note : ${c.note}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "Bonjour BTL LIVING, je souhaite passer commande :",
    "",
    items,
    "",
    total,
    "",
    details,
  ]
    .filter((s) => s !== undefined)
    .join("\n");
}