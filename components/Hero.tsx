"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CATS = ["Chambre", "Dressing", "Salle à manger", "Salon", "Sur mesure"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, delay: 1.9 })
        .from("[data-h-eyebrow]", { opacity: 0, y: 14, duration: 0.9 })
        .from(
          "[data-h-line]",
          { yPercent: 115, duration: 1.2, stagger: 0.12 },
          "-=0.5",
        )
        .from("[data-h-sub]", { opacity: 0, y: 16, duration: 0.9 }, "-=0.7")
        .from(
          "[data-h-cta]",
          { opacity: 0, y: 14, duration: 0.8, stagger: 0.1 },
          "-=0.6",
        )
        .from(
          "[data-h-cats] > *",
          { opacity: 0, y: 8, duration: 0.6, stagger: 0.04 },
          "-=0.5",
        )
        .from("[data-h-cue]", { opacity: 0, duration: 0.9 }, "-=0.3");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-espresso"
    >
      {/* media — art-directed: a portrait crop on phones, the wide render above 640px */}
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source
            media="(max-width: 640px)"
            srcSet="/showroom-mobile.webp"
            type="image/webp"
          />
          <source media="(max-width: 640px)" srcSet="/showroom-mobile.jpg" />
          <source srcSet="/showroom.webp" type="image/webp" />
          <img
            src="/showroom.jpg"
            alt="Showroom BTL LIVING — chambre, dressing et salle à manger en noyer, Casablanca"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="hero-kb absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </div>
      <div className="hero-vignette" aria-hidden="true" />

      {/* legibility — diagonal wash on desktop where the copy sits lower-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(22,17,14,0.82) 0%, rgba(22,17,14,0.6) 26%, rgba(22,17,14,0.28) 46%, rgba(22,17,14,0.06) 62%, rgba(22,17,14,0) 76%)",
        }}
      />
      {/* mobile — a clean bottom-up scrim so the copy always reads */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 sm:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(18,13,10,0.97) 0%, rgba(18,13,10,0.9) 14%, rgba(18,13,10,0.68) 31%, rgba(18,13,10,0.36) 50%, rgba(18,13,10,0.1) 70%, rgba(18,13,10,0) 87%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/3 sm:block"
        style={{
          background:
            "linear-gradient(to top, rgba(24,19,16,0.55) 0%, rgba(24,19,16,0.12) 38%, rgba(24,19,16,0) 62%)",
        }}
      />
      {/* thin top wash for the nav */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36"
        style={{
          background:
            "linear-gradient(to bottom, rgba(22,17,14,0.68), rgba(22,17,14,0))",
        }}
      />

      {/* content — bottom-left column */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 sm:px-[6vw] sm:pb-[10vh] sm:pt-40">
        <div className="max-w-[34rem]">
          <span
            data-h-eyebrow
            className="eyebrow rule block text-[0.58rem] uppercase text-oak [letter-spacing:0.22em] sm:text-[0.66rem] sm:[letter-spacing:0.38em]"
            style={{ textShadow: "0 1px 10px rgba(24,19,16,0.85)" }}
          >
            Maison de mobilier · Casablanca
          </span>

          <h1 className="mt-6 font-display font-normal leading-[0.9] tracking-[-0.025em] text-porcelain sm:mt-7 sm:leading-[0.88]">
            <span className="clip">
              <span
                data-h-line
                className="block text-[clamp(2.85rem,11.5vw,6.2rem)]"
              >
                L&apos;art de
              </span>
            </span>
            <span className="clip">
              <span
                data-h-line
                className="block text-[clamp(2.85rem,11.5vw,6.2rem)] italic text-oak"
              >
                l&apos;intérieur
              </span>
            </span>
            <span className="sr-only">
              {" "}— BTL LIVING, maison marocaine de mobilier d&apos;exception :
              chambres, dressings sur mesure, salles à manger et salons. Showroom
              à Casablanca, livraison partout au Maroc.
            </span>
          </h1>

          <p
            data-h-sub
            className="mt-6 max-w-[32ch] text-[0.9rem] font-light leading-relaxed text-porcelain/90 sm:mt-7 sm:text-[0.95rem]"
            style={{ textShadow: "0 1px 14px rgba(24,19,16,0.9)" }}
          >
            Chambres, dressings, salles à manger et salons — dessinés comme une
            architecture, fabriqués pour durer une vie.
          </p>

          <div className="mt-8 flex flex-col items-start gap-y-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <Link
              data-h-cta
              href="/collections"
              className="group relative w-full overflow-hidden border border-porcelain/60 px-8 py-4 text-center text-[0.64rem] font-light uppercase tracking-wide2 text-porcelain transition-colors duration-700 ease-luxe hover:text-espresso sm:w-auto sm:py-3.5"
            >
              <span className="relative z-10">Découvrir la boutique</span>
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-porcelain transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
            </Link>
            <a
              data-h-cta
              href="#contact"
              className="group inline-flex items-center gap-3 py-1 text-[0.64rem] font-light uppercase tracking-wide2 text-porcelain/85 transition-colors hover:text-oak"
              style={{ textShadow: "0 1px 10px rgba(24,19,16,0.85)" }}
            >
              Prendre rendez-vous
              <span className="inline-block h-px w-7 bg-current transition-all duration-500 ease-luxe group-hover:w-12" />
            </a>
          </div>
        </div>

        <div
          data-h-cats
          className="mt-14 hidden max-w-[40rem] flex-wrap items-center gap-x-8 gap-y-2 border-t border-porcelain/15 pt-5 text-[0.56rem] font-light uppercase tracking-wide2 text-porcelain/60 sm:flex"
          style={{ textShadow: "0 1px 8px rgba(24,19,16,0.75)" }}
        >
          {CATS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-h-cue
        className="pointer-events-none absolute bottom-8 right-[6vw] z-10 hidden items-center gap-3 md:flex"
      >
        <span className="text-[0.54rem] font-light uppercase tracking-luxe text-porcelain/55">
          Défiler
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-porcelain/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[cue_2.6s_cubic-bezier(0.19,1,0.22,1)_infinite] bg-oak" />
        </span>
      </div>

      <style jsx>{`
        @keyframes cue {
          0% {
            transform: translateY(-100%);
          }
          60%,
          100% {
            transform: translateY(320%);
          }
        }
      `}</style>
    </section>
  );
}