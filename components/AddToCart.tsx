"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { waLink } from "@/lib/site";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const doAdd = () => {
    if (product.price <= 0) return;
    add(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        priceFrom: product.priceFrom,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  };

  const waMsg = `Bonjour BTL LIVING, je suis intéressé(e) par « ${product.name} »${
    qty > 1 ? ` (×${qty})` : ""
  }. Réf. ${product.slug}. Pouvez-vous me renseigner ?`;

  if (product.price <= 0) return <p className="mt-8 text-sm text-espresso/60">Fiche en préparation · Prix et informations à compléter.</p>;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* qty stepper */}
        <div className="flex items-center border border-espresso/20">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuer la quantité"
            className="h-12 w-12 text-lg text-espresso/60 transition-colors hover:text-espresso"
          >
            −
          </button>
          <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="Augmenter la quantité"
            className="h-12 w-12 text-lg text-espresso/60 transition-colors hover:text-espresso"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={doAdd}
          className="group relative min-w-[220px] overflow-hidden bg-espresso px-9 py-4 text-[0.68rem] font-light uppercase tracking-wide2 text-porcelain transition-colors duration-700 ease-luxe hover:text-espresso"
        >
          <span className="relative z-10">
            {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
          </span>
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-oak transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-[0.66rem] font-light uppercase tracking-wide2 text-cognac transition-colors hover:text-espresso"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.9 12.35l-.35.55.83 3-3.08-.8-.53.3A8.1 8.1 0 1 1 12.04 3.8Zm-3 3.9c-.2 0-.5.07-.77.35-.27.28-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.03.15.2 2.06 3.3 5.13 4.5 2.55 1 3.07.8 3.62.75.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07Z" />
          </svg>
          Commander sur WhatsApp
        </a>
        {added && (
          <Link
            href="/panier"
            className="text-[0.66rem] font-light uppercase tracking-wide2 text-espresso underline decoration-oak underline-offset-4"
          >
            Voir le panier →
          </Link>
        )}
      </div>
    </div>
  );
}
