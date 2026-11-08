"use client";

import { useState } from "react";
import { useReveal } from "@/lib/useReveal";
import { FAQ_ITEMS } from "@/lib/faq";


export function FaqSection() {
  const ref = useReveal<HTMLElement>({ y: 28, stagger: 0.08 });
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      ref={ref}
      id="faq"
      className="bg-porcelain py-[clamp(5rem,11vw,9rem)]"
    >
      <div className="mx-auto grid max-w-[1400px] gap-x-[6vw] px-[6vw] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span data-reveal className="eyebrow rule block text-cognac">
            Questions fréquentes
          </span>
          <h2
            data-reveal
            className="mt-6 max-w-[14ch] font-display text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[0.98] tracking-[-0.02em]"
          >
            Avant de <span className="italic text-cognac">commander</span>
          </h2>
        </div>

        <dl className="mt-10 border-t border-espresso/15 lg:mt-1">
          {FAQ_ITEMS.map((it, i) => (
            <div key={it.q} data-reveal className="border-b border-espresso/15">
              <dt>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-[1.25rem] leading-snug">
                    {it.q}
                  </span>
                  <span
                    className={`shrink-0 text-cognac transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </dt>
              <dd
                className={`grid overflow-hidden text-[0.9rem] font-light leading-relaxed text-espresso/60 transition-all duration-500 ease-luxe ${
                  open === i ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <span className="min-h-0 max-w-[54ch]">{it.a}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}