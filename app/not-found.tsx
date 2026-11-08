import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center bg-porcelain px-6 text-center">
      <span className="eyebrow rule text-cognac">Erreur 404</span>
      <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.02em]">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-5 max-w-[42ch] text-[0.9rem] font-light leading-relaxed text-espresso/55">
        Le lien est peut-être ancien. Retrouvez toutes nos pièces dans la
        boutique.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="border border-espresso px-8 py-4 text-[0.66rem] font-light uppercase tracking-wide2 transition-colors hover:border-cognac hover:text-cognac"
        >
          Accueil
        </Link>
        <Link
          href="/collections"
          className="border border-espresso/25 px-8 py-4 text-[0.66rem] font-light uppercase tracking-wide2 transition-colors hover:border-cognac hover:text-cognac"
        >
          La boutique
        </Link>
      </div>
    </div>
  );
}