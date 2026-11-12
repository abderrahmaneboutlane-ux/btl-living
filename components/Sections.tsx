"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useReveal } from "@/lib/useReveal";
import { waLink } from "@/lib/site";
import { FINISHES } from "./Finishes3D";
import NewsletterForm from "./NewsletterForm";

const Finishes3D = dynamic(() => import("./Finishes3D"), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Marquee — a single band of espresso between two porcelain sections */
/* ------------------------------------------------------------------ */
const PROMISES = [
  "Livraison partout au Maroc",
  "Commande sur WhatsApp",
  "Fabrication sur mesure",
  "Montage inclus",
  "Paiement en MAD",
  "Showroom sur rendez-vous",
];

export function Marquee() {
  const row = [...PROMISES, ...PROMISES];
  return (
    <div className="relative overflow-hidden border-y border-espresso/10 bg-espresso py-5">
      <div className="flex w-max animate-[slide_38s_linear_infinite] items-center gap-14 pr-14">
        {row.map((p, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-14 text-[0.62rem] font-light uppercase tracking-wide2 text-porcelain/60"
          >
            {p}
            <span className="text-oak">◆</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes slide {
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Univers — catalogue photography by collection                   */
/* ------------------------------------------------------------------ */
const UNIVERS = [
  { name: "Chambre", href: "/collections/chambre", note: "Lits, têtes de lit, chevets, commodes", image: "/products/whatsapp-20261110/wa-20261110-lit-1-032139650d-4k.webp", alt: "Lit et tête de lit dans une chambre aux tons bois", pos: "50% 58%", span: "lg:col-span-7" },
  { name: "Dressing", href: "/collections/dressing", note: "Penderies, verrières, rangements éclairés", image: "/products/whatsapp-20261110/wa-20261110-dressing-fonce-1-8122545804-4k.webp", alt: "Dressing coulissant en bois foncé", pos: "25% 50%", span: "lg:col-span-5" },
  { name: "Salle à manger", href: "/collections/salle-a-manger", note: "Tables, chaises, buffets", image: "/products/whatsapp-20261110/wa-20261110-table-rectangulaire-claire-1-8f5b6ea9b6-4k.webp", alt: "Table rectangulaire et chaises en bois clair", pos: "50% 53%", span: "lg:col-span-7" },
  { name: "Coiffeuse & décor", href: "/collections/coiffeuse-decor", note: "Miroirs, consoles, objets", image: "/products/whatsapp-20261110/wa-20261110-coiffeuse-ronde-1-2f39b4a5a1-4k.webp", alt: "Coiffeuse avec miroir rond éclairé", pos: "50% 49%", span: "lg:col-span-5" },
];

export function Univers() {
  const ref = useReveal<HTMLElement>({ y: 40, stagger: 0.08 });
  return (
    <section ref={ref} id="univers" className="bg-porcelain py-[clamp(5rem,11vw,9rem)]">
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <span data-reveal className="eyebrow rule block text-cognac">
              Les univers
            </span>
            <h2
              data-reveal
              className="mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-normal leading-[0.95] tracking-[-0.02em]"
            >
              Chaque pièce, <span className="italic text-cognac">son décor</span>
            </h2>
          </div>
          <Link
            data-reveal
            href="/collections"
            className="group inline-flex items-center gap-3 pb-1 text-[0.64rem] font-light uppercase tracking-wide2 text-espresso/70 transition-colors hover:text-cognac"
          >
            Voir la boutique
            <span className="inline-block h-px w-8 bg-current transition-all duration-500 ease-luxe group-hover:w-12" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
          {UNIVERS.map((u) => (
            <Link
              key={u.name}
              data-reveal
              href={u.href}
              className={`group relative block h-[clamp(240px,32vw,420px)] overflow-hidden bg-espresso ${u.span}`}
            >
              <Image
                src={u.image}
                alt={u.alt}
                fill
                sizes="(max-width: 767px) 88vw, (max-width: 1023px) 44vw, 52vw"
                style={{ objectPosition: u.pos }}
                className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                <span>
                  <span className="block font-display text-[1.6rem] leading-none text-porcelain">
                    {u.name}
                  </span>
                  <span className="mt-2 block text-[0.6rem] font-light uppercase tracking-wide2 text-porcelain/55">
                    {u.note}
                  </span>
                </span>
                <span className="mb-1 inline-block h-px w-7 bg-oak transition-all duration-500 ease-luxe group-hover:w-12" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/*  Récit — sticky image, editorial beats scroll past                  */
/* ------------------------------------------------------------------ */
const BEATS = [
  {
    k: "Le lieu d'abord",
    t: "Nous partons de vos volumes, de votre lumière, de la façon dont vous circulez. Le meuble vient après — pour servir la pièce, pas l'inverse.",
  },
  {
    k: "Une matière, tenue",
    t: "Noyer massif, travertin, laiton bruni, lin lavé. Des matières franches qui prennent leur patine et traversent les années sans se démoder.",
  },
  {
    k: "Fabriqué, pas assemblé",
    t: "Chaque pièce est réalisée sur commande, contrôlée à la main, livrée et montée par notre équipe. De l'atelier à votre intérieur.",
  },
];

export function Recit() {
  const ref = useReveal<HTMLElement>({ y: 32, stagger: 0.12 });
  return (
    <section ref={ref} className="bg-plaster">
      <div className="mx-auto grid max-w-[1400px] gap-x-[6vw] px-[6vw] py-[clamp(5rem,11vw,9rem)] lg:grid-cols-2">
        {/* sticky image */}
        <div className="relative hidden lg:block">
          <div className="sticky top-24 h-[78vh] overflow-hidden bg-espresso">
            <Image
              src="/showroom.jpg"
              alt="Atelier BTL LIVING — coiffeuse, marbre et noyer"
              fill
              sizes="50vw"
              style={{ objectPosition: "48% 34%" }}
              className="object-cover"
            />
            <span className="grain absolute inset-0" aria-hidden="true" />
          </div>
        </div>

        {/* beats */}
        <div>
          <span data-reveal className="eyebrow rule block text-cognac">
            Notre approche
          </span>
          <h2
            data-reveal
            className="mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] font-normal leading-[0.98] tracking-[-0.02em]"
          >
            Trois principes, <span className="italic text-cognac">tenus</span>
          </h2>

          <div className="mt-14 space-y-16">
            {BEATS.map((b, i) => (
              <div key={b.k} data-reveal className="border-t border-espresso/15 pt-7">
                <span className="font-display text-[2.4rem] leading-none text-cognac/30">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-[1.7rem]">{b.k}</h3>
                <p className="mt-3 max-w-[46ch] text-[0.92rem] font-light leading-relaxed text-espresso/60">
                  {b.t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Manifesto — the dark counterweight                                 */
/* ------------------------------------------------------------------ */
export function Manifesto() {
  const ref = useReveal<HTMLElement>({ y: 44, stagger: 0.12 });
  return (
    <section
      ref={ref}
      id="maison"
      className="grain relative bg-espresso py-[clamp(6rem,13vw,11rem)] text-porcelain"
    >
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <span data-reveal className="eyebrow rule block text-oak">
          La maison
        </span>
        <h2
          data-reveal
          className="mt-9 max-w-[19ch] font-display text-[clamp(2.2rem,6vw,5.4rem)] font-normal leading-[1.02] tracking-[-0.02em]"
        >
          Un meuble n&apos;habille pas une pièce.{" "}
          <span className="italic text-oak">Il la définit.</span>
        </h2>
        <div className="mt-14 grid max-w-4xl gap-10 md:grid-cols-2">
          <p data-reveal className="text-[0.95rem] font-light leading-relaxed text-porcelain/65">
            BTL LIVING dessine du mobilier pour la façon dont on vit aujourd&apos;hui
            au Maroc : de la lumière, des volumes généreux, des matières franches
            et des lignes qui ne se démodent pas.
          </p>
          <p data-reveal className="text-[0.95rem] font-light leading-relaxed text-porcelain/65">
            Chaque pièce est pensée comme l&apos;élément d&apos;un ensemble — une
            chambre qui respire, un dressing qui s&apos;efface, une table qui
            rassemble. Le but n&apos;est pas de remplir un espace, mais de lui
            donner sa forme.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Finitions — the 3D moment                                          */
/* ------------------------------------------------------------------ */
export function Finitions() {
  const ref = useReveal<HTMLElement>({ y: 36, stagger: 0.09 });
  const [active, setActive] = useState<string | null>(null);

  return (
    <section ref={ref} id="finitions" className="bg-plaster py-[clamp(5rem,11vw,9rem)]">
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <div className="max-w-[46ch]">
          <span data-reveal className="eyebrow rule block text-cognac">
            Nos finitions
          </span>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-normal leading-[0.98] tracking-[-0.02em]"
          >
            La matière <span className="italic text-cognac">d&apos;abord</span>
          </h2>
          <p
            data-reveal
            className="mt-6 text-[0.92rem] font-light leading-relaxed text-espresso/60"
          >
            Survolez une sphère pour l&apos;examiner. Les finitions présentées sont
            disponibles sur l&apos;ensemble des collections.
          </p>
        </div>
      </div>

      <div data-reveal className="mt-6">
        <Finishes3D onActive={setActive} />
      </div>

      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <div className="grid gap-px border-t border-espresso/12 sm:grid-cols-2 lg:grid-cols-4">
          {FINISHES.map((f) => (
            <div
              key={f.id}
              data-reveal
              className={`border-b border-espresso/12 py-6 pr-6 transition-opacity duration-500 ${
                active && active !== f.id ? "opacity-35" : "opacity-100"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: f.color }}
                />
                <span className="font-display text-[1.15rem]">{f.name}</span>
              </span>
              <span className="mt-2 block text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/45">
                {f.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Savoir-faire — numbered, because it IS a sequence                  */
/* ------------------------------------------------------------------ */
const ETAPES = [
  { n: "01", t: "Écoute", d: "On part de votre plan, de vos volumes et de votre lumière." },
  { n: "02", t: "Dessin", d: "Une proposition dessinée, ajustée jusqu'à ce qu'elle soit juste." },
  { n: "03", t: "Fabrication", d: "Matériaux sélectionnés, finitions contrôlées pièce par pièce." },
  { n: "04", t: "Installation", d: "Livraison et montage chez vous, par notre équipe." },
];

export function SavoirFaire() {
  const ref = useReveal<HTMLElement>({ y: 34, stagger: 0.1 });
  return (
    <section ref={ref} id="savoir-faire" className="bg-porcelain py-[clamp(5rem,11vw,9rem)]">
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <span data-reveal className="eyebrow rule block text-cognac">
          Savoir-faire
        </span>
        <h2
          data-reveal
          className="mt-6 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] font-normal leading-[0.98] tracking-[-0.02em]"
        >
          Du plan à <span className="italic text-cognac">votre intérieur</span>
        </h2>

        <div className="mt-16 grid gap-px border-t border-espresso/12 md:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((e) => (
            <div
              key={e.n}
              data-reveal
              className="group border-b border-espresso/12 py-9 pr-8 transition-colors duration-500 lg:border-r lg:last:border-r-0"
            >
              <span className="font-display text-[2.6rem] leading-none text-cognac/35 transition-colors duration-500 group-hover:text-cognac">
                {e.n}
              </span>
              <h3 className="mt-5 font-display text-[1.5rem]">{e.t}</h3>
              <p className="mt-3 text-[0.86rem] font-light leading-relaxed text-espresso/55">
                {e.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Témoignages — structure only, no invented reviews                  */
/* ------------------------------------------------------------------ */
export interface TemoignageItem {
  quote: string;
  prenom: string;
  ville: string;
  rating: number;
}

export function Temoignages({ items = [] }: { items?: TemoignageItem[] }) {
  const ref = useReveal<HTMLElement>({ y: 30, stagger: 0.09 });
  const hasReal = items.length > 0;
  const list: (TemoignageItem | null)[] = hasReal
    ? items.slice(0, 6)
    : [null, null, null];

  return (
    <section ref={ref} className="bg-plaster py-[clamp(5rem,11vw,9rem)]">
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <span data-reveal className="eyebrow rule block text-cognac">
          Témoignages
        </span>
        <h2
          data-reveal
          className="mt-6 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] font-normal leading-[0.98] tracking-[-0.02em]"
        >
          Ils ont meublé <span className="italic text-cognac">chez eux</span>
        </h2>
        {!hasReal && (
          <p
            data-reveal
            className="mt-6 max-w-[46ch] text-[0.9rem] font-light leading-relaxed text-espresso/55"
          >
            Le module lit vos avis vérifiés depuis Supabase (table
            <span className="font-normal"> testimonials</span>, champ
            <span className="font-normal"> published</span>).
          </p>
        )}

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {list.map((t, i) =>
            t ? (
              <figure
                key={i}
                data-reveal
                className="flex min-h-[210px] flex-col justify-between border border-espresso/12 bg-porcelain p-8"
              >
                <span
                  aria-label={`${t.rating} sur 5`}
                  className="text-[0.8rem] tracking-[0.35em] text-cognac"
                >
                  {"★".repeat(Math.max(1, Math.min(5, t.rating)))}
                </span>
                <blockquote className="mt-4 text-[0.9rem] font-light leading-relaxed text-espresso/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/45">
                  {t.prenom}
                  {t.ville ? ` · ${t.ville}` : ""}
                </figcaption>
              </figure>
            ) : (
              <div
                key={i}
                data-reveal
                className="flex min-h-[210px] flex-col justify-between border border-dashed border-espresso/20 p-8"
              >
                <span className="text-[0.8rem] tracking-[0.35em] text-cognac/40">
                  ★★★★★
                </span>
                <p className="text-[0.82rem] font-light leading-relaxed text-espresso/40">
                  Emplacement témoignage n°{i + 1} — ajoutez une ligne dans la
                  table <span className="font-normal">testimonials</span>.
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */
const CONTACT_WA = waLink("Bonjour BTL LIVING, je souhaite des informations sur vos collections.");

export function Contact() {
  const ref = useReveal<HTMLElement>({ y: 38, stagger: 0.1 });
  return (
    <section
      ref={ref}
      id="contact"
      className="grain relative overflow-hidden bg-espresso py-[clamp(6rem,14vw,12rem)] text-porcelain"
    >
      <Image
        src="/showroom.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="object-cover opacity-[0.16]"
        style={{ objectPosition: "50% 35%" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-[6vw]">
        <span data-reveal className="eyebrow rule block text-oak">
          Parlons de votre projet
        </span>
        <h2
          data-reveal
          className="mt-8 max-w-[15ch] font-display text-[clamp(2.6rem,7vw,6rem)] font-normal leading-[0.94] tracking-[-0.02em]"
        >
          Votre intérieur <span className="italic text-oak">commence ici</span>
        </h2>
        <p
          data-reveal
          className="mt-7 max-w-[44ch] text-[0.95rem] font-light leading-relaxed text-porcelain/65"
        >
          Envoyez-nous vos dimensions ou vos photos — nous revenons vers vous avec
          une proposition dessinée.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            data-reveal
            href={CONTACT_WA}
            target="_blank"
            rel="noopener"
            className="group relative overflow-hidden border border-oak bg-oak px-10 py-5 text-[0.66rem] font-light uppercase tracking-wide2 text-espresso transition-colors duration-700 ease-luxe hover:text-porcelain"
          >
            <span className="relative z-10">Écrire sur WhatsApp</span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-cognac transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
          </a>
          <a
            data-reveal
            href="mailto:contact@btl-living.com"
            className="border border-porcelain/35 px-10 py-5 text-[0.66rem] font-light uppercase tracking-wide2 text-porcelain transition-colors duration-500 hover:border-oak hover:text-oak"
          >
            Nous écrire
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="border-t border-espresso/10 bg-porcelain py-16">
      <div className="mx-auto max-w-[1400px] px-[6vw]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="block font-display text-[1.7rem] tracking-[0.16em]">
              BTL
            </span>
            <span className="mt-1 block text-[0.55rem] font-light uppercase tracking-luxe text-cognac">
              Living
            </span>
            <p className="mt-6 max-w-[30ch] text-[0.82rem] font-light leading-relaxed text-espresso/55">
              Maison marocaine de mobilier. Chambres, dressings, salles à manger et coiffeuses.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h4 className="text-[0.58rem] font-light uppercase tracking-luxe text-espresso/40">
              Boutique
            </h4>
            <ul className="mt-6 space-y-3 text-[0.85rem] font-light text-espresso/70">
              {UNIVERS.map((u) => (
                <li key={u.name}>
                  <Link href={u.href} className="transition-colors hover:text-cognac">
                    {u.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[0.58rem] font-light uppercase tracking-luxe text-espresso/40">
              Maison
            </h4>
            <ul className="mt-6 space-y-3 text-[0.85rem] font-light text-espresso/70">
              <li><a href="#maison" className="transition-colors hover:text-cognac">À propos</a></li>
              <li><a href="#savoir-faire" className="transition-colors hover:text-cognac">Savoir-faire</a></li>
              <li><a href="#finitions" className="transition-colors hover:text-cognac">Finitions</a></li>
              <li><a href="#contact" className="transition-colors hover:text-cognac">Contact</a></li>
              <li className="text-espresso/35">
                Livraison <span className="text-[0.62rem]">⚙︎ à préciser</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[0.58rem] font-light uppercase tracking-luxe text-espresso/40">
              Contact
            </h4>
            <ul className="mt-6 space-y-3 text-[0.85rem] font-light text-espresso/70">
              <li>
                <a href={CONTACT_WA} target="_blank" rel="noopener" className="transition-colors hover:text-cognac">
                  WhatsApp · +212 708 029 551
                </a>
              </li>
              <li>
                <a href="tel:+212708029551" className="transition-colors hover:text-cognac">
                  +212 708 029 551
                </a>
              </li>
              <li>
                <a href="mailto:contact@btl-living.com" className="transition-colors hover:text-cognac">
                  contact@btl-living.com
                </a>
              </li>
              <li className="text-espresso/70">Souk Kriaa, Casablanca</li>
              <li className="text-espresso/35">
                Instagram <span className="text-[0.62rem]">⚙︎ @btlliving</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-espresso/10 pt-7 text-[0.62rem] font-light uppercase tracking-wide2 text-espresso/40">
          <span>© {new Date().getFullYear()} BTL Living — Souk Kriaa, Casablanca, Maroc</span>
          <span>Livraison partout au Maroc</span>
        </div>
      </div>
    </footer>
  );
}