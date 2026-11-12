import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getCategories } from "@/lib/catalog";
import { imageFor } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique — Mobilier BTL LIVING",
  description:
    "Toute la collection BTL LIVING : chambre, dressing, salle à manger, coiffeuse et décor. Prix en MAD, livraison et montage partout au Maroc.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Boutique — BTL LIVING",
    description: "Toute la collection : chambre, dressing, salle à manger, décor.",
    url: `${SITE_URL}/collections`,
  },
};

export default async function BoutiquePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts(),
  ]);
  const featured = products.filter((p) => p.badge === "Signature");
  const firstOf = (key: string) =>
    (key === "salle-a-manger"
      ? products.find((p) => p.slug === "wa-20261110-table-rectangulaire-claire" && p.category === key)
      : undefined) ?? products.find((p) => p.category === key);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Boutique BTL LIVING",
    numberOfItems: products.length,
    itemListElement: products.map((pr, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/produit/${pr.slug}`,
      name: pr.name,
    })),
  };

  return (
    <div className="bg-porcelain pb-[clamp(5rem,11vw,9rem)] pt-[clamp(7rem,14vw,11rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <header className="max-w-[52ch]">
          <span className="eyebrow rule block text-cognac">La collection</span>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-normal leading-[0.95] tracking-[-0.02em]">
            La boutique
          </h1>
          <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-espresso/60">
            Chaque pièce est dessinée pour s&apos;assembler avec les autres. Choisissez
            un univers pour commencer.
          </p>
        </header>

        <Reveal
          className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
          y={34}
          stagger={0.08}
        >
          {categories.map((c) => {
            const first = firstOf(c.key);
            const count = products.filter((p) => p.category === c.key).length;
            return (
              <Link
                key={c.key}
                href={`/collections/${c.key}`}
                data-reveal
                className="group relative block h-[clamp(240px,30vw,340px)] overflow-hidden bg-espresso"
              >
                {first && (
                  <Image
                    src={imageFor(first)}
                    alt={c.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-90 transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.07]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="block font-display text-[1.7rem] text-porcelain">
                    {c.label}
                  </span>
                  <span className="mt-1 block text-[0.6rem] font-light uppercase tracking-wide2 text-porcelain/55">
                    {count} pièce{count > 1 ? "s" : ""}
                  </span>
                </span>
              </Link>
            );
          })}
        </Reveal>

        {featured.length > 0 && (
          <section className="mt-24">
            <span className="eyebrow rule block text-cognac">Pièces signature</span>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-normal leading-[0.98] tracking-[-0.02em]">
              Par où commencer
            </h2>
            <Reveal
              className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              y={30}
              stagger={0.08}
            >
              {featured.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 3} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}