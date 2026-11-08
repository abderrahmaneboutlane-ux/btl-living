"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartButton({ dark = false }: { dark?: boolean }) {
  const { count } = useCart();
  return (
    <Link
      href="/panier"
      aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
      className={`relative inline-flex items-center gap-2 text-[0.62rem] font-light uppercase tracking-wide2 transition-colors duration-500 ${
        dark ? "text-porcelain/80 hover:text-oak" : "text-espresso/70 hover:text-espresso"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="M6 7h12l-1.2 12.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 7Z" />
        <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
      </svg>
      <span className="hidden sm:inline">Panier</span>
      {count > 0 && (
        <span
          className={`absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.55rem] font-medium tabular-nums ${
            dark ? "bg-oak text-espresso" : "bg-cognac text-porcelain"
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}