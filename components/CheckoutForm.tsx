"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { EMAIL, formatMAD, waLink } from "@/lib/site";
import {
  buildOrderMessage,
  hasEstimate,
  lineTotal,
  type CustomerInfo,
} from "@/lib/cart";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Agadir",
  "Fès",
  "Meknès",
  "Kénitra",
  "Oujda",
  "Tétouan",
];

export default function CheckoutForm() {
  const { lines, subtotal, clear } = useCart();
  const [c, setC] = useState<CustomerInfo>({
    nom: "",
    telephone: "",
    ville: "",
    adresse: "",
    note: "",
  });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = useMemo(() => buildOrderMessage(lines, c), [lines, c]);
  const estimate = hasEstimate(lines);

  const valid =
    lines.length > 0 &&
    c.nom.trim().length > 1 &&
    c.telephone.replace(/\D/g, "").length >= 9 &&
    c.ville.trim().length > 1;

  const field =
    "w-full border border-espresso/20 bg-porcelain px-4 py-3 text-[0.9rem] font-light text-espresso outline-none transition-colors focus:border-cognac";
  const label =
    "mb-1.5 block text-[0.58rem] font-light uppercase tracking-wide2 text-espresso/45";

  if (lines.length === 0 && !sent) {
    return (
      <div className="border border-espresso/12 px-8 py-16 text-center">
        <p className="font-display text-xl">Votre panier est vide</p>
        <Link
          href="/collections"
          className="mt-6 inline-block border border-espresso px-8 py-4 text-[0.66rem] font-light uppercase tracking-wide2 transition-colors hover:border-cognac hover:text-cognac"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="border border-espresso/12 bg-plaster/50 px-8 py-14 text-center">
        <p className="font-display text-3xl">Commande envoyée</p>
        <p className="mx-auto mt-4 max-w-[42ch] text-[0.9rem] font-light leading-relaxed text-espresso/60">
          Votre demande s&apos;est ouverte dans WhatsApp. Un conseiller BTL LIVING
          vous confirme la disponibilité, le délai et le mode de règlement.
        </p>
        <p className="mt-3 text-[0.75rem] font-light text-espresso/45">
          Rien ne s&apos;est ouvert&nbsp;?{" "}
          <a
            href={waLink(message)}
            target="_blank"
            rel="noopener"
            className="text-cognac underline underline-offset-4"
          >
            Rouvrir WhatsApp
          </a>{" "}
          ou écrire à{" "}
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(
              "Commande BTL LIVING",
            )}&body=${encodeURIComponent(message)}`}
            className="text-cognac underline underline-offset-4"
          >
            {EMAIL}
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-9 inline-block border border-espresso px-8 py-4 text-[0.66rem] font-light uppercase tracking-wide2 transition-colors hover:border-cognac hover:text-cognac"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    // Open WhatsApp immediately (must be inside the click gesture, not after await).
    window.open(waLink(message), "_blank", "noopener");

    // Persist the order in the background — never block the sale on it.
    void fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: c,
        items: lines.map((l) => ({
          slug: l.slug,
          name: l.name,
          price: l.price,
          qty: l.qty,
          priceFrom: l.priceFrom,
        })),
      }),
    }).catch(() => undefined);

    setSent(true);
    clear();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="order-2 lg:order-1">
        <h2 className="font-display text-2xl">Vos coordonnées</h2>
        <p className="mt-2 text-[0.8rem] font-light text-espresso/50">
          Un seul écran. À la validation, votre commande part sur WhatsApp pour
          confirmation — aucun paiement en ligne.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nom" className={label}>
              Nom complet *
            </label>
            <input
              id="nom"
              required
              value={c.nom}
              onChange={(e) => setC({ ...c, nom: e.target.value })}
              className={field}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="tel" className={label}>
              Téléphone (WhatsApp) *
            </label>
            <input
              id="tel"
              required
              inputMode="tel"
              placeholder="06 12 34 56 78"
              value={c.telephone}
              onChange={(e) => setC({ ...c, telephone: e.target.value })}
              className={field}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="ville" className={label}>
              Ville *
            </label>
            <input
              id="ville"
              required
              list="villes"
              value={c.ville}
              onChange={(e) => setC({ ...c, ville: e.target.value })}
              className={field}
              autoComplete="address-level2"
            />
            <datalist id="villes">
              {MOROCCAN_CITIES.map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="adr" className={label}>
              Adresse de livraison
            </label>
            <input
              id="adr"
              value={c.adresse}
              onChange={(e) => setC({ ...c, adresse: e.target.value })}
              className={field}
              autoComplete="street-address"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="note" className={label}>
              Note (étage, ascenseur, dimensions, préférences…)
            </label>
            <textarea
              id="note"
              rows={3}
              value={c.note}
              onChange={(e) => setC({ ...c, note: e.target.value })}
              className={`${field} resize-none`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!valid}
          className="group relative mt-8 w-full overflow-hidden bg-espresso px-8 py-5 text-[0.7rem] font-light uppercase tracking-wide2 text-porcelain transition-colors duration-700 ease-luxe hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-porcelain"
        >
          <span className="relative z-10 inline-flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.9 12.35l-.35.55.83 3-3.08-.8-.53.3A8.1 8.1 0 1 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.77.35-.27.28-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.3 5.13 4.5 2.55 1 3.07.8 3.62.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
            </svg>
            Valider — envoyer sur WhatsApp
          </span>
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-oak transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
        </button>
        {!valid && (
          <p className="mt-3 text-[0.68rem] font-light text-espresso/40">
            Renseignez au moins votre nom, téléphone et ville.
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(message).then(
              () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2500);
              },
              () => undefined,
            );
          }}
          className="mt-5 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/40 transition-colors hover:text-cognac"
        >
          {copied ? "✓ Commande copiée" : "Copier la commande (texte)"}
        </button>
      </form>

      {/* recap */}
      <aside className="order-1 h-fit border border-espresso/12 bg-plaster/50 p-7 lg:order-2 lg:sticky lg:top-28">
        <h2 className="font-display text-xl">Votre commande</h2>
        <ul className="mt-5 space-y-3 border-b border-espresso/12 pb-4">
          {lines.map((l) => (
            <li
              key={l.slug}
              className="flex justify-between gap-4 text-[0.82rem] font-light"
            >
              <span className="text-espresso/70">
                {l.name} <span className="text-espresso/40">× {l.qty}</span>
              </span>
              <span className="tabular-nums">{formatMAD(lineTotal(l))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[0.7rem] font-light uppercase tracking-wide2 text-espresso/45">
            {estimate ? "Total indicatif" : "Total"}
          </span>
          <span className="text-[1.15rem] font-light tabular-nums">
            {formatMAD(subtotal)}
          </span>
        </div>
        <p className="mt-4 text-[0.7rem] font-light leading-relaxed text-espresso/50">
          Livraison + montage inclus au Maroc · paiement à la livraison ou par
          virement · aucune donnée bancaire demandée.
        </p>
        <Link
          href="/panier"
          className="mt-5 block text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/50 transition-colors hover:text-espresso"
        >
          ← Modifier le panier
        </Link>
      </aside>
    </div>
  );
}