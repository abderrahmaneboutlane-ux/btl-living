import Image from "next/image";
import Link from "next/link";
import { formatMAD } from "@/lib/site";
import { imageFor, type Product } from "@/lib/products";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block"
      data-reveal
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-plaster">
        <Image
          src={imageFor(product)}
          alt={`${product.name} — ${product.tagline}`}
          fill
          priority={priority}
          quality={85}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-contain"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 bg-espresso/90 px-3 py-1.5 text-[0.55rem] font-light uppercase tracking-wide2 text-porcelain">
            {product.badge}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-espresso/70 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-[0.62rem] font-light uppercase tracking-wide2 text-porcelain">
            Voir le produit
          </span>
          <span className="inline-block h-px w-7 bg-oak transition-all duration-500 ease-luxe group-hover:w-11" />
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[1.3rem] leading-tight">{product.name}</h3>
        <span className="whitespace-nowrap text-[0.82rem] font-light text-espresso/70 tabular-nums">
          {product.priceFrom ? "dès " : ""}
          {product.price > 0 ? formatMAD(product.price) : "Prix à renseigner"}
        </span>
      </div>
      <p className="mt-1 text-[0.72rem] font-light uppercase tracking-wide2 text-espresso/40">
        {product.tagline}
      </p>
    </Link>
  );
}
