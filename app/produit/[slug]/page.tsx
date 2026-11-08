import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import Reveal from "@/components/Reveal";
import {
  getAllProducts,
  getCategory,
  getProductBySlug,
  getRelated,
} from "@/lib/catalog";
import { galleryFor, imageFor, materialsFor } from "@/lib/products";
import { SITE_URL, formatMAD } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return {};
  const title = `${p.name} — ${p.tagline}`;
  return {
    title,
    description: `${p.name} : ${p.description} ${
      p.priceFrom ? "À partir de " : ""
    }${formatMAD(p.price)}. Livraison et montage au Maroc.`,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: {
      title: `${p.name} — BTL LIVING`,
      description: p.tagline,
      url: `${SITE_URL}/produit/${p.slug}`,
      images: [{ url: imageFor(p), width: 1200, height: 1500, alt: p.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = await getProductBySlug(params.slug);
  if (!p) notFound();
  const [cat, related] = await Promise.all([
    getCategory(p.category),
    getRelated(p),
  ]);
  const catLabel = cat?.label ?? p.category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: galleryFor(p).map((u) => `${SITE_URL}${u}`),
    sku: p.slug.toUpperCase(),
    brand: { "@type": "Brand", name: "BTL LIVING" },
    category: catLabel,
    material: p.matiere,
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: p.price,
      availability: "https://schema.org/MadeToOrder",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      url: `${SITE_URL}/produit/${p.slug}`,
      seller: { "@type": "Organization", name: "BTL LIVING" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "MAD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 14, maxValue: 42, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 7, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "MA",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        merchantReturnDays: 0,
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: catLabel, item: `${SITE_URL}/collections/${p.category}` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/produit/${p.slug}` },
    ],
  };

  const specs: [string, string][] = [
    ["Finition", p.finition],
    ["Dimensions", p.dimensions],
    ["Délai de fabrication", p.delai],
    ["Référence", p.slug.toUpperCase()],
  ];
  const materials = materialsFor(p);

  return (
    <div className="bg-porcelain pb-[clamp(5rem,11vw,9rem)] pt-[clamp(6.5rem,13vw,10rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-8 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/40"
        >
          <Link href="/" className="transition-colors hover:text-espresso">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/collections/${p.category}`}
            className="transition-colors hover:text-espresso"
          >
            {catLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-espresso/70">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={galleryFor(p)}
            alt={`${p.name} — ${p.tagline}`}
            badge={p.badge}
          />

          <div className="lg:pt-6">
            <span className="text-[0.62rem] font-light uppercase tracking-wide2 text-cognac">
              {catLabel}
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.4rem,5.5vw,4rem)] font-normal leading-[0.98] tracking-[-0.02em]">
              {p.name}
            </h1>
            <p className="mt-3 text-[0.8rem] font-light uppercase tracking-wide2 text-espresso/45">
              {p.tagline}
            </p>

            <p className="mt-6 text-[1.35rem] font-light tabular-nums text-espresso">
              {p.priceFrom && (
                <span className="mr-1 text-[0.7rem] uppercase tracking-wide2 text-espresso/45">
                  à partir de
                </span>
              )}
              {formatMAD(p.price)}
            </p>
            <p className="mt-1 text-[0.7rem] font-light uppercase tracking-wide2 text-espresso/40">
              Livraison & montage inclus · paiement à la livraison
            </p>

            <p className="mt-7 max-w-[46ch] text-[0.95rem] font-light leading-relaxed text-espresso/65">
              {p.description}
            </p>

            {materials.length > 0 && (
              <div className="mt-6">
                <span className="mb-2.5 block text-[0.58rem] font-light uppercase tracking-wide2 text-espresso/45">
                  Composition
                </span>
                <div className="flex flex-wrap gap-2">
                  {materials.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-espresso/15 px-3.5 py-1.5 text-[0.72rem] font-light text-espresso/75"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <AddToCart product={p} />

            <dl className="mt-12 border-t border-espresso/12">
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap justify-between gap-4 border-b border-espresso/12 py-4"
                >
                  <dt className="text-[0.6rem] font-light uppercase tracking-wide2 text-espresso/45">
                    {k}
                  </dt>
                  <dd className="max-w-[62%] text-right text-[0.85rem] font-light text-espresso">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid grid-cols-2 gap-5 text-[0.72rem] font-light leading-relaxed text-espresso/55 sm:grid-cols-4">
              {[
                ["Livraison", "Partout au Maroc"],
                ["Montage", "Par notre équipe"],
                ["Paiement", "À la livraison"],
                ["Sur mesure", "Dimensions ajustables"],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="mb-1 block text-[0.55rem] uppercase tracking-wide2 text-espresso/40">
                    {k}
                  </span>
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <span className="eyebrow rule block text-cognac">
              Dans le même univers
            </span>
            <Reveal
              className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              y={28}
              stagger={0.08}
            >
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}