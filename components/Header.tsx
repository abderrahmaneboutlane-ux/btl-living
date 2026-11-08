"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartButton from "./CartButton";
import { CATEGORIES } from "@/lib/products";
import { waLink } from "@/lib/site";

const NAV = [
  { label: "Boutique", href: "/collections" },
  ...CATEGORIES.slice(0, 4).map((c) => ({
    label: c.label,
    href: `/collections/${c.key}`,
  })),
  { label: "Contact", href: "/#contact" },
];

const RDV = waLink(
  "Bonjour BTL LIVING, je souhaite prendre rendez-vous au showroom.",
);

/* ── Wordmark: corner-anchored horizontal lockup, BTL | LIVING ── */
function Wordmark({ solid }: { solid: boolean }) {
  return (
    <Link href="/" aria-label="BTL LIVING — accueil" className="group flex items-end gap-3">
      <span
        className={`font-display text-[1.5rem] leading-none tracking-[0.02em] transition-colors duration-500 ${
          solid ? "text-espresso" : "text-porcelain"
        }`}
      >
        BTL
      </span>
      <span
        className={`mb-[3px] h-[15px] w-px transition-colors duration-500 ${
          solid ? "bg-espresso/25" : "bg-porcelain/35"
        }`}
      />
      <span
        className={`mb-[2px] text-[0.55rem] font-light uppercase leading-none tracking-[0.42em] transition-colors duration-500 ${
          solid ? "text-cognac" : "text-oak"
        }`}
      >
        Living
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = !onHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-luxe ${
          solid
            ? "border-b border-espresso/10 bg-porcelain/92 py-3.5 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-6"
        }`}
      >
        {/* edge-to-edge, not centered — logo hugs the corner */}
        <div className="flex items-center justify-between px-6 sm:px-9 lg:px-12">
          <Wordmark solid={solid} />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`group relative text-[0.62rem] font-light uppercase tracking-[0.2em] transition-colors duration-400 ${
                  solid
                    ? "text-espresso/60 hover:text-espresso"
                    : "text-porcelain/70 hover:text-porcelain"
                }`}
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-cognac transition-all duration-500 ease-luxe group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <a
              href={RDV}
              target="_blank"
              rel="noopener"
              className={`hidden text-[0.6rem] font-light uppercase tracking-[0.2em] transition-colors duration-400 md:inline-block ${
                solid ? "text-espresso/55 hover:text-cognac" : "text-porcelain/65 hover:text-oak"
              }`}
            >
              Rendez-vous
            </a>
            <span
              className={`hidden h-4 w-px md:block ${
                solid ? "bg-espresso/15" : "bg-porcelain/25"
              }`}
            />
            <CartButton dark={!solid} />
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className={`lg:hidden ${solid ? "text-espresso" : "text-porcelain"}`}
            >
              <span className="block h-px w-7 bg-current" />
              <span className="mt-2 block h-px w-7 bg-current" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-espresso px-[8vw] py-20 transition-[transform,opacity,visibility] duration-700 ease-luxe lg:hidden ${
          open
            ? "translate-y-0 opacity-100 visible"
            : "invisible -translate-y-full opacity-0"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="absolute right-[8vw] top-9 text-porcelain"
        >
          <span className="block h-px w-7 rotate-45 bg-current" />
          <span className="-mt-px block h-px w-7 -rotate-45 bg-current" />
        </button>
        <div className="my-auto w-full">
          <span className="mb-7 block text-[0.55rem] font-light uppercase tracking-luxe text-oak">
            BTL Living · Casablanca
          </span>
          {[
            { label: "Accueil", href: "/" },
            { label: "Boutique", href: "/collections" },
            ...CATEGORIES.map((c) => ({
              label: c.label,
              href: `/collections/${c.key}`,
            })),
            { label: "Panier", href: "/panier" },
            { label: "Contact", href: "/#contact" },
          ].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-porcelain/12 py-3.5 font-display text-[1.6rem] text-porcelain transition-colors hover:text-oak"
            >
              <span className="mr-5 align-middle text-[0.6rem] font-light tracking-wide2 text-cognac">
                {String(i + 1).padStart(2, "0")}
              </span>
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}