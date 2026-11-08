"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatMAD } from "@/lib/site";
import { hasEstimate, lineTotal } from "@/lib/cart";
import { productImage } from "@/lib/products";

export default function CartView() {
  const { lines, setQty, remove, subtotal, clear } = useCart();

  if (lines.length === 0) {
    return (
      <div className="border border-espresso/12 px-8 py-20 text-center">
        <p className="font-display text-2xl">Votre panier est vide</p>
        <p className="mx-auto mt-3 max-w-[36ch] text-[0.85rem] font-light text-espresso/50">
          Parcourez les univers et ajoutez les pièces qui composeront votre
          intérieur.
        </p>
        <Link
          href="/collections"
          className="mt-8 inline-block border border-espresso px-8 py-4 text-[0.66rem] font-light uppercase tracking-wide2 text-espresso transition-colors duration-500 hover:border-cognac hover:text-cognac"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  const estimate = hasEstimate(lines);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
      {/* lines */}
      <div>
        <ul className="border-t border-espresso/12">
          {lines.map((l) => (
            <li
              key={l.slug}
              className="flex gap-5 border-b border-espresso/12 py-6"
            >
              <Link
                href={`/produit/${l.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden bg-plaster"
              >
                <Image
                  src={productImage(l.slug)}
                  alt={l.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/produit/${l.slug}`}
                      className="font-display text-[1.15rem] transition-colors hover:text-cognac"
                    >
                      {l.name}
                    </Link>
                    <p className="mt-0.5 text-[0.7rem] font-light uppercase tracking-wide2 text-espresso/40">
                      {l.priceFrom ? "dès " : ""}
                      {formatMAD(l.price)} / pièce
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.slug)}
                    aria-label={`Retirer ${l.name}`}
                    className="text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/35 transition-colors hover:text-cognac"
                  >
                    Retirer
                  </button>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center border border-espresso/20">
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.qty - 1)}
                      aria-label="Diminuer"
                      className="h-9 w-9 text-espresso/60 transition-colors hover:text-espresso"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(l.slug, l.qty + 1)}
                      aria-label="Augmenter"
                      className="h-9 w-9 text-espresso/60 transition-colors hover:text-espresso"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[0.95rem] font-light tabular-nums">
                    {formatMAD(lineTotal(l))}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clear}
          className="mt-5 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/35 transition-colors hover:text-cognac"
        >
          Vider le panier
        </button>
      </div>

      {/* summary */}
      <aside className="h-fit border border-espresso/12 bg-plaster/50 p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-xl">Récapitulatif</h2>
        <div className="mt-5 flex items-baseline justify-between border-b border-espresso/12 pb-4">
          <span className="text-[0.7rem] font-light uppercase tracking-wide2 text-espresso/45">
            {estimate ? "Sous-total indicatif" : "Sous-total"}
          </span>
          <span className="text-[1.15rem] font-light tabular-nums">
            {formatMAD(subtotal)}
          </span>
        </div>
        <p className="mt-4 text-[0.72rem] font-light leading-relaxed text-espresso/50">
          Livraison et montage inclus au Maroc. Paiement à la livraison ou par
          virement. {estimate && "Les pièces sur mesure sont confirmées par devis."}
        </p>

        <Link
          href="/commande"
          className="group relative mt-6 block overflow-hidden bg-espresso px-8 py-4 text-center text-[0.68rem] font-light uppercase tracking-wide2 text-porcelain transition-colors duration-700 ease-luxe hover:text-espresso"
        >
          <span className="relative z-10">Passer la commande</span>
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-oak transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
        </Link>
        <Link
          href="/collections"
          className="mt-3 block text-center text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/50 transition-colors hover:text-espresso"
        >
          Continuer mes achats
        </Link>
      </aside>
    </div>
  );
}