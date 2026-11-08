import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre sélection BTL LIVING.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/panier" },
};

export default function PanierPage() {
  return (
    <div className="bg-porcelain pb-[clamp(5rem,11vw,9rem)] pt-[clamp(7rem,14vw,11rem)]">
      <div className="mx-auto max-w-[1200px] px-[6vw]">
        <span className="eyebrow rule block text-cognac">Votre sélection</span>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.02em]">
          Panier
        </h1>
        <div className="mt-12">
          <CartView />
        </div>
      </div>
    </div>
  );
}