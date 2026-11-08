import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // re-pull the catalogue hourly

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.key }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = await getCategory(params.category);
  if (!cat) return {};
  const title = `${cat.label} — Mobilier BTL LIVING`;
  return {
    title,
    description: `${cat.label} BTL LIVING : ${cat.blurb} Livraison partout au Maroc, paiement en MAD.`,
    alternates: { canonical: `/collections/${cat.key}` },
    openGraph: {
      title,
      description: cat.blurb,
      url: `${SITE_URL}/collections/${cat.key}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [cat, categories] = await Promise.all([
    getCategory(params.category),
    getCategories(),
  ]);
  if (!cat) notFound();
  const products = await getProductsByCategory(cat.key);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.label} — BTL LIVING`,
    numberOfItems: products.length,
    itemListElement: products.map((pr, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/produit/${pr.slug}`,
      name: pr.name,
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Boutique", item: `${SITE_URL}/collections` },
      { "@type": "ListItem", position: 3, name: cat.label, item: `${SITE_URL}/collections/${cat.key}` },
    ],
  };

  return (
    <div className="bg-porcelain pb-[clamp(5rem,11vw,9rem)] pt-[clamp(7rem,14vw,11rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-8 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/40"
        >
          <Link href="/" className="transition-colors hover:text-espresso">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="transition-colors hover:text-espresso">
            Boutique
          </Link>
          <span className="mx-2">/</span>
          <span className="text-espresso/70">{cat.label}</span>
        </nav>

        <header className="max-w-[52ch]">
          <span className="eyebrow rule block text-cognac">Boutique</span>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-normal leading-[0.95] tracking-[-0.02em]">
            {cat.label}
          </h1>
          <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-espresso/60">
            {cat.blurb}
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-espresso/10 py-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/collections/${c.key}`}
              className={`text-[0.66rem] font-light uppercase tracking-wide2 transition-colors ${
                c.key === cat.key
                  ? "text-cognac"
                  : "text-espresso/45 hover:text-espresso"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-[0.9rem] font-light text-espresso/50">
            Cette collection arrive bientôt.
          </p>
        ) : (
          <Reveal
            className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            y={30}
            stagger={0.07}
          >
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 3} />
            ))}
          </Reveal>
        )}

        <p className="mt-16 max-w-[46ch] text-[0.8rem] font-light leading-relaxed text-espresso/45">
          Prix indicatifs en dirham, hors offres en cours. Livraison et montage
          inclus au Maroc. Toutes les pièces sont réalisées sur commande —
          comptez le délai indiqué sur chaque fiche.
        </p>
      </div>
    </div>
  );
}