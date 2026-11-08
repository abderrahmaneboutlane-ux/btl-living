import Hero from "@/components/Hero";
import {
  Contact,
  Finitions,
  Manifesto,
  Marquee,
  Recit,
  SavoirFaire,
  Temoignages,
  Univers,
} from "@/components/Sections";
import { getTestimonials } from "@/lib/catalog";
import { FaqSection } from "@/components/Faq";
import { FAQ_ITEMS } from "@/lib/faq";

export const revalidate = 3600;

export default async function Page() {
  const testimonials = await getTestimonials();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <main id="top" className="relative">
      {/* LCP hero — art-directed preload so the right crop starts loading immediately */}
      <link
        rel="preload"
        as="image"
        href="/showroom-mobile.webp"
        media="(max-width: 640px)"
        type="image/webp"
      />
      <link
        rel="preload"
        as="image"
        href="/showroom.webp"
        media="(min-width: 641px)"
        type="image/webp"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Hero />
      <Marquee />
      <Univers />
      <Recit />
      <Manifesto />
      <Finitions />
      <SavoirFaire />
      <Temoignages items={testimonials} />
      <FaqSection />
      <Contact />
    </main>
  );
}