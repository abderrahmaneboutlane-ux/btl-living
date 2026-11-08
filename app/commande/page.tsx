import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande BTL LIVING.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/commande" },
};

export default function CommandePage() {
  return (
    <div className="bg-porcelain pb-[clamp(5rem,11vw,9rem)] pt-[clamp(7rem,14vw,11rem)]">
      <div className="mx-auto max-w-[1200px] px-[6vw]">
        <span className="eyebrow rule block text-cognac">Dernière étape</span>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.02em]">
          Commande
        </h1>
        <div className="mt-12">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}