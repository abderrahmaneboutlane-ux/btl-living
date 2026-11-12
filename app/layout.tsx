import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Curtain from "@/components/Curtain";

/* Domaine de production. Sert de base aux URLs canoniques / OG / sitemap. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.btl-living.com";
const PHONE = "+212708029551";

const display = localFont({
  src: [
    { path: "./fonts/bodoni_moda-normal.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/bodoni_moda-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Didot", "Playfair Display", "Georgia", "serif"],
});

const sans = localFont({
  src: "./fonts/jost-normal.woff2",
  weight: "200 500",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BTL LIVING — Mobilier d'exception au Maroc",
    template: "%s · BTL LIVING",
  },
  description:
    "BTL LIVING — maison marocaine de mobilier. Chambres à coucher, dressings sur mesure, salles à manger, coiffeuses et meubles de rangement dessinés comme une architecture et fabriqués pour durer. Showroom, conseil et livraison partout au Maroc.",
  applicationName: "BTL LIVING",
  authors: [{ name: "BTL LIVING" }],
  creator: "BTL LIVING",
  publisher: "BTL LIVING",
  keywords: [
    "meuble Maroc",
    "mobilier Maroc",
    "mobilier de luxe Maroc",
    "meuble moderne Maroc",
    "chambre à coucher Maroc",
    "dressing sur mesure Maroc",
    "salle à manger Maroc",
    "meuble sur mesure Casablanca",
    "meuble Rabat",
    "meuble Marrakech",
    "BTL Living",
  ],
  category: "furniture",
  alternates: {
    canonical: "/",
    languages: { "fr-MA": "/" },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE_URL,
    siteName: "BTL LIVING",
    title: "BTL LIVING — Mobilier d'exception au Maroc",
    description:
      "Maison marocaine de mobilier. Chambres, dressings, salles à manger et coiffeuses — pensés, dessinés, fabriqués pour durer.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Showroom BTL LIVING — chambre, dressing, coiffeuse et salle à manger en noyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL LIVING — Mobilier d'exception au Maroc",
    description:
      "Maison marocaine de mobilier. Pensé, dessiné, fabriqué pour durer.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#1A1512",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/* schema.org — FurnitureStore. ⚙︎ Compléter address (rue / ville) et sameAs
   (profils sociaux) avant mise en ligne. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "BTL LIVING",
  description:
    "Maison marocaine de mobilier : chambres, dressings sur mesure, salles à manger, coiffeuses et rangements.",
  url: SITE_URL,
  image: `${SITE_URL}/showroom.jpg`,
  logo: `${SITE_URL}/showroom.jpg`,
  telephone: PHONE,
  priceRange: "$$$",
  currenciesAccepted: "MAD",
  knowsLanguage: ["fr", "ar"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: PHONE,
    contactType: "sales",
    areaServed: "MA",
    availableLanguage: ["French", "Arabic"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Souk Kriaa",
    addressLocality: "Casablanca",
    addressRegion: "Casablanca-Settat",
    addressCountry: "MA",
  },
  areaServed: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Agadir",
    "Fès",
    "Meknès",
  ].map((name) => ({ "@type": "City", name })),
};

const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BTL LIVING",
  url: SITE_URL,
  inLanguage: "fr-MA",
  publisher: { "@type": "Organization", name: "BTL LIVING", url: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-porcelain text-espresso antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />
        <SmoothScroll />
        <Curtain />
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}